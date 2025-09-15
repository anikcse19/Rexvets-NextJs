// app/page.tsx
"use client";

import { IDoctor } from "@/models/Doctor";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  role: string;
  content: string;
}

export interface IVeterinaryMedicalReport {
  petInformation: {
    name: string;
    species: string;
    breed: string;
    age: string;
    gender: string;
    spayedOrNeutered: boolean;
    weightKg: number;
  };
  presentingComplaint: {
    description: string;
    onsetDate: string;
    symptomProgression: string;
  };
  clinicalObservations: {
    vomitingFrequency: string;
    appetite: string;
    behavior: string;
    hydrationStatus: string;
  };
  diagnosis: {
    suspectedCondition: string;
    diagnosticTests: string[];
    labFindings: string;
  };
  treatmentPlan: {
    medications: string[];
    diet: string;
    lifestyleRecommendations: string[];
    followUp: string;
  };
  prognosis: {
    expectedRecovery: string;
    warningSigns: string[];
  };
  notes: string[];
}

interface ApiResponse {
  message?: string;
  report?: IVeterinaryMedicalReport | null;
  recommendedDoctors?: IDoctor[] | null;
  error?: string;
}

export default function VetAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<IVeterinaryMedicalReport | null>(null);
  const [recommendedDoctors, setRecommendedDoctors] = useState<
    IDoctor[] | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  console.log("recommendedDoctors", recommendedDoctors);

  const scrollToBottom = () => {
    const container = messagesEndRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const downloadReportAsPDF = async () => {
    if (!reportRef.current) return;

    setIsLoading(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add more pages if the content is too long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename with pet name and date
      const petName = report?.petInformation.name || "pet";
      const date = new Date().toISOString().split("T")[0];
      const filename = `Vet_Report_${petName}_${date}.pdf`;

      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMessages),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.report) {
        setReport(data.report);
      }

      if (data.recommendedDoctors) {
        setRecommendedDoctors(data.recommendedDoctors);
      }

      if (data.message) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message! },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setReport(null);
    setRecommendedDoctors(null);
  };

  const bookAppointment = (doctor: IDoctor) => {
    // This would typically open a modal or navigate to a booking page
    alert(`Booking appointment with Dr. ${doctor.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-blue-900">
              <span className="text-blue-600">Rex</span> Vet AI Assistant
            </h1>
            {messages.length > 0 && (
              <button
                onClick={startNewConversation}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                New Consultation
              </button>
            )}
          </div>

          {report ? (
            <div className="space-y-6">
              <div className="flex justify-end mb-4">
                <button
                  onClick={downloadReportAsPDF}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                      Download Report as PDF
                    </>
                  )}
                </button>
              </div>

              <div ref={reportRef} className="p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-blue-900">
                  Veterinary Medical Report
                </h2>
                <div className="prose max-w-none">
                  <h3>Pet Information</h3>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <p>
                      <strong>Name:</strong> {report.petInformation.name}
                    </p>
                    <p>
                      <strong>Species:</strong> {report.petInformation.species}
                    </p>
                    <p>
                      <strong>Breed:</strong> {report.petInformation.breed}
                    </p>
                    <p>
                      <strong>Age:</strong> {report.petInformation.age}
                    </p>
                    <p>
                      <strong>Gender:</strong> {report.petInformation.gender}
                    </p>
                    <p>
                      <strong>Spayed/Neutered:</strong>{" "}
                      {report.petInformation.spayedOrNeutered ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Weight:</strong> {report.petInformation.weightKg}{" "}
                      kg
                    </p>
                  </div>

                  <h3>Presenting Complaint</h3>
                  <p>
                    <strong>Description:</strong>{" "}
                    {report.presentingComplaint.description}
                  </p>
                  <p>
                    <strong>Onset:</strong>{" "}
                    {report.presentingComplaint.onsetDate}
                  </p>
                  <p>
                    <strong>Progression:</strong>{" "}
                    {report.presentingComplaint.symptomProgression}
                  </p>

                  <h3>Clinical Observations</h3>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <p>
                      <strong>Vomiting:</strong>{" "}
                      {report.clinicalObservations.vomitingFrequency}
                    </p>
                    <p>
                      <strong>Appetite:</strong>{" "}
                      {report.clinicalObservations.appetite}
                    </p>
                    <p>
                      <strong>Behavior:</strong>{" "}
                      {report.clinicalObservations.behavior}
                    </p>
                    <p>
                      <strong>Hydration:</strong>{" "}
                      {report.clinicalObservations.hydrationStatus}
                    </p>
                  </div>

                  <h3>Diagnosis</h3>
                  <p>
                    <strong>Suspected Condition:</strong>{" "}
                    {report.diagnosis.suspectedCondition}
                  </p>
                  <p>
                    <strong>Recommended Tests:</strong>{" "}
                    {report.diagnosis.diagnosticTests.join(", ")}
                  </p>
                  <p>
                    <strong>Lab Findings:</strong>{" "}
                    {report.diagnosis.labFindings}
                  </p>

                  <h3>Treatment Plan</h3>
                  <p>
                    <strong>Medications:</strong>{" "}
                    {report.treatmentPlan.medications.join(", ")}
                  </p>
                  <p>
                    <strong>Diet:</strong> {report.treatmentPlan.diet}
                  </p>
                  <p>
                    <strong>Lifestyle Recommendations:</strong>{" "}
                    {report.treatmentPlan.lifestyleRecommendations.join(", ")}
                  </p>
                  <p>
                    <strong>Follow-up:</strong> {report.treatmentPlan.followUp}
                  </p>

                  <h3>Prognosis</h3>
                  <p>
                    <strong>Expected Recovery:</strong>{" "}
                    {report.prognosis.expectedRecovery}
                  </p>
                  <p>
                    <strong>Warning Signs:</strong>{" "}
                    {report.prognosis.warningSigns.join(", ")}
                  </p>

                  <h3>Notes</h3>
                  <ul>
                    {report.notes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>

                  <div className="mt-6 p-4 bg-yellow-50 rounded border border-yellow-200">
                    <strong>Disclaimer:</strong> This assessment is not a
                    substitute for professional veterinary care. Please consult
                    with a licensed veterinarian for proper diagnosis and
                    treatment.
                  </div>
                </div>
              </div>

              {recommendedDoctors && recommendedDoctors.length > 0 && (
                <div className="p-6 bg-blue-50 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-blue-900">
                    Recommended Veterinarians
                  </h2>
                  <p className="mb-4">
                    Based on your pet's condition, we recommend consulting with
                    these specialists:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendedDoctors?.map((doctor, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg shadow"
                      >
                        <div className="flex items-start mb-3">
                          {doctor.profileImage && (
                            <img
                              src={doctor.profileImage}
                              alt={doctor.name}
                              className="w-16 h-16 rounded-full object-cover mr-4"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-lg">
                              {doctor.name}
                            </h3>
                            <p className="text-blue-600">
                              {doctor.specialization}
                            </p>
                            {doctor.specialities && (
                              <p className="text-sm text-gray-600">
                                Specialties: {doctor.specialities.join(", ")}
                              </p>
                            )}
                          </div>
                        </div>

                        {doctor.bio && (
                          <p className="text-sm mb-3">
                            {doctor.bio.substring(0, 100)}...
                          </p>
                        )}

                        <div className="flex justify-between items-center">
                          <p className="font-semibold">
                            ${doctor.consultationFee} consultation
                          </p>
                          <button
                            onClick={() => bookAppointment(doctor)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              ref={messagesEndRef}
              className="mb-6 h-96 overflow-y-auto p-4 border rounded-lg bg-gray-50"
            >
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-4">🐕</div>
                    <p className="text-xl font-medium">
                      Hello, I'm Rex Vet's AI Assistant
                    </p>
                    <p className="mt-2">
                      I'm here to help assess your pet's health concerns.
                    </p>
                    <p className="mt-4">
                      I'll ask you a few questions one at a time to understand
                      your pet's situation.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-4 ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 text-gray-800 rounded-lg p-4">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                          <div
                            className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* <div ref={messagesEndRef} /> */}
                </div>
              )}
            </div>
          )}

          {!report && (
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer here..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isLoading || !input.trim()}
              >
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
