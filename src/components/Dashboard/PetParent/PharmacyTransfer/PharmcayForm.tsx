"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Stethoscope, MapPin, Phone, Building2 } from "lucide-react";
import { PharmacyFormData } from "@/lib/types/pharmacy-transfer";
import { pharmacyFormSchema } from "@/lib/validation/pharmacy-transfer";
import { mockAppointments } from "@/lib/data/pharmacy-request";
import { PaymentModal } from "./PaymentModal";
import StripeContext from "@/hooks/StripeContext";
import { useSession } from "next-auth/react";
import { getParentAppointments } from "../Service/get-all-appointments";
import { Appointment } from "@/lib/types";
import { toast } from "sonner";

interface PharmacyFormProps {
  setChangesData: React.Dispatch<React.SetStateAction<boolean>>;
}
export function PharmacyForm({ setChangesData }: PharmacyFormProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [formData, setFormData] = useState<PharmacyFormData | null>(null);
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>();

  const { data: session } = useSession();

  const parentId = session?.user?.refId as string;

  const form = useForm<PharmacyFormData>({
    resolver: zodResolver(pharmacyFormSchema),
    defaultValues: {
      pharmacyName: "",
      phoneNumber: "",
      street: "",
      city: "",
      state: "",
      appointmentId: "",
    },
  });

  const handleFormSubmit = (data: PharmacyFormData) => {
    setFormData(data);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (formData) {
      form.reset();
    }
    setIsPaymentModalOpen(false);
  };

  const fetchAppointments = async () => {
    if (!parentId) return;
    try {
      const data = await getParentAppointments(parentId);

      console.log("Fetched appointments:", data);

      setAppointmentsData(data?.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [session]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <Card className="w-full  shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="space-y-2 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Stethoscope className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Prescription Transfer Request
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Request your pet's prescription to be transferred to your
                preferred pharmacy
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              {/* Pharmacy Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Pharmacy Information
                  </h3>
                </div>

                <FormField
                  control={form.control}
                  name="pharmacyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Pharmacy Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter pharmacy name"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="(555) 123-4567"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Address Information
                  </h3>
                </div>

                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Street Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main Street"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          City
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="New York"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          State
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="NY"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Appointment Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Select Appointment
                  </h3>
                </div>

                <FormField
                  control={form.control}
                  name="appointmentId"
                  render={({ field }) => (
                    <FormItem className="py-2">
                      <FormLabel className="text-gray-700 font-medium">
                        Appointment
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-2">
                            <SelectValue
                              className="py-2"
                              placeholder="Select an appointment"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="py-2">
                          {appointmentsData?.map((appointment) => (
                            <SelectItem
                              key={appointment._id}
                              value={appointment._id}
                              className="py-2"
                            >
                              <div className="flex flex-col py-2">
                                <span className="font-medium capitalize">
                                  {appointment?.pet?.name} -{" "}
                                  {appointment?.appointmentType?.replace(
                                    "_",
                                    " "
                                  )}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {formatDate(appointment?.appointmentDate)} at{" "}
                                  {formatTime(appointment?.appointmentDate)}{" "}
                                  with {appointment?.veterinarian?.name}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">
                    Transfer Fee:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    $19.99
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Processing..."
                    : "Continue to Payment"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <StripeContext>
        <PaymentModal
          formData={formData}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={handlePaymentSuccess}
          amount={19.99}
          pharmacyName={formData?.pharmacyName || ""}
          setChangesData={setChangesData}
        />
      </StripeContext>
    </>
  );
}
