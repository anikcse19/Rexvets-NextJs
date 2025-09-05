"use client";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, Variants } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type BenefitsTableSectionProps = {
  benefits: {
    feature: string;
    description: string;
    rexVets: boolean;
    others: boolean;
  }[];
};

// Framer Motion variants for table row hover animation
const rowVariants: Variants = {
  initial: {
    backgroundColor: "rgba(255, 255, 255, 1)", // Default white or alternating color
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  hover: {
    backgroundColor: "rgba(219, 234, 254, 0.5)", // Equivalent to bg-blue-50
    scale: 1.02, // Subtle scale effect
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const BecomeRexVetBenefitsTableSection: React.FC<BenefitsTableSectionProps> = ({
  benefits,
}) => {
  return (
    <section className="py-12 md:py-20 bg-gray-100">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center bg-[#1871CD] bg-clip-text text-transparent mb-8">
          Exclusive RexVet Benefits
        </h2>
        <Card className="bg-white/90 backdrop-blur-sm border-blue-100/20 rounded-3xl overflow-hidden p-0 m-0">
          <Table className="w-full">
            <TableHeader className="bg-[#1871CD] hover:opacity-100 hover:bg-[#1871CD] cursor-pointer">
              <TableRow className="p-0 m-0 border-none">
                <TableHead className="text-white font-semibold py-6 px-6 text-left">
                  Feature
                </TableHead>
                <TableHead className="text-white font-semibold py-5 px-6 text-center">
                  RexVet
                </TableHead>
                <TableHead className="text-white font-semibold py-5 px-6 text-center">
                  Other Services
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benefits.map((benefit, index) => (
                <motion.tr
                  key={index}
                  variants={rowVariants}
                  initial="initial"
                  // whileHover="hover"
                  animate={{
                    backgroundColor:
                      index % 2 === 0
                        ? "rgba(219, 234, 254, 0.5)" // bg-blue-50/50
                        : "rgba(255, 255, 255, 1)", // bg-white
                  }}
                  className=" h-[110px] py-4  px-6 m-0 w-full border-none"
                  style={{ display: "table-row" }}
                >
                  <TableCell className="p-0">
                    <div className="py-4  px-6">
                      <h3 className="text-lg font-semibold">
                        {benefit.feature}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <div className="py-4 px-6">
                      {benefit.rexVets ? (
                        <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                      ) : (
                        <span className="text-2xl text-red-600">✖</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <div className="py-4 px-6">
                      {benefit.others ? (
                        <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                      ) : (
                        <span className="text-2xl text-red-600">✖</span>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </section>
  );
};

export default BecomeRexVetBenefitsTableSection;
