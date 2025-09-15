import { Heart, MessageCircle, MinusCircle, Shield, Star } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "../ui/dialog";
interface IProps {
  isPlanOpen: boolean;
  setIsPlanOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectPlan?: (plan: any) => void;
}
const FamilyPlanModal: React.FC<IProps> = ({
  setIsPlanOpen,
  isPlanOpen,
  onSelectPlan,
}) => {
  return (
    <Dialog open={isPlanOpen} onOpenChange={setIsPlanOpen}>
      <DialogContent
        showCloseButton={false}
        className="p-0 overflow-hidden rounded-2xl max-w-md"
      >
        {/* Header Gradient */}
        <div className="bg-gradient-to-r from-[#2563EB] to-[#1E40AF] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <DialogTitle className="text-base font-semibold text-white m-0">
                Rexvet Family Plan
              </DialogTitle>
              <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full font-semibold">
                RECOMMENDED
              </span>
            </div>
          </div>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-full bg-red-100 hover:bg-red-200"
            >
              <MinusCircle className="h-5 w-5 text-red-500" />
            </Button>
          </DialogClose>
        </div>

        {/* Body */}
        <div className="px-6 pt-6 pb-4">
          {/* Price */}
          <div className="text-center mb-4">
            <div className="text-[40px] leading-none font-extrabold text-[#2563EB]">
              $10
            </div>
            <div className="text-gray-500 -mt-1">/month</div>
            <div className="text-sm text-gray-500 mt-2">
              Billed annually at $120. Cancel anytime.
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center mb-6">
            <button className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-full shadow-sm">
              <Star className="w-4 h-4 fill-white text-white" /> SAVE $20
            </button>
          </div>

          {/* What's included */}
          <div className="text-center font-semibold text-gray-800 mb-3">
            What's included:
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
              <div className="w-7 h-7 rounded bg-red-100 text-red-600 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <div className="text-sm text-gray-700">
                4 virtual vet appointments ($289 value)
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
              <div className="w-7 h-7 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="text-sm text-gray-700">
                Unlimited messaging with veterinary professionals
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
              <div className="w-7 h-7 rounded bg-green-100 text-green-600 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-sm text-gray-700">
                Covers all of your pets
              </div>
            </div>
          </div>

          {/* Select Plan */}
          <div className="mt-6">
            <Button
              onClick={() => onSelectPlan && onSelectPlan(120)}
              className="w-full cursor-pointer bg-[#1D4ED8] hover:bg-[#1E40AF] text-white py-6 rounded-xl text-sm font-semibold"
            >
              SELECT PLAN
            </Button>
            <div className="text-center text-xs text-gray-500 mt-3">
              30-day money-back guarantee
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FamilyPlanModal;
