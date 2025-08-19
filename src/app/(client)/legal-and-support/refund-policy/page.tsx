import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Info,
  Mail,
  Shield,
  XCircle,
} from "lucide-react";
import React from "react";

const page = () => {
  const policyPoints = [
    {
      text: "All payments are final. We do not offer refunds for any reason, including but not limited to appointment cancellations, dissatisfaction with services, or unutilized consultations.",
      icon: XCircle,
      color: "#ef4444",
    },
    {
      text: "By submitting payment through our website or via Stripe, you agree to this no-refund policy.",
      icon: Shield,
      color: "#3b82f6",
    },
    {
      text: "Appointments are limited and your payment directly supports our veterinary staff, platform maintenance, and outreach to underserved communities.",
      icon: Heart,
      color: "#10b981",
    },
    {
      text: "If you believe a transaction was made in error (e.g., duplicate charge), please contact us at support@rexvet.org within 48 hours of the transaction. We will review any claims of payment errors on a case-by-case basis.",
      icon: Clock,
      color: "#f59e0b",
    },
  ];
  return (
    <div>
      <section
        className="relative flex items-center min-h-screen overflow-hidden bg-fixed bg-cover bg-[20%_center]"
        style={{
          backgroundImage: `
          linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.9) 50%, rgba(71, 85, 105, 0.9) 100%),
          url('/images/legal-support/Refund_Policy.webp')
        `,
        }}
      >
        {/* Overlay effect */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08)_0%,transparent_50%),radial-gradient(circle_at_40%_60%,rgba(71,85,105,0.1)_0%,transparent_50%)]"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center py-20 md:py-32">
          {/* Title */}
          <h1 className="text-white font-extrabold leading-tight tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-4xl md:text-6xl lg:text-7xl mb-6">
            Refund{" "}
            <span className="bg-gradient-to-tr from-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(251,191,36,0.3)]">
              Policy
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mb-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
            Understanding our payment terms and refund policy for Rex Vet
            telehealth services
          </p>

          {/* Tags */}
          <div className="flex justify-center flex-wrap gap-3">
            {["Non-Profit", "Transparent", "Mission-Driven", "Final Sales"].map(
              (tag, i) => (
                <span
                  key={i}
                  className="px-4 py-1 rounded-full font-semibold text-white border border-white/30 bg-white/20 backdrop-blur-md"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </section>
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16 md:py-24">
        {/* Background overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.03)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.03)_0%,transparent_50%)]"></div>

        <div className="relative z-10 container max-w-5xl mx-auto px-4">
          {/* Mission Driven Approach */}
          <div className="mb-8 p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-blue-500 shadow-[0_8px_32px_rgba(59,130,246,0.4)]">
                <Info size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-slate-800 text-2xl md:text-3xl mb-2">
                  Our Mission-Driven Approach
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                  At Rex Vet, we are proud to offer accessible veterinary
                  telehealth services through the support of donors and clients
                  like you. As a registered nonprofit, your contributions and
                  service payments help us reach more pets in need and continue
                  our mission-driven work.
                </p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="mb-8 rounded-2xl border border-amber-300/50 bg-amber-100/30 p-6">
            <div className="font-bold text-amber-800 mb-2">
              Please Read Carefully
            </div>
            <p className="text-amber-800">
              The following policy terms are important for understanding our
              payment structure and refund limitations.
            </p>
          </div>

          {/* Refund Policy Terms */}
          <div className="mb-8 p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-red-500 shadow-[0_8px_32px_rgba(239,68,68,0.4)]">
                <AlertTriangle size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-slate-800 text-2xl md:text-3xl mb-4">
                  Refund Policy Terms
                </h2>

                <ul className="space-y-3">
                  {policyPoints.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-blue-50 transition"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: `${point.color}15`,
                          border: `1px solid ${point.color}30`,
                        }}
                      >
                        <point.icon size={20} color={point.color} />
                      </div>
                      <p className="text-slate-500 text-base leading-relaxed flex-1">
                        {point.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-emerald-500 shadow-[0_8px_32px_rgba(16,185,129,0.4)]">
                <Mail size={28} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-xl mb-2">
                  Thank You for Your Support
                </h3>
                <p className="text-slate-500 text-lg leading-relaxed mb-4">
                  Your understanding helps us provide care to pets who need it
                  most. Thank you for supporting Rex Vet.
                </p>

                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-emerald-500" />
                  <p className="text-emerald-500 font-semibold">
                    Questions? Contact us at{" "}
                    <a
                      href="mailto:support@rexvet.org"
                      className="text-blue-500 font-bold hover:underline"
                    >
                      support@rexvet.org
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
