"use client";
import { motion } from "framer-motion";
import { Mail, Shield } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../ui/card";

const FooterContactCard: React.FC = () => {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)" }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-8 rounded-xl border-white/20 bg-white/10 backdrop-blur-md transition-all hover:border-amber-400/50">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center">
            <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 shadow-md">
              <Shield size={24} color="#1a1a1a" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]">
                Trusted Non-Profit Organization
              </h4>
              <p className="text-sm text-white/80">
                501(c)(3) • Tax ID #33-2469898
              </p>
            </div>
          </div>
          <p className="mb-4 text-sm leading-6 text-white/90">
            Rex Vet is a registered 501(c)(3) non-profit organization dedicated
            to providing affordable veterinary care through telehealth.
          </p>
          <motion.a
            href="mailto:support@rexVet.com"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/20 px-3 py-1 text-sm font-medium text-amber-400 backdrop-blur-md transition-colors hover:bg-amber-400 hover:text-gray-900"
          >
            <Mail size={16} />
            support@rexVet.com
          </motion.a>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default React.memo(FooterContactCard);
