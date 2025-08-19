import React from "react";
import {
  Shield,
  Users,
  Eye,
  Cookie,
  FileText,
  Link as LinkIcon,
  Monitor,
  AlertTriangle,
  Lock,
  CheckCircle,
  Mail,
  Globe,
} from "lucide-react";
import Link from "next/link";
import TermsConditions from "@/public/images/legal-support/TermsConditions.webp";

const sections = [
  {
    icon: FileText,
    title: "Introduction",
    color: "#3b82f6",
    content: [
      'This website is operated by Rex Vet. Throughout the site, the terms "we," "us," and "our" refer to Rex Vet. By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions, including those additional terms and conditions and policies referenced herein.',
    ],
  },
  {
    icon: Cookie,
    title: "Use of Cookies",
    color: "#10b981",
    content: [
      "Our website uses cookies to optimize your browsing experience. When you use Rex Vet, you agree to our use of cookies as outlined in our Privacy Policy. We use cookies to enhance your browsing experience and personalize our website to better suit your needs.",
    ],
  },
  {
    icon: Shield,
    title: "Intellectual Property Rights",
    color: "#8b5cf6",
    content: [
      "All material on our website is owned by Rex Vet and/or its licensors, unless otherwise stated. All rights to the intellectual property are protected. Feel free to access this material for your personal use, but please keep in mind that there are certain restrictions outlined in the terms and conditions.",
    ],
    restrictions: [
      "Reuse content from Rex Vet - Offer, lease, or grant permission for the use of material from Rex Vet",
      "Sell, rent, or sub-license material from Rex Vet",
      "Reproduce, duplicate, or copy material from Rex Vet",
      "Redistribute content from Rex Vet",
    ],
  },
  {
    icon: Users,
    title: "User Comments and Feedback",
    color: "#f59e0b",
    content: [
      "Certain sections of this website provide users with the opportunity to share and discuss their thoughts and knowledge. Rex Vet allows Comments to be posted on the website without any filtering, editing, publishing, or reviewing beforehand. The views and opinions expressed in the comments are not representative of Rex Vet, its agents, and/or affiliates. Opinions expressed in the comments are solely those of the individuals who post them.",
      "We reserve the right to monitor all Comments to ensure they meet our standards and align with our terms and conditions. Any comments that are deemed inappropriate, offensive, or in violation of our terms and conditions will be promptly removed.",
    ],
    warranties: [
      "You have the right to post the Comments and have all necessary licenses and consents.",
      "The Comments do not infringe any intellectual property right, including without limitation copyright, patent, or trademark of any third party.",
      "The Comments do not contain any defamatory, libelous, offensive, indecent, or otherwise unlawful material.",
      "The Comments will not be used to solicit or promote business or unlawful activity.",
    ],
  },
  {
    icon: LinkIcon,
    title: "Hyperlinking to Our Content",
    color: "#ef4444",
    content: [
      "These organizations are welcome to include links to our home page, publications, or other website information, as long as the link is honest and does not give the false impression that the linking party and its products/services are sponsored, endorsed, or approved by us. The link should also be relevant to the content of the linking party's site.",
      "We may approve link requests from well-known consumer/business information sources, dot.com community sites, charities, online directory distributors, internet portals, accounting, law, and consulting firms, educational institutions, and trade associations.",
    ],
    allowedOrgs: [
      "Government agencies",
      "Search engines",
      "News organizations",
    ],
  },
  {
    icon: Monitor,
    title: "iFrames",
    color: "#06b6d4",
    content: [
      "Please note that altering the visual presentation or appearance of our website by creating frames around our webpages is not permitted without obtaining prior approval and written permission.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Content Liability",
    color: "#f97316",
    content: [
      "Please note that we cannot assume responsibility for any content that may appear on your website. By agreeing to protect and defend us against any claims that may arise from your website, you demonstrate your commitment to ensuring our safety. It is important to ensure that no links on any website are deemed defamatory, offensive, illegal, or in violation of any third party rights.",
    ],
  },
  {
    icon: Lock,
    title: "Reservation of Rights",
    color: "#7c3aed",
    content: [
      "We reserve the right to request that you remove all links or any particular link to our website. You agree to immediately remove all links to our website upon request. Our terms and conditions, as well as our linking policy, may be subject to changes at any time. By consistently connecting to our website, you are expected to adhere to and abide by these terms and conditions for linking.",
    ],
  },
  {
    icon: Eye,
    title: "Removal of Links from Our Website",
    color: "#dc2626",
    content: [
      "If you come across any link on our website that you find offensive for any reason, please feel free to reach out to us at any time. We will take into account requests to remove links, but we are not obliged to comply or provide a direct response.",
    ],
  },
];

const TermsC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(30,41,59,0.9), rgba(51,65,85,0.9), rgba(71,85,105,0.9)), url("/images/legal-support/TermsConditions.webp")`,
        }}
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08)_0%,transparent_50%),radial-gradient(circle_at_40%_60%,rgba(71,85,105,0.1)_0%,transparent_50%)]"></div>

        <div className="relative w-full max-w-7xl mx-auto text-center px-6 py-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
            Terms{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              & Conditions
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow">
            Please read these terms and conditions carefully before using our
            services
          </p>
          <div className="flex justify-center gap-2 flex-wrap mt-6">
            {["Legal", "Binding", "Updated", "Comprehensive"].map((tag, i) => (
              <span
                key={i}
                className="px-4 py-1 rounded-full bg-white/20 text-white font-semibold border border-white/30 backdrop-blur"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.03)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.03)_0%,transparent_50%)]"></div>

        <div className="relative max-w-5xl mx-auto px-6">
          {/* Welcome Section */}
          <div className="bg-white/90 rounded-3xl p-8 shadow-sm border border-white/20 backdrop-blur mb-8 hover:shadow-xl transition">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-green-500 shadow-lg">
                <Globe size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800 mb-3">
                  Welcome to Rex Vet
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Welcome to Rex Vet! These terms and conditions outline the
                  rules and regulations for the use of our website,
                  <Link
                    href="https://rexvet.org/"
                    className="text-blue-500 font-semibold hover:underline ml-1"
                  >
                    www.rexvet.org
                  </Link>
                  . By accessing this website, you agree to comply with these
                  terms and conditions. If you do not agree with any part of
                  these terms, please do not continue to use Rex Vet.
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Sections */}
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white/90 rounded-3xl p-8 shadow-sm border border-white/20 backdrop-blur mb-8 hover:shadow-xl transition"
            >
              <div className="flex items-start gap-4 mb-3">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ background: section.color }}
                >
                  <section.icon size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-800 mb-3">
                    {section.title}
                  </h2>

                  {section.content.map((p, i) => (
                    <p key={i} className="text-slate-600 leading-relaxed mb-2">
                      {p}
                    </p>
                  ))}

                  {section.restrictions && (
                    <div className="mt-4">
                      <h3 className="font-semibold text-slate-800 mb-2">
                        You must not:
                      </h3>
                      <ul className="space-y-2">
                        {section.restrictions.map((r, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-slate-600"
                          >
                            <span className="mt-2 w-2 h-2 rounded-full bg-red-500"></span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {section.warranties && (
                    <div className="mt-4">
                      <h3 className="font-semibold text-slate-800 mb-2">
                        By posting Comments on our website, you warrant and
                        represent that:
                      </h3>
                      <ul className="space-y-2">
                        {section.warranties.map((w, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-slate-600"
                          >
                            <CheckCircle
                              size={16}
                              className="text-green-500 mt-1"
                            />{" "}
                            {w}
                          </li>
                        ))}
                      </ul>
                      <p
                        className="mt-3 italic text-slate-600 p-3 rounded-xl border"
                        style={{
                          backgroundColor: `${section.color}10`,
                          borderColor: `${section.color}30`,
                        }}
                      >
                        By agreeing to these terms, you are giving Rex Vet
                        permission to utilize, modify, and allow others to
                        utilize and modify any comments you provide, across
                        various platforms and mediums.
                      </p>
                    </div>
                  )}

                  {section.allowedOrgs && (
                    <div className="mt-4">
                      <h3 className="font-semibold text-slate-800 mb-2">
                        The following organizations may link to our Website
                        without prior written approval:
                      </h3>
                      <ul className="space-y-2">
                        {section.allowedOrgs.map((org, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-slate-600"
                          >
                            <CheckCircle
                              size={16}
                              className="text-green-500 mt-1"
                            />{" "}
                            {org}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Contact Info */}
          <div className="bg-white/90 rounded-3xl p-8 shadow-sm border border-white/20 backdrop-blur mb-8 hover:shadow-xl transition">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-emerald-500 shadow-lg">
                <Mail size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  Contact Information
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  For any questions about these Terms and Conditions, please
                  contact us at
                  <a
                    href="mailto:support@rexvet.org"
                    className="text-blue-500 font-semibold hover:underline ml-1"
                  >
                    support@rexvet.org
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsC;
