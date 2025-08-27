"use client";

import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Heart, Shield } from "lucide-react";
import { DonationAmount } from "@/lib/types";
import { donationAmounts } from "@/lib";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface DonationFormProps {
  onDonationComplete: (amount: number) => void;
}

/**
 * DonationForm Component
 *
 * Handles both one-time and recurring donations using Stripe.
 * Based on the working implementation from the old project.
 *
 * Payment Flows:
 * 1. One-time donations: Uses Stripe Payment Intents with CardElement
 * 2. Recurring donations: Creates subscription with dynamic pricing
 *
 * Stripe Integration:
 * - CardElement: For secure payment input
 * - createPaymentMethod: Creates payment method from card data
 * - confirmCardPayment: Confirms payment with payment method
 * - Subscriptions: For recurring payments with dynamic pricing
 */
const DonationForm: React.FC<DonationFormProps> = ({ onDonationComplete }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { data: session } = useSession();

  const [selectedAmount, setSelectedAmount] = useState<DonationAmount | null>(
    null
  );
  const [customAmount, setCustomAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [donorData, setDonorData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  });
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleAmountSelect = (amount: DonationAmount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setError(null);
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
    setError(null);
  };

  const getCurrentAmount = (): number => {
    return selectedAmount
      ? selectedAmount.value
      : parseFloat(customAmount) || 0;
  };

  const handleDonorInputChange = (field: string, value: string) => {
    setDonorData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  /**
   * Handle payment submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again.");
      return;
    }

    const amount = getCurrentAmount();
    if (amount < 5) {
      setError("Minimum donation amount is $5");
      return;
    }

    // For anonymous users, require name and email
    if (!session && (!donorData.name || !donorData.email)) {
      setError("Please fill in your name and email");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Get the card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Create payment method
      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

      if (paymentMethodError) {
        throw new Error(
          paymentMethodError.message || "Payment method creation failed"
        );
      }

      // Create payment intent or subscription via API
      const res = await fetch("/api/donations/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donationAmount: amount * 100, // Convert to cents
          donorName: donorData.name,
          donorEmail: donorData.email,
          donationType: "donation",
          isRecurring,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create payment");
      }

      console.log("[DEBUG] API Response:", data);

      if (!data.clientSecret) {
        throw new Error("No client secret received from server");
      }

      // Confirm the payment
      let confirmResult;
      if (isRecurring && data.subscriptionId) {
        // Handle subscription confirmation
        confirmResult = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: paymentMethod.id,
        });
      } else {
        // Handle one-time payment confirmation
        confirmResult = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: paymentMethod.id,
        });
      }

      if (confirmResult.error) {
        throw new Error(confirmResult.error.message || "Payment failed");
      }

      // Mark donation as paid in PetParent record
      if (session?.user?.refId) {
        try {
          const updateResponse = await fetch("/api/pet-parent/update-donation-status", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              petParentId: session.user.refId,
              donationPaid: true,
              lastDonationAmount: amount,
              lastDonationDate: new Date().toISOString(),
            }),
          });

          if (!updateResponse.ok) {
            console.error("Failed to update donation status");
          }
        } catch (error) {
          console.error("Error updating donation status:", error);
        }
      }

      setCompleted(true);
      setError(null);
      setTimeout(() => onDonationComplete(amount), 1500);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Heart className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Support Rexvet</h3>
        <p className="text-gray-600 text-sm mt-1">
          Your donation goes directly to helping pets in need.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose Donation Amount
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            {donationAmounts.map((amount) => (
              <button
                key={amount.value}
                type="button"
                onClick={() => handleAmountSelect(amount)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                  selectedAmount?.value === amount.value
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                <div className="font-bold">${amount.value}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {amount.description}
                </div>
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="5"
              step="0.01"
            />
          </div>
        </div>

        {/* Recurring Donation Option */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="recurring"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="recurring" className="text-sm text-gray-700">
            Make this a monthly recurring donation
          </label>
        </div>

        {/* Donor Information - Only show for anonymous users */}
        {!session && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={donorData.name}
                onChange={(e) => handleDonorInputChange("name", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={donorData.email}
                onChange={(e) => handleDonorInputChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Information
            </label>
            <div className="p-4 border border-gray-300 rounded-lg">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Secure Payment</p>
            <p>
              Your payment information is encrypted and secure. We never store
              your card details.
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            processing ||
            (!session && (!donorData.name || !donorData.email)) ||
            getCurrentAmount() < 5
          }
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {processing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            `${
              isRecurring ? "Start Monthly" : "Donate"
            } $${getCurrentAmount()}${isRecurring ? "/month" : ""}`
          )}
        </button>
      </form>
    </div>
  );
};

export default DonationForm;
