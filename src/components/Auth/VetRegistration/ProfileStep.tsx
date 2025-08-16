"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Plus,
  X,
  User,
  PenTool,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import SignatureCanvas from "react-signature-canvas";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { License } from "@/lib/types";
import { US_STATES } from "@/lib";

interface ProfileStepProps {
  onNext: (profileData: ProfileData) => void;
  onBack: () => void;
}

interface ProfileData {
  profilePicture: File | null;
  signature?: string;
  signatureImage?: File | null;
  cv: File | null;
  licenses: License[];
}

export default function ProfileStep({ onNext, onBack }: ProfileStepProps) {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [signatureText, setSignatureText] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("draw");

  const signatureCanvasRef = useRef<SignatureCanvas>(null);

  const {
    getRootProps: getProfileRootProps,
    getInputProps: getProfileInputProps,
  } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => setProfilePicture(acceptedFiles[0] || null),
  });

  const { getRootProps: getCvRootProps, getInputProps: getCvInputProps } =
    useDropzone({
      accept: { "application/pdf": [] },
      maxFiles: 1,
      onDrop: (acceptedFiles) => setCv(acceptedFiles[0] || null),
    });

  const addLicense = () => {
    setLicenses([
      ...licenses,
      { licenseNumber: "", deaNumber: "", state: "", licenseFile: null },
    ]);
  };

  const removeLicense = (index: number) => {
    setLicenses(licenses.filter((_, i) => i !== index));
  };

  const updateLicense = (index: number, field: keyof License, value: any) => {
    setLicenses(
      licenses.map((license, i) =>
        i === index ? { ...license, [field]: value } : license
      )
    );
  };

  const clearSignature = () => {
    signatureCanvasRef.current?.clear();
  };

  const getSignatureData = () => {
    if (activeTab === "draw" && signatureCanvasRef.current) {
      return signatureCanvasRef.current.toDataURL();
    }
    return signatureText;
  };

  const validateForm = () => {
    const hasRequiredFiles = profilePicture && cv;
    const hasValidLicenses =
      licenses.length > 0 &&
      licenses.every(
        (license) =>
          license.licenseNumber && license.state && license.licenseFile
      );
    const hasSignature =
      activeTab === "draw"
        ? !signatureCanvasRef.current?.isEmpty()
        : signatureText.trim().length > 0;

    return hasRequiredFiles && hasValidLicenses && hasSignature;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const signatureData = getSignatureData();
      const profileData: ProfileData = {
        profilePicture,
        signature:
          typeof signatureData === "string" ? signatureData : undefined,
        signatureImage:
          typeof signatureData !== "string" ? profilePicture : undefined,
        cv,
        licenses,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onNext(profileData);
    } catch (error) {
      console.error("Profile setup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-sm bg-white/95 shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            Complete Your Profile
          </CardTitle>
          <p className="text-muted-foreground">
            Upload your professional documents and signature
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Profile Picture */}
          <div>
            <Label className="text-base font-semibold flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Profile Picture *
            </Label>
            <div
              {...getProfileRootProps()}
              className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
            >
              <input {...getProfileInputProps()} />
              {profilePicture ? (
                <div className="space-y-2">
                  <img
                    src={URL.createObjectURL(profilePicture)}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                  <p className="text-sm text-muted-foreground">
                    {profilePicture.name}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProfilePicture(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">
                    Drop your profile picture here, or click to browse
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Signature */}
          <div>
            <Label className="text-base font-semibold flex items-center gap-2">
              <PenTool className="w-5 h-5" />
              Signature *
            </Label>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-2"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="draw">Draw Signature</TabsTrigger>
                <TabsTrigger value="type">Type Signature</TabsTrigger>
              </TabsList>

              <TabsContent value="draw" className="space-y-4">
                <div className="border rounded-lg p-4 bg-white">
                  <SignatureCanvas
                    ref={signatureCanvasRef}
                    canvasProps={{
                      width: 400,
                      height: 150,
                      className:
                        "signature-canvas border-2 border-dashed border-gray-200 rounded",
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSignature}
                    className="mt-2"
                  >
                    Clear Signature
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="type" className="space-y-4">
                <Textarea
                  placeholder="Type your signature here..."
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  className="min-h-[150px] font-script text-2xl"
                  style={{ fontFamily: "cursive" }}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* CV Upload */}
          <div>
            <Label className="text-base font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              CV/Resume (PDF) *
            </Label>
            <div
              {...getCvRootProps()}
              className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
            >
              <input {...getCvInputProps()} />
              {cv ? (
                <div className="space-y-2">
                  <FileText className="w-12 h-12 mx-auto text-blue-500" />
                  <p className="text-sm font-medium">{cv.name}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCv(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">
                    Drop your CV here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF files only
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Licenses */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-semibold">
                Professional Licenses *
              </Label>
              <Button variant="outline" size="sm" onClick={addLicense}>
                <Plus className="w-4 h-4 mr-1" />
                Add License
              </Button>
            </div>

            {licenses.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-8 border border-dashed rounded-lg">
                No licenses added yet. Click &quot;Add License&quot; to get
                started.
              </p>
            )}

            <div className="space-y-4">
              {licenses.map((license, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 space-y-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">License #{index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLicense(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>License Number *</Label>
                      <Input
                        value={license.licenseNumber}
                        onChange={(e) =>
                          updateLicense(index, "licenseNumber", e.target.value)
                        }
                        placeholder="Enter license number"
                      />
                    </div>

                    <div>
                      <Label>DEA Number</Label>
                      <Input
                        value={license.deaNumber}
                        onChange={(e) =>
                          updateLicense(index, "deaNumber", e.target.value)
                        }
                        placeholder="Enter DEA number"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>State of License *</Label>
                    <Select
                      value={license.state}
                      onValueChange={(value) =>
                        updateLicense(index, "state", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>License Document *</Label>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        updateLicense(
                          index,
                          "licenseFile",
                          e.target.files?.[0] || null
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button variant="outline" onClick={onBack} className="flex-1 h-12">
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!validateForm() || isLoading}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating Account...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
