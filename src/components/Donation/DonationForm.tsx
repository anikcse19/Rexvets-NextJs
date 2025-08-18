"use client";

import React, { useState } from "react";
import { Heart, CreditCard, Shield, Check } from "lucide-react";
import { DonationAmount } from "@/lib/types";
import { donationAmounts } from "@/lib";

interface DonationFormProps {
  onDonationComplete: (amount: number) => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ onDonationComplete }) => {
  const [selectedAmount, setSelectedAmount] = useState<DonationAmount | null>(
    null
  );
  const [customAmount, setCustomAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  const handleAmountSelect = (amount: DonationAmount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getCurrentAmount = (): number => {
    return selectedAmount
      ? selectedAmount.value
      : parseFloat(customAmount) || 0;
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = getCurrentAmount();

    if (amount < 5) {
      alert("Minimum donation amount is $5");
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setCompleted(true);
    setProcessing(false);

    setTimeout(() => {
      onDonationComplete(amount);
    }, 1500);
  };

  if (completed) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600 mb-4">
          Your donation of ${getCurrentAmount()} has been processed
          successfully.
        </p>
        <p className="text-sm text-gray-500">
          Your appointment is now confirmed and you'll receive a confirmation
          email shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Heart className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Support Street Dogs</h3>
        <p className="text-gray-600 text-sm mt-1">
          Your appointment fee goes directly to helping street dogs in need
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose Donation Amount
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {donationAmounts.map((amount) => (
              <button
                key={amount.value}
                type="button"
                onClick={() => handleAmountSelect(amount)}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedAmount?.value === amount.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="font-semibold text-gray-900">
                  {amount.label}
                </div>
                <div className="text-sm text-gray-600">
                  {amount.description}
                </div>
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="5"
            />
          </div>
        </div>

        {/* Card Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-700">Payment Details</span>
            <Shield className="w-4 h-4 text-green-600" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              value={cardData.number}
              onChange={(e) =>
                handleCardInputChange(
                  "number",
                  formatCardNumber(e.target.value)
                )
              }
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                value={cardData.expiry}
                onChange={(e) =>
                  handleCardInputChange("expiry", formatExpiry(e.target.value))
                }
                placeholder="MM/YY"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={5}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVC
              </label>
              <input
                type="text"
                value={cardData.cvc}
                onChange={(e) =>
                  handleCardInputChange(
                    "cvc",
                    e.target.value.replace(/\D/g, "").slice(0, 3)
                  )
                }
                placeholder="123"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={3}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardData.name}
              onChange={(e) => handleCardInputChange("name", e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={getCurrentAmount() < 5 || processing}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              <Heart className="w-4 h-4" />
              Donate ${getCurrentAmount()} & Confirm Appointment
            </>
          )}
        </button>

        <div className="text-xs text-gray-500 text-center">
          <Shield className="w-3 h-3 inline mr-1" />
          Your payment information is secure and encrypted
        </div>
      </form>
    </div>
  );
};

export default DonationForm;
