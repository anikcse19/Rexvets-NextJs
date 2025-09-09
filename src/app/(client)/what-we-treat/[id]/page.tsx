"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import { treatmentServices } from "@/lib";
import { AlertCircle, CheckCircle2, HelpCircle, Info } from "lucide-react";

export default function TreatmentDetails() {
  const { id } = useParams();
  const service = treatmentServices.find((item) => item.id === Number(id));

  if (!service) {
    return (
      <div className="p-10 text-center text-gray-500">Service not found.</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16">
      {/* Header */}
      <div className={`rounded-2xl p-6 text-white shadow-lg ${service.color}`}>
        <h1 className="text-3xl font-bold">{service.title}</h1>
        <p className="mt-2 text-lg">{service.description}</p>
      </div>

      {/* Image */}
      <div className="mt-6 rounded-2xl overflow-hidden  flex justify-center">
        <Image
          src={service.image}
          alt={service.title}
          width={400}
          height={100}
          className="object-cover"
        />
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2">
          <Info className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-semibold">About {service.title}</h2>
        </div>
        <p className="mt-3 text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-xl border border-blue-100">
          {service.detailedDescription}
        </p>
      </div>

      {/* Symptoms */}
      <div className="mt-10">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <h2 className="text-2xl font-semibold">Common Symptoms</h2>
        </div>
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {service.symptoms.map((symptom, index) => (
            <li
              key={index}
              className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100 text-gray-700"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              {symptom}
            </li>
          ))}
        </ul>
      </div>

      {/* Treatment Options */}
      <div className="mt-10">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl font-semibold">Treatment Options</h2>
        </div>
        <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {service.treatmentOptions.map((option, index) => (
            <li
              key={index}
              className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100 text-gray-700"
            >
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              {option}
            </li>
          ))}
        </ul>
      </div>

      {/* FAQ */}
      <div className="mt-12">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        </div>
        <div className="mt-6 space-y-4">
          {service.faq.map((item, index) => (
            <div
              key={index}
              className="p-5 border rounded-xl shadow-sm bg-purple-50 border-purple-100"
            >
              <div className="flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-purple-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-gray-700">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
