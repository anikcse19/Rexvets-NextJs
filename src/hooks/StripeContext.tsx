"use client";

import type { ElementProps } from "@stripe/react-stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import React, { ReactNode } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

/**
 * Simplified StripeContext Provider Component
 * 
 * Provides Stripe Elements context to child components for payment processing.
 * Simplified version without lazy loading complexity.
 * 
 * Features:
 * - Loads Stripe SDK directly for better performance
 * - Provides Stripe Elements context for payment form components
 * - Uses environment variable for Stripe publishable key
 * 
 * Usage:
 * Wrap payment forms with this provider to enable Stripe Elements
 */

// Initialize Stripe with publishable key from environment variables
const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

interface StripeContextProps extends Partial<ElementProps> {
  children: ReactNode;
}

/**
 * StripeContext Provider
 * 
 * Wraps children with Stripe Elements context for payment processing.
 * Simplified version without Suspense complexity.
 */
export default function StripeContext({
  children,
  ...props
}: StripeContextProps) {
  return (
    <Elements 
      stripe={stripePromise} 
      {...props}
    >
      {children}
    </Elements>
  );
}
