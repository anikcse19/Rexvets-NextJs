import { formatRelativeTime } from "@/lib/utils";
import { RefreshCw, Trash2 } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FaCalendarCheck,
  FaComment,
  FaPrescriptionBottle,
} from "react-icons/fa";

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
}

const SystemNotification: React.FC<NotificationProps> = ({
  notification,
  onClick,
  onDelete,
  className = "",
}) => {
  const router = useRouter();
  const { data: session } = useSession();

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
      if (typeof notification.appointmentId === 'string') {
        appointmentId = notification.appointmentId;
      } else if (notification.appointmentId && typeof notification.appointmentId === 'object') {
        // If it's a populated object, get the _id
        appointmentId = (notification.appointmentId as any)._id || String(notification.appointmentId);
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
          icon: <RefreshCw className="text-white" size={22} />,
          bgColor: "bg-[#0066D5]",
          titleColor: "text-blue-800",
          borderColor: "border-l-green-500",
        };
      case NotificationType.NEW_APPOINTMENT:
        return {
          icon: <FaCalendarCheck className="text-[#27A744]" size={22} />,
          bgColor: "",
          titleColor: "text-blue-800",
          borderColor: "border-l-blue-500",
        };
      case NotificationType.PRESCRIPTION_REQUEST:
        return {
          icon: <FaPrescriptionBottle className="text-purple-600" size={22} />,
          bgColor: "bg-purple-100",
          titleColor: "text-purple-800",
          borderColor: "border-l-purple-500",
        };
      case NotificationType.NEW_MESSAGE:
        return {
          icon: <FaComment className="text-orange-600" size={22} />,
          bgColor: "bg-orange-100",
          titleColor: "text-orange-800",
          borderColor: "border-l-orange-500",
        };
      default:
        return {
          icon: <FaComment className="text-gray-600" size={22} />,
          bgColor: "bg-gray-100",
          titleColor: "text-gray-800",
          borderColor: "border-l-gray-500",
        };
    }
  };

  const config = getNotificationConfig();

  return (
    <div
      className={`relative w-full max-w-md p-4 mx-4 mb-3 bg-white rounded-lg shadow-sm border-l-4 ${config.borderColor} cursor-pointer transition-all hover:shadow-md ${className}`}
      onClick={handleClick}
    >
      {/* Close button */}

      {/* Notification header with icon */}
      <div className="flex justify-between items-center">
        <div className="flex items-start mb-0">
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-md ${config.bgColor} mr-3`}
          >
            {config.icon}
          </div>
          <div className="flex-1">
            <h3 className={` text-base font-medium ${config.titleColor}`}>
              {notification.title}
            </h3>
            {notification.subTitle && (
              <p className="text-base font-medium text-gray-500">
                {notification.subTitle}
              </p>
            )}
          </div>
        </div>
        <div className=" flex flex-col items-center gap-2">
          <button
            onClick={handleDelete}
            className="flex  justify-end w-full items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Trash2 size={19} />
          </button>
          <p className="text-xs -mt-2 text-gray-500">
            {formatRelativeTime(notification.createdAt?.toString() ?? "")}
          </p>
        </div>
      </div>

      {/* Notification body */}
      {notification.body && (
        <div className="pl-11 mt-1">
          <p className="text-base text-gray-700">{notification.body}</p>
        </div>
      )}

      {/* Additional data based on type */}
      {notification.data && (
        <div className="pl-11 mt-2">
          {/* Render specific data based on notification type */}
          {notification.type === NotificationType.RECURRING_DONATION && (
            <div className="text-sm text-gray-600">
              <p>Amount: ${String(notification.data?.donationAmount || 0)}</p>
            </div>
          )}

          {/* {notification.type === NotificationType.NEW_APPOINTMENT && (
            <div className="text-sm text-gray-600">
              {!!notification.data?.vetName && (
                <p> {String(notification.data.vetName)}</p>
              )}
              {!!notification.data?.petName && (
                <p>For: {String(notification.data.petName)}</p>
              )}
              {!!notification.data?.date && (
                <p>When: {String(notification.data.date)}</p>
              )}
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default SystemNotification;
