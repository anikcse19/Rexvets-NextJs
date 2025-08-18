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

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  pharmacyName: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  pharmacyName,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formatted.slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handlePayment = async () => {
    if (!cardNumber || !expiry || !cvc || !name) {
      toast("Please fill in all payment details");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      toast(
        `Your prescription transfer request has been submitted to ${pharmacyName}`
      );
      setIsProcessing(false);
      onSuccess();

      // Reset form
      setCardNumber("");
      setExpiry("");
      setCvc("");
      setName("");
    }, 2000);
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
          <div className="space-y-4">
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
          </div>

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
