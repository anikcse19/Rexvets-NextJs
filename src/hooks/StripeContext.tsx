"use client";

import type { ElementProps } from "@stripe/react-stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import React, { ReactNode, Suspense } from "react";

// Lazy load Elements component
const Elements = React.lazy(() =>
  import("@stripe/react-stripe-js").then((m) => ({ default: m.Elements }))
);

// Lazy load loadStripe function
const loadStripe = (
  ...args: Parameters<typeof import("@stripe/stripe-js").loadStripe>
) => import("@stripe/stripe-js").then((m) => m.loadStripe(...args));

// Use Next.js public env variable (or import.meta.env in Vite)
const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_KEY as string
);

interface StripeContextProps extends Partial<ElementProps> {
  children: ReactNode;
}

export default function StripeContext({
  children,
  ...props
}: StripeContextProps) {
  return (
    <Suspense fallback={<div>Loading payment...</div>}>
      <Elements stripe={stripePromise} {...props}>
        {children}
      </Elements>
    </Suspense>
  );
}
