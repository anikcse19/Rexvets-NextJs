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
import { CheckCircle2 } from "lucide-react";

type BenefitsTableSectionProps = {
  benefits: {
    feature: string;
    description: string;
    rexVets: boolean;
    others: boolean;
  }[];
};

const BecomeRexVetBenefitsTableSection: React.FC<BenefitsTableSectionProps> = ({
  benefits,
}) => {
  return (
    <section className="py-12 md:py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-8">
          Exclusive RexVets Benefits
        </h2>
        <Card className="bg-white/90 backdrop-blur-sm border-blue-100/20 rounded-3xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-600 to-purple-600">
                <TableHead className="text-white font-semibold py-4">
                  Feature
                </TableHead>
                <TableHead className="text-white font-semibold py-4 text-center">
                  RexVets
                </TableHead>
                <TableHead className="text-white font-semibold py-4 text-center">
                  Other Services
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benefits.map((benefit, index) => (
                <TableRow
                  key={index}
                  className={`hover:bg-blue-50 transition-all duration-200 ${
                    index % 2 === 0 ? "bg-blue-50/50" : ""
                  }`}
                >
                  <TableCell className="py-4">
                    <h3 className="text-lg font-semibold">{benefit.feature}</h3>
                    <p className="text-sm text-gray-600">
                      {benefit.description}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    {benefit.rexVets ? (
                      <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                    ) : (
                      <span className="text-2xl text-red-600">✖</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {benefit.others ? (
                      <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                    ) : (
                      <span className="text-2xl text-red-600">✖</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </section>
  );
};

export default BecomeRexVetBenefitsTableSection;
