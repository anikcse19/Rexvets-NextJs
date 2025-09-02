"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Lock, Shield } from "lucide-react";
import { toast } from "sonner";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface PaymentModalProps {
  formData: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  pharmacyName: string;
  setChangesData: React.Dispatch<React.SetStateAction<boolean>>;
}

export function PaymentModal({
  formData,
  isOpen,
  onClose,
  onSuccess,
  amount,
  pharmacyName,
  setChangesData,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  console.log("formData from modal", formData);

  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }
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
      const res = await fetch("/api/pharmacy-transfer/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pharmacyName: formData.pharmacyName, // Convert to cents
          phoneNumber: formData.phoneNumber,
          street: formData.street,
          city: formData.city,
          state: formData?.state,
          appointment: formData.appointmentId,
          status: "pending",
          amount: 19.99,
          paymentStatus: "paid",
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

      const confirmResult = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmResult.error) {
        throw new Error(confirmResult.error.message || "Payment failed");
      }
      toast.success(
        `Your prescription transfer request has been submitted to ${formData?.pharmacyName}`
      );
      onSuccess();
      setChangesData(true);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Complete Payment
          </DialogTitle>
          <DialogDescription>
            Secure payment processing for prescription transfer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Prescription Transfer to:
                  </span>
                  <span className="font-medium">{pharmacyName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Transfer Fee:</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    {formatCurrency(amount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          {/* <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Cardholder Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="cardNumber" className="text-sm font-medium">
                Card Number
              </Label>
              <div className="relative mt-1">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value))
                  }
                  maxLength={19}
                />
                <CreditCard className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry" className="text-sm font-medium">
                  Expiry Date
                </Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cvc" className="text-sm font-medium">
                  CVC
                </Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) =>
                    setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))
                  }
                  maxLength={3}
                  className="mt-1"
                />
              </div>
            </div>
          </div> */}

          <CardElement />

          {/* Security Notice */}
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <Shield className="h-4 w-4 text-green-600" />
            <div className="text-sm">
              <span className="text-green-800 font-medium">Secure Payment</span>
              <p className="text-green-600">
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>

          {/* Payment Button */}
          <div className="space-y-3">
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Payment...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Pay {formatCurrency(amount)}
                </div>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
