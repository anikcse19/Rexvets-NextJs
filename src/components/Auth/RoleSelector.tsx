"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Stethoscope, UserCheck } from "lucide-react";

interface RoleSelectorProps {
  selectedRole: string | null;
  onRoleSelect: (role: "pet_parent" | "veterinarian" | "technician") => void;
}

export default function RoleSelector({
  selectedRole,
  onRoleSelect,
}: RoleSelectorProps) {
  const roles = [
    {
      id: "pet_parent",
      title: "Pet Parent",
      description:
        "Book appointments and manage your pet's health with expert veterinarians",
      icon: Heart,
      gradient: "from-pink-500 via-rose-500 to-red-500",
      stats: "50K+ Families",
    },
    {
      id: "veterinarian",
      title: "Veterinarian",
      description:
        "Provide professional veterinary care and expand your global practice",
      icon: Stethoscope,
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      stats: "2K+ Licensed Vets",
    },
    {
      id: "technician",
      title: "Veterinary Technician",
      description:
        "Support veterinary care with advanced tools and collaborative platform",
      icon: UserCheck,
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      stats: "5K+ Technicians",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-4 text-white"
        >
          Choose Your Role
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/70 text-xl"
        >
          Select how you&apos;ll be using RexVet to get started
        </motion.p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {roles.map((role, index) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              className="group"
            >
              <Card
                className={`cursor-pointer transition-all duration-500 hover:shadow-2xl backdrop-blur-xl border-2 h-full ${
                  isSelected
                    ? "border-cyan-400 ring-4 ring-cyan-400/20 bg-white/20"
                    : "border-white/20 hover:border-white/40 bg-white/10 hover:bg-white/15"
                }`}
                onClick={() => onRoleSelect(role.id as any)}
              >
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${role.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-2xl mb-4 text-white">
                    {role.title}
                  </h3>
                  <p className="text-white/70 mb-6 leading-relaxed flex-grow">
                    {role.description}
                  </p>
                  <div className="text-sm text-cyan-400 font-semibold">
                    {role.stats}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
