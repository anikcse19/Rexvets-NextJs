import { Card, CardContent } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { Clock, Mail, Phone } from "lucide-react";
import React from "react";

interface ContactInfoItem {
  icon: React.ElementType;
  title: string;
  description: string;
  value: string;
  color: string;
}

const contactInfo: ContactInfoItem[] = [
  {
    icon: Mail,
    title: "Email Support",
    description: "We respond within 24 hours",
    value: "support@rexvet.org",
    color: "#3b82f6",
  },
  {
    icon: Clock,
    title: "Response Time",
    description: "Average response time",
    value: "< 2 hours",
    color: "#f59e0b",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const ContactInfo: React.FC = () => {
  return (
    <section
      className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white relative"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)`,
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className=" flex flex-col md:flex-row items-center justify-center w-full gap-8 md:gap-16 "
        >
          {contactInfo.map((info, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="h-full w-[300px] rounded-3xl bg-white/95 backdrop-blur-xl border border-gray-200/50 hover:-translate-y-2 hover:scale-102 hover:shadow-xl transition-all duration-400 text-center">
                <CardContent className="p-6">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${info.color}15` }}
                  >
                    <info.icon
                      className="h-8 w-8"
                      style={{ color: info.color }}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{info.description}</p>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: info.color }}
                  >
                    {info.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
export default React.memo(ContactInfo);
