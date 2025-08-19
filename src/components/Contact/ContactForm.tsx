"use client";

import emailjs from "@emailjs/browser";
import React, { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiOutlineMail,
} from "react-icons/hi";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // EmailJS configuration
  const SERVICE_ID = "your_service_id";
  const TEMPLATE_ID = "your_template_id";
  const PUBLIC_KEY = "your_public_key";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.subject.trim()) {
      setError("Subject is required");
      return false;
    }
    if (!formData.message.trim()) {
      setError("Message is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const templateParams = {
        from_name: formData.fullName,
        from_email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        to_name: "Your Name",
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      setIsSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("EmailJS error:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-start items-center  mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-4 mr-5">
                <HiOutlineMail className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className=" text-2xl text-center md:text-start md:text-4xl font-bold text-gray-900 mb-2">
                  Send us a Message
                </h1>
                <p className=" text-center md:text-start text-gray-500 text-lg">
                  Fill out the form below and we'll get back to you as soon as
                  possible
                </p>
              </div>
            </div>

            {/* Success Message */}
            {isSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4">
                <div className="flex items-start">
                  <HiCheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-green-800 font-medium">
                      Message sent successfully!
                    </p>
                    <p className="text-green-600 text-sm">
                      We'll get back to you soon.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
                <div className="flex items-start">
                  <HiExclamationCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <p className="ml-3 text-red-800">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name and Email */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 text-lg border-2 border-blue-200 rounded-2xl focus:ring-0 focus:border-blue-500 transition-colors duration-200 placeholder-transparent peer"
                    placeholder="Full Name *"
                  />
                  <label
                    htmlFor="fullName"
                    className="absolute left-6 -top-2.5 bg-white px-2 text-blue-600 text-sm font-medium transition-all duration-200 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-lg peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-blue-600 peer-focus:text-sm"
                  >
                    Full Name *
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 transition-colors duration-200 placeholder-transparent peer"
                    placeholder="Email Address *"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-6 -top-2.5 bg-white px-2 text-gray-600 text-sm font-medium transition-all duration-200 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-lg peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-blue-600 peer-focus:text-sm"
                  >
                    Email Address *
                  </label>
                </div>
              </div>

              {/* Phone and Subject */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 transition-colors duration-200 placeholder-transparent peer"
                    placeholder="Phone Number *"
                  />
                  <label
                    htmlFor="phone"
                    className="absolute left-6 -top-2.5 bg-white px-2 text-gray-600 text-sm font-medium transition-all duration-200 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-lg peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-blue-600 peer-focus:text-sm"
                  >
                    Phone Number *
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 transition-colors duration-200 placeholder-transparent peer"
                    placeholder="Subject *"
                  />
                  <label
                    htmlFor="subject"
                    className="absolute left-6 -top-2.5 bg-white px-2 text-gray-600 text-sm font-medium transition-all duration-200 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-lg peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-blue-600 peer-focus:text-sm"
                  >
                    Subject *
                  </label>
                </div>
              </div>

              {/* Message */}
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 transition-colors duration-200 resize-none placeholder-transparent peer"
                  placeholder="Message *"
                />
                <label
                  htmlFor="message"
                  className="absolute left-6 -top-2.5 bg-white px-2 text-gray-600 text-sm font-medium transition-all duration-200 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-lg peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-blue-600 peer-focus:text-sm"
                >
                  Message *
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      Send Message
                      <AiOutlineSend className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
