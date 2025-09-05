/* eslint-disable @typescript-eslint/no-unused-vars */
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

interface DonationData {
  amount: number;
  customAmount?: number;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  isRecurring: boolean;
}

interface DonationComponentProps {
  onDonate?: (data: DonationData) => void;
}

export default function DonationComponent({
  onDonate,
}: DonationComponentProps = {}) {
  const stripe = useStripe();
  const elements = useElements();
  const { data: session } = useSession();
  const sessionEmail = (session?.user as any)?.email || "";
  const sessionName = (session?.user as any)?.name || "";

  const [selectedAmount, setSelectedAmount] = useState<number>(35);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const donationOptions = [
    { amount: 25, description: "Funds a full consultation for one pet" },
    { amount: 50, description: "Supports a follow-up consultation" },
    {
      amount: 250,
      description: "Helps cover care plans for chronic conditions",
    },
    { amount: 500, description: "Expands care access for multiple families" },
    {
      amount: 1000,
      description: "Helps cover care plans for chronic conditions",
    },
    { amount: 1500, description: "Expands care access for multiple families" },
  ];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setShowCustomInput(false);
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    if (value) {
      setSelectedAmount(0);
    }
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(" ") : "";
  };

  const handleDonate = async () => {
    const finalAmount = customAmount
      ? parseFloat(customAmount)
      : selectedAmount;

    if (!finalAmount) {
      toast.error("Please select a donation amount");
      return;
    }

    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      // Determine donor identity
      const effectiveEmail = sessionEmail || donorEmail.trim();
      const effectiveName = (sessionName || donorName).trim();

      // If no session, require donor name and a valid email
      if (!sessionEmail) {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(effectiveEmail);
        if (!effectiveName) {
          toast.error("Please enter your name");
          return;
        }
        if (!emailValid) {
          toast.error("Please enter a valid email to receive your receipt");
          return;
        }
      }

      // Get the card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        toast.error("Card element not found");
        return;
      }

      // Create payment method
      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

      if (paymentMethodError) {
        toast.error(
          paymentMethodError.message || "Payment method creation failed"
        );
        return;
      }

      // Create payment intent via API
      console.log("Submitting donation with isRecurring:", isRecurring);
      console.log("Type of isRecurring:", typeof isRecurring);

      const res = await fetch("/api/donations/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donationAmount: finalAmount * 100, // Convert to cents
          donorName: effectiveName || "Anonymous Donor",
          donorEmail: effectiveEmail,
          donationType: "donation",
          isRecurring,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create payment");
        return;
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
        toast.error(confirmResult.error.message || "Payment failed");
        return;
      }

      // Confirm payment and send thank you email with receipt
      try {
        await fetch("/api/donations/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: data.paymentIntentId,
            donationId: data.donationId,
          }),
        });
      } catch (emailError) {
        console.error(
          "Error confirming payment and sending thank you email:",
          emailError
        );
        // Don't show error to user, as payment was successful
      }

      toast.success("Thank you for your donation!");

      // Reset form after successful donation
      setCustomAmount("");
      setSelectedAmount(35);
      setShowCustomInput(false);
      setDonorName("");
      setDonorEmail("");
      setIsRecurring(false);

      // Clear card element
      if (elements) {
        const cardElement = elements.getElement(CardElement);
        if (cardElement) {
          cardElement.clear();
        }
      }

      // Call the onDonate callback if provided
      onDonate?.({
        amount: finalAmount,
        customAmount: customAmount ? parseFloat(customAmount) : undefined,
        cardNumber: "****", // Don't pass actual card number for security
        expiryDate: "**/**",
        cvc: "***",
        isRecurring,
      });
    } catch (err: any) {
      console.error("Donation error:", err);
      toast.error(err.message || "An error occurred during donation");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className=" bg-transparent   h-auto flex items-center justify-center w-full p-2">
      <div className="relative z-10 w-full  ">
        {/* Main Card */}
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-blue-900 text-white p-6 items-center justify-center flex flex-col">
            <h2 className="text-2xl font-bold ">Registered Donation</h2>
            <p className="text-blue-100">
              Your generous contribution helps us provide essential veterinary
              care to pets in need.
            </p>
          </div>

          {/* Card Content */}
          <div className="py-3 px-5">
            {/* Donation Options */}
            <div className="mb-2">
              {/* <div className=" shadow rounded p-2 mb-2">
                <h3 className="text-gray-700 text-[12px] mb-0">
                  Suggested Donation Options:
                </h3>
                <div className="space-y-1 text-[12px] text-gray-600 mb-1">
                  {donationOptions.map((option) => (
                    <div key={option.amount}>
                      ${option.amount} - {option.description}
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Amount Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                {donationOptions.map((option) => (
                  <button
                    key={option.amount}
                    onClick={() => handleAmountSelect(option.amount)}
                    className={`py-1 px-4  cursor-pointer z-50 rounded-lg border-2 font-medium transition-all ${
                      selectedAmount === option.amount &&
                      !customAmount &&
                      !showCustomInput
                        ? " border-black bg-[#FFDB29] text-black"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    ${option.amount}
                  </button>
                ))}
              </div>
              <div className=" items-center justify-center flex ">
                <button
                  onClick={() =>
                    setShowCustomInput((prev) => {
                      const next = !prev;
                      if (next) {
                        setSelectedAmount(0);
                      }
                      return next;
                    })
                  }
                  className={`items-center justify-center   cursor-pointer border ${
                    showCustomInput
                      ? "border-black bg-[#FFDB29]"
                      : " border-gray-300"
                  }    rounded-md p-1 text-base text-black font-normal`}
                >
                  Custom Amount
                </button>
              </div>
              {/* Custom Amount */}
              {showCustomInput && (
                <div className=" mb-3">
                  <p className="text-sm mb-0.5">Enter Donation Amount (USD):</p>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Enter Amount"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="pl-2 pr-4 py-1 border w-full border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-start"
                      min="1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Donor Information */}
            {!sessionEmail && (
              <div className="mb-3">
                <p className="text-sm mb-1">Your Information</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="pl-2 pr-4 py-1 border w-full border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="pl-2 pr-4 py-1 border w-full border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Payment Form */}
            <div className="">
              <p className="text-sm mb-1">Card Information</p>
              <CardElement className="mb-[0.3rem] p-2 border-2 border-[rgba(229,231,235,0.8)] rounded-md bg-[rgba(255,255,255,0.9)] transition-colors duration-200 ease-in-out backdrop-blur-[10px] focus-within:border-[#002366] focus-within:shadow-[0_0_0_2px_rgba(0,35,102,0.1)]" />
            </div>

            {/* Stripe Badge */}
            <div className="flex justify-center mb-2 mt-1">
              <Image
                src={"/images/donate-page/Stripe.webp"}
                alt="Stripe Logo"
                width={97}
                height={25}
              />
            </div>

            {/* Recurring Donation Checkbox */}
            <div className="flex items-center justify-center mb-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700  text-sm">
                  Make this a recurring monthly donation
                </span>
              </label>
            </div>

            {/* Donate Button */}
            <button
              onClick={handleDonate}
              disabled={isProcessing}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-1 px-6 rounded-lg transition-colors text-base shadow-lg disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                `DONATE $${customAmount || selectedAmount || 0}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
