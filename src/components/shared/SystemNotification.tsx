import { formatRelativeTime } from "@/lib/utils";
import { RefreshCw, Trash2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  FaCalendarCheck,
  FaComment,
  FaPrescriptionBottle,
} from "react-icons/fa";
import PrescriptionModal from "../Dashboard/Doctor/Appointments/PrescriptionModal";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export enum NotificationType {
  RECURRING_DONATION = "RECURRING_DONATION",
  PRESCRIPTION_REQUEST = "PRESCRIPTION_REQUEST",
  NEW_DONATION = "NEW_DONATION",
  NEW_MESSAGE = "NEW_MESSAGE",
  NEW_APPOINTMENT = "NEW_APPOINTMENT",
}

export interface INotification {
  type: NotificationType;
  title: string;
  body?: string;
  recipientId: string;
  actorId?: string;
  appointmentId?: string;
  vetId?: string;
  petId?: string;
  petParentId?: string;
  data?: Record<string, unknown>;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  subTitle?: string;
}

interface NotificationProps {
  notification: INotification;
  onClick?: (notification: INotification) => void;
  onDelete?: (notification: INotification) => void;
  className?: string;
  onClose?: () => void;
}

const SystemNotification: React.FC<NotificationProps> = ({
  notification,
  onClick,
  onDelete,
  className = "",
  onClose,
}) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (
      notification.type === NotificationType.NEW_MESSAGE &&
      notification.appointmentId
    ) {
      const base =
        session?.user?.role === "pet_parent"
          ? "/dashboard/pet-parent/appointments/"
          : "/dashboard/doctor/appointments/";

      // Handle appointmentId - it could be a string, ObjectId, or populated object
      let appointmentId: string;
      if (typeof notification.appointmentId === "string") {
        appointmentId = notification.appointmentId;
      } else if (
        notification.appointmentId &&
        typeof notification.appointmentId === "object"
      ) {
        // If it's a populated object, get the _id
        appointmentId =
          (notification.appointmentId as any)._id ||
          String(notification.appointmentId);
      } else {
        appointmentId = String(notification.appointmentId);
      }

      router.push(`${base}${appointmentId}`);
    }
    // Always call onClick to close the panel, regardless of notification type
    onClick?.(notification);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(notification);
    }
  };

  // Determine icon and styling based on notification type
  const getNotificationConfig = () => {
    switch (notification.type) {
      case NotificationType.RECURRING_DONATION:
      case NotificationType.NEW_DONATION:
        return {
          icon: <RefreshCw className="text-white" size={20} />,
          iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
          gradientFrom: "from-emerald-50",
          gradientTo: "to-emerald-100/50",
          borderColor: "border-emerald-200",
          accentColor: "text-emerald-700",
          hoverShadow: "hover:shadow-emerald-100",
        };
      case NotificationType.NEW_APPOINTMENT:
        return {
          icon: <FaCalendarCheck className="text-white" size={18} />,
          iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
          gradientFrom: "from-blue-50",
          gradientTo: "to-blue-100/50",
          borderColor: "border-blue-200",
          accentColor: "text-blue-700",
          hoverShadow: "hover:shadow-blue-100",
        };
      case NotificationType.PRESCRIPTION_REQUEST:
        return {
          icon: <FaPrescriptionBottle className="text-white" size={18} />,
          iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
          gradientFrom: "from-purple-50",
          gradientTo: "to-purple-100/50",
          borderColor: "border-purple-200",
          accentColor: "text-purple-700",
          hoverShadow: "hover:shadow-purple-100",
        };
      case NotificationType.NEW_MESSAGE:
        return {
          icon: <FaComment className="text-white" size={18} />,
          iconBg: "bg-gradient-to-br from-orange-500 to-orange-600",
          gradientFrom: "from-orange-50",
          gradientTo: "to-orange-100/50",
          borderColor: "border-orange-200",
          accentColor: "text-orange-700",
          hoverShadow: "hover:shadow-orange-100",
        };
      default:
        return {
          icon: <FaComment className="text-white" size={18} />,
          iconBg: "bg-gradient-to-br from-gray-500 to-gray-600",
          gradientFrom: "from-gray-50",
          gradientTo: "to-gray-100/50",
          borderColor: "border-gray-200",
          accentColor: "text-gray-700",
          hoverShadow: "hover:shadow-gray-100",
        };
    }
  };

  const config = getNotificationConfig();
  const handleWritePrescription = () => {
    setIsPrescriptionModalOpen(true);
  };

  return (
    <div
      className={`group relative overflow-hidden bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} backdrop-blur-sm border ${config.borderColor} rounded-2xl cursor-pointer transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-xl ${config.hoverShadow} ${className}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-4 flex-1">
            {/* Icon */}
            <div
              className={`flex-shrink-0 w-11 h-11 rounded-xl ${
                config.iconBg
              } shadow-lg flex items-center justify-center transform transition-transform duration-300 ${
                isHovered ? "scale-110 rotate-3" : ""
              }`}
            >
              {config.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold text-lg leading-tight ${config.accentColor} transition-colors duration-200`}
              >
                {notification.title}
              </h3>
              {notification.subTitle && (
                <p className="text-gray-600 font-medium mt-1 text-sm">
                  {notification.subTitle}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-end space-y-2 ml-4">
            <button
              onClick={handleDelete}
              className="group/btn flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
            >
              <Trash2
                size={16}
                className="transition-transform duration-200 group-hover/btn:scale-110"
              />
            </button>
            <div className="text-xs text-gray-500 font-medium bg-white/70 px-2 py-1 rounded-full">
              {formatRelativeTime(notification.createdAt?.toString() ?? "")}
            </div>
          </div>
        </div>

        {/* Body */}
        {notification.body && (
          <div className="ml-15 mb-4">
            <p className="text-gray-700 leading-relaxed font-medium">
              {notification.body}
            </p>
          </div>
        )}

        {/* Additional data */}
        {notification.data && (
          <div className="ml-15 mb-4">
            {notification.type === NotificationType.RECURRING_DONATION && (
              <div className="bg-white/80 rounded-lg p-3 border border-emerald-100">
                <p className="text-emerald-700 font-semibold">
                  Amount: ${String(notification.data?.donationAmount || 0)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Prescription actions */}
        {notification.type === NotificationType.PRESCRIPTION_REQUEST && (
          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={() => {
                router.push(
                  `/dashboard/doctor/appointments/${
                    (notification.appointmentId as any)?._id
                  }`
                );
                onClose && onClose();
              }}
              className="px-6 py-2 bg-white/80 text-gray-700 border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200 rounded-xl font-semibold"
              variant="ghost"
              size="lg"
            >
              View Details
            </Button>
            <Button
              onClick={handleWritePrescription}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl font-semibold transform hover:scale-105"
              variant="ghost"
              size="lg"
            >
              Start Prescription
            </Button>
          </div>
        )}
      </div>

      {/* Prescription Modal */}
      <Dialog
        open={isPrescriptionModalOpen}
        onOpenChange={(open) => setIsPrescriptionModalOpen(open)}
      >
        <DialogContent className="rounded-2xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Prescription Details
            </DialogTitle>
          </DialogHeader>

          <PrescriptionModal
            isOpen={isPrescriptionModalOpen}
            onClose={() => setIsPrescriptionModalOpen(false)}
            appointmentId={(notification.appointmentId as any)?._id as any}
            appointment={notification.appointmentId as any}
            pet={notification.petId as any}
            petParent={notification.petParentId as any}
            veterinarian={notification.vetId as any}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SystemNotification;
