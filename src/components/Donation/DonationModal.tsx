"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

import {
  Heart,
  DollarSign,
  CreditCard,
  Shield,
  CheckCircle,
  X,
} from "lucide-react";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  appointmentDate: string;
  appointmentTime?: string;
}

const donationOptions = [
  { amount: 35, purpose: "Emergency pet care support" },
  { amount: 45, purpose: "Medical equipment upgrades" },
  { amount: 55, purpose: "Vaccination programs" },
  { amount: 100, purpose: "Veterinary education fund" },
];

export default function DonationModal({
  isOpen,
  onClose,
  doctorName,
  appointmentDate,
  appointmentTime,
}: DonationModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
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

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const getDonationAmount = () => {
    return selectedAmount || parseFloat(customAmount) || 0;
  };

  const handleDonation = async () => {
    const amount = getDonationAmount();
    if (amount < 1) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);

      // Auto close after success
      setTimeout(() => {
        setIsCompleted(false);
        onClose();
        // Reset form
        setSelectedAmount(null);
        setCustomAmount("");
        setCardNumber("");
        setExpiryDate("");
        setCvv("");
        setCardholderName("");
      }, 2500);
    }, 2000);
  };

  const isFormValid = () => {
    const amount = getDonationAmount();
    return (
      amount >= 1 &&
      cardNumber.replace(/\s/g, "").length >= 13 &&
      expiryDate.length === 5 &&
      cvv.length >= 3 &&
      cardholderName.trim().length > 0
    );
  };

  if (isCompleted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md mx-4">
          <div className="text-center py-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You! 🎉
            </h3>
            <p className="text-gray-600 mb-3">
              Your donation of ${getDonationAmount()} has been processed.
            </p>
            <p className="text-sm text-gray-500">
              Appointment with {doctorName} confirmed for {appointmentDate} at{" "}
              {appointmentTime}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto sm:mx-4">
        {/* Enhanced Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-t-lg"></div>
          <div className="relative bg-white/10 backdrop-blur-sm rounded-t-lg p-6 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white mb-1">
                  Support Our Mission
                </DialogTitle>
                <DialogDescription className="text-blue-100">
                  Help us provide better veterinary care for pets in need
                </DialogDescription>
              </div>
            </div>

            {/* Appointment Confirmation */}
            <div className="bg-white/20 rounded-lg p-3 border border-white/30">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-white font-medium">
                  {doctorName} • {appointmentDate} at {appointmentTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:p-6 space-y-6">
          {/* Donation Amounts */}
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {donationOptions.map((option, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all duration-200 border-2 ${
                    selectedAmount === option.amount
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                  }`}
                  onClick={() => handleAmountSelect(option.amount)}
                >
                  <CardContent className="p-1 md:p-4 text-center">
                    <div className="text-base md:text-2xl font-bold text-gray-900 mb-1">
                      ${option.amount}
                    </div>
                    {/* <p className="text-xs text-gray-600 leading-tight">
                      {option.purpose}
                    </p> */}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="relative">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Custom Amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="pl-9"
                  min="1"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                Payment Details
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Shield className="w-3 h-3 text-green-500" />
                Secure
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-gray-600 mb-1 block">
                  Cardholder Name
                </Label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="bg-white text-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-600 mb-1 block">
                  Card Number
                </Label>
                <Input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="bg-white font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium text-gray-600 mb-1 block">
                    Expiry
                  </Label>
                  <Input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    className="bg-white font-mono text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-600 mb-1 block">
                    CVV
                  </Label>
                  <Input
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={handleCvvChange}
                    className="bg-white font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Total and Donate Button */}
          <div className="space-y-3">
            {getDonationAmount() > 0 && (
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <span className="font-medium text-gray-900">Total:</span>
                <span className="text-xl font-bold text-blue-600">
                  ${getDonationAmount().toFixed(2)}
                </span>
              </div>
            )}

            <Button
              onClick={handleDonation}
              disabled={!isFormValid() || isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 font-semibold disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Complete Donation
                </>
              )}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="text-center text-xs text-gray-500">
            <p>🔒 Your payment is secure and encrypted</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
