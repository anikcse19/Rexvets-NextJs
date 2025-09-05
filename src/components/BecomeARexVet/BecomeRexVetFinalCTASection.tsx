// components/BecomeRexVetFinalCTASection.tsx
import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const BecomeRexVetFinalCTASection = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50 text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-4">
          Ready to Transform Your Practice?
        </h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto mb-6">
          Join thousands of veterinarians making a difference with Rex Vet.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            variant="outline"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl px-6 py-3"
          >
            <Link href="/register">
              Get Started Free <ArrowRight className="ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-blue-200 rounded-2xl px-6 py-3"
          >
            <Link href="/demo">
              Schedule Demo <Phone className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BecomeRexVetFinalCTASection;
