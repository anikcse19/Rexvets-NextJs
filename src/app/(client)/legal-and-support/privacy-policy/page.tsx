import {
  BarChart3,
  CheckCircle,
  Cookie,
  Eye,
  Lock,
  Mail,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import React from "react";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Users,
      title: "For Pet Parents",
      color: "bg-blue-500",
      textColor: "text-blue-500",
      content: [
        "Any time you access our website or mobile application, or log into your account, you authorize us to collect information in accordance with this policy. You are granting your consent to its use.",
        "We collect personal information, including your name, email address, IP address, password, and any other information you provide, when you visit and use the Services.",
        "We make every effort to safeguard this information and ensure that it is solely utilized to provide you with the Services.",
        "We collaborate with third-party service providers, such as Square Payments and Facebook, to simplify the user experience of Rex Vet. By employing a third-party service through Rex Vet, you are also agreeing to the privacy policies of that service.",
        "Cookies are identifiers that we may add to your computing device in order to recognize you when you access the Services. You are not obligated to accept any cookies; however, you may wish to do so in order to optimize your use of the Service.",
        "We refrain from selling, renting, or trading any information you provide us or disclosing it to any third parties, with the exception of the following: When legally required; or",
        "To ensure the safety of our users.",
        "We will take all reasonable measures to safeguard your information; however, it is your responsibility as a user to ensure that your username and password are not compromised.",
        "It is crucial to review this policy frequently, as we may modify certain components from time to time. We will make every effort to inform you of any substantial modifications.",
      ],
    },
    {
      icon: Eye,
      title: "As a Visitor",
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
      content: [
        "Device, browser, and IP address information and server log information (date, time, and pages visited) may be collected anonymously from Services visitors. Our mobile device and internet connection data may include the device's unique device identifier (e.g., Android Advertising Identifier or Advertising Identifier for iOS), MAC address, IP address, operating system, web browser type, mobile network information, and telephone number. Rex Vet uses this data to understand visitors and improve your experience.",
      ],
    },
    {
      icon: Shield,
      title: "As a User",
      color: "bg-violet-500",
      textColor: "text-violet-500",
      content: [
        "Device, browser, and IP address information and server log information (date, time, and pages visited) may be collected anonymously from Services visitors. Our mobile device and internet connection data may include the device's unique device identifier (e.g., Android Advertising Identifier or Advertising Identifier for iOS), MAC address, IP address, operating system, web browser type, mobile network information, and telephone number. Rex Vet uses this data to understand visitors and improve your experience.",
      ],
    },
    {
      icon: Settings,
      title: "Third-Party Services",
      color: "bg-amber-500",
      textColor: "text-amber-500",
      content: [
        "We use third-party services to maintain Rex Vet. You authorize us to acquire your name, email address, and other information from these Third-Party Services if you authorize us to connect with them. The Terms of Service and Privacy Policies of these Third-Party Services govern your use. Only this Privacy Policy shall govern our use and disclosure of such information.",
      ],
    },
    {
      icon: Cookie,
      title: "Cookies and Other Tracking Technologies",
      color: "bg-red-500",
      textColor: "text-red-500",
      content: [
        "We may set and access cookies on your computer or mobile device when you use Rex Vet. User ID, user preferences, lists of pages visited, and Services actions are stored in 'cookies' on your computer. We also use cookies to track site traffic and improve the online experience. Some cookies may be active while you browse a website ('session cookies'). Some cookies remain on your computer after you stop your browser or turn it off ('persistent cookies'). We may use tracking cookies on other websites to offer relevant adverts.",
        "You do not have to accept cookies, but if they are disabled, you may not be able to log in or use some Rex Vet features. You can accept all cookies, reject all cookies, or receive cookie notifications in your browser. See www.allaboutcookies.org to disable browser cookies or opt out of cookies.",
        "On the Site, in emails, and on third-party platforms like Facebook, we may employ pixels. A pixel in marketing emails may tell us when you click a link. These tools run and optimize our Site and marketing emails.",
        "Third-party cookies are not covered by this privacy policy, and we have no control over their privacy practices or policies. Be aware that even after you leave our site, third-party cookies may still be tracking your online activity.",
      ],
    },
    {
      icon: BarChart3,
      title: "Analytics",
      color: "bg-cyan-500",
      textColor: "text-cyan-500",
      content: [
        "We also collect Site usage data using Firebase and Google Analytics. These programs track how often you visit the Site, what pages you visit, and what other websites you visited before it. We solely utilize these services' data to improve our Site and Services. These analytic services only gather your IP address on the date you visit the Site, not your name or other identifying information. We do not combine Service data with personally identifiable information. Google Analytics leaves a permanent cookie on your computer to identify you as a unique user next time you come, but only Google can use it. The Google Analytics Terms of Use and Google Privacy Policy limit Google's use and sharing of Site usage data. Disabling browser cookies prevents Google Analytics from recognizing you on future visits. Install Google Analytics' Opt-out Browser.",
      ],
    },
    {
      icon: Lock,
      title: "How We Use Your Personal Information",
      color: "bg-purple-600",
      textColor: "text-purple-600",
      content: [
        "Your personal information is mostly needed to create a Rex Vet user account and use the Services. Your personal information is also used:",
        "Fulfill requests for information and respond to correspondence; - Manage and expand services, perform analysis, and support business growth for Rex Vet and other offerings.",
        "Provide information about Rex Vet and our Services; - Contact you when necessary or requested; - Customize your Service experience; - Send marketing or promotional emails based on your preferences; or - Prevent, detect, and investigate security breaches and illegal activities.",
        "To perform statistical studies, we may anonymize and aggregate some of your personal information and show it publicly.",
      ],
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(30,41,59,0.9), rgba(51,65,85,0.9), rgba(71,85,105,0.9)), url('/images/legal-support/Privacy_Policy.webp')`,
        }}
      >
        <div className="container mx-auto text-center px-6 relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            Privacy{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-md">
              Policy
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed drop-shadow">
            Your privacy and data security are our top priorities. Learn how we
            protect and use your information.
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            {["Secure", "Transparent", "HIPAA Compliant", "Trusted"].map(
              (tag, idx) => (
                <span
                  key={idx}
                  className="px-4 py-1 rounded-full bg-white/20 border border-white/30 text-white font-semibold backdrop-blur"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16 relative">
        <div className="container mx-auto px-6">
          {/* Intro */}
          <div className="bg-white/95 border border-white/20 backdrop-blur-xl rounded-3xl p-8 shadow hover:shadow-2xl transition mb-8">
            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
                <Mail size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                  Welcome to Rex Vet Privacy Policy
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Welcome! Rex Vet ("we," "our," or "us") collects certain types
                  of personal information when you use our website, online
                  services, and mobile app (together, the "Site" and the
                  "Services"). This privacy policy explains those types of
                  information. We care about your privacy, so we do everything
                  we can to avoid sharing or leaking your personal information.
                  Just the information we need to give you useful online
                  services is what we try to collect. Contact us at{" "}
                  <a
                    href="mailto:support@rexvet.org"
                    className="text-blue-500 font-semibold hover:underline"
                  >
                    support@rexvet.org
                  </a>{" "}
                  if you need help or have any questions.
                </p>
              </div>
            </div>
          </div>

          {/* Info We Collect */}
          <div className="bg-white/95 border border-white/20 backdrop-blur-xl rounded-3xl p-8 shadow hover:shadow-2xl transition mb-8">
            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg">
                <CheckCircle size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                  Information We Collect and Why
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We collect, retain, and process a variety of information when
                  you visit or use Rex Vet in order to verify your identity and
                  provide you with high-quality services.
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Sections */}
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div
                key={idx}
                className="bg-white/95 border border-white/20 backdrop-blur-xl rounded-3xl p-8 shadow hover:shadow-2xl transition mb-8"
              >
                <div className="flex gap-4 items-start">
                  <div
                    className={`w-14 h-14 rounded-2xl ${section.color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon size={28} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                      {section.title}
                    </h2>

                    {section.title === "Pet Parents" && (
                      <p
                        className={`italic p-3 mb-4 rounded-xl border ${section.textColor} ${section.textColor}/20 bg-opacity-5`}
                      >
                        This part, "For Pet Parents," is an easy-to-read
                        explanation of our Privacy Policy. No, it's not a
                        replacement, and you shouldn't think of it as the whole
                        policy. Remember that by clicking "I agree," you're
                        agreeing to our whole Privacy Policy, not just this
                        section.
                      </p>
                    )}

                    <ul className="space-y-3">
                      {section.content.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 hover:bg-blue-50/40 rounded-lg px-2 py-1 transition"
                        >
                          <span
                            className={`w-2 h-2 mt-2 rounded-full ${section.color}`}
                          ></span>
                          <span className="text-slate-600 leading-relaxed text-base">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Contact */}
          <div className="bg-white/95 border border-white/20 backdrop-blur-xl rounded-3xl p-8 shadow hover:shadow-2xl transition text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Questions About Our Privacy Policy?
            </h3>
            <p className="text-slate-600 mb-4">
              If you have any questions or concerns about our privacy practices,
              please don't hesitate to contact us.
            </p>
            <a
              href="mailto:support@rexvet.org"
              className="inline-flex items-center gap-2 text-blue-500 font-semibold hover:underline"
            >
              <Mail size={20} /> support@rexvet.org
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
