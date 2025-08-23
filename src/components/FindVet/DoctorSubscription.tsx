import { Doctor } from "./DoctorCard";

export default function DoctorSubscription({ doctor }: { doctor: Doctor }) {
  return (
    <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
      <p className="text-sm font-medium text-purple-900 mb-1">
        Family Plan Available
      </p>
      <p className="text-xs text-purple-700">{doctor.subscriptionPlan}</p>
    </div>
  );
}
