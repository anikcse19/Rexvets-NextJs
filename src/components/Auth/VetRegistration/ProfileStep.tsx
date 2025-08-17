"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, User, FileText } from "lucide-react";
import FileUpload from "@/components/shared/FileUpload";
import { US_STATES } from "@/lib";

interface ProfileStepProps {
  onNext: (profileData: any) => void;
  onBack: () => void;
  isSubmitting?: boolean;
  errors?: Record<string, string>;
  initialData?: {
    firstName?: string;
    lastName?: string;
  };
}

interface LicenseData {
  licenseNumber: string;
  deaNumber?: string;
  state: string;
  licenseFile: File | null;
}

export default function ProfileStep({
  onNext,
  onBack,
  isSubmitting = false,
  errors = {},
  initialData = {},
}: ProfileStepProps) {
  const [profileData, setProfileData] = useState({
    profilePicture: null as File | null,
    signature: '',
    signatureImage: null as File | null,
    cv: null as File | null,
    licenses: [] as LicenseData[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ProfileStep: Form submitted with data:', profileData);
    onNext(profileData);
  };

  const handleFileChange = (files: File[], field: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: files[0] || null
    }));
  };

  const addLicense = () => {
    setProfileData(prev => ({
      ...prev,
      licenses: [...prev.licenses, {
        licenseNumber: '',
        deaNumber: '',
        state: '',
        licenseFile: null,
      }]
    }));
  };

  const removeLicense = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      licenses: prev.licenses.filter((_, i) => i !== index)
    }));
  };

  const updateLicense = (index: number, field: keyof LicenseData, value: string | File | null) => {
    setProfileData(prev => ({
      ...prev,
      licenses: prev.licenses.map((license, i) => 
        i === index ? { ...license, [field]: value } : license
      )
    }));
  };

  const handleLicenseFileChange = (files: File[], licenseIndex: number) => {
    updateLicense(licenseIndex, 'licenseFile', files[0] || null);
  };

  // Create vet name for file prefixing
  const getVetName = () => {
    const firstName = initialData?.firstName || '';
    const lastName = initialData?.lastName || '';
    return `${firstName} ${lastName}`.trim();
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
            Profile & Documents
          </CardTitle>
          <p className="text-muted-foreground">
            Upload your documents and complete your profile
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="space-y-6">
          {/* Profile Picture */}
          <FileUpload
            label="Profile Picture"
            name="profilePicture"
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
            onFileChange={(files) => handleFileChange(files, 'profilePicture')}
            onError={(error) => console.error('Profile picture error:', error)}
            vetName={getVetName()}
          />

          {/* Signature */}
          <div className="space-y-2">
                         <Label htmlFor="signature" className="text-white">Digital Signature</Label>
            <Textarea
              id="signature"
              value={profileData.signature}
              onChange={(e) => setProfileData(prev => ({ ...prev, signature: e.target.value }))}
              placeholder="Type your signature or upload an image"
              rows={3}
            />
            {errors.signature && <p className="text-sm text-red-500">{errors.signature}</p>}
          </div>

          {/* Signature Image */}
          <FileUpload
            label="Signature Image (Optional)"
            name="signatureImage"
            accept="image/*"
            maxSize={2 * 1024 * 1024} // 2MB
            onFileChange={(files) => handleFileChange(files, 'signatureImage')}
            onError={(error) => console.error('Signature image error:', error)}
            vetName={getVetName()}
          />

          {/* CV/Resume */}
          <FileUpload
            label="CV/Resume"
            name="cv"
            accept=".pdf,.doc,.docx"
            maxSize={10 * 1024 * 1024} // 10MB
            onFileChange={(files) => handleFileChange(files, 'cv')}
            onError={(error) => console.error('CV error:', error)}
            vetName={getVetName()}
          />

          {/* License Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                             <Label className="text-base font-semibold text-white">License Information</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLicense}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add License
              </Button>
            </div>
            
            {profileData.licenses.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <p className="text-sm text-gray-500 mb-2">No licenses added yet</p>
                <p className="text-xs text-gray-400">Click "Add License" to add your veterinary license information</p>
              </div>
            ) : (
              <div className="space-y-4">
                {profileData.licenses.map((license, index) => (
                  <Card key={index} className="border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">License #{index + 1}</CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLicense(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* License Number */}
                        <div className="space-y-2">
                                                     <Label htmlFor={`licenseNumber-${index}`} className="text-white">
                             License Number *
                           </Label>
                          <Input
                            id={`licenseNumber-${index}`}
                            value={license.licenseNumber}
                            onChange={(e) => updateLicense(index, 'licenseNumber', e.target.value)}
                            placeholder="Enter license number"
                            className={errors[`licenses.${index}.licenseNumber`] ? 'border-red-500' : ''}
                          />
                          {errors[`licenses.${index}.licenseNumber`] && (
                            <p className="text-sm text-red-500">{errors[`licenses.${index}.licenseNumber`]}</p>
                          )}
                        </div>

                        {/* State */}
                        <div className="space-y-2">
                                                     <Label htmlFor={`state-${index}`} className="text-white">
                             State *
                           </Label>
                          <Select
                            value={license.state}
                            onValueChange={(value) => updateLicense(index, 'state', value)}
                          >
                            <SelectTrigger className={errors[`licenses.${index}.state`] ? 'border-red-500' : ''}>
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
                          {errors[`licenses.${index}.state`] && (
                            <p className="text-sm text-red-500">{errors[`licenses.${index}.state`]}</p>
                          )}
                        </div>
                      </div>

                      {/* DEA Number */}
                      <div className="space-y-2">
                                                 <Label htmlFor={`deaNumber-${index}`} className="text-white">
                           DEA Number (Optional)
                         </Label>
                        <Input
                          id={`deaNumber-${index}`}
                          value={license.deaNumber || ''}
                          onChange={(e) => updateLicense(index, 'deaNumber', e.target.value)}
                          placeholder="Enter DEA number if applicable"
                        />
                      </div>

                      {/* License File */}
                      <div className="space-y-2">
                                                 <Label className="text-white">License File *</Label>
                        <FileUpload
                          label=""
                          name={`licenseFile-${index}`}
                          accept=".pdf,.jpg,.jpeg,.png"
                          maxSize={5 * 1024 * 1024} // 5MB
                          onFileChange={(files) => handleLicenseFileChange(files, index)}
                          onError={(error) => console.error(`License ${index + 1} file error:`, error)}
                          preview={true}
                          vetName={getVetName()}
                        />
                        {errors[`licenses.${index}.licenseFile`] && (
                          <p className="text-sm text-red-500">{errors[`licenses.${index}.licenseFile`]}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* General license errors */}
            {errors.licenses && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.licenses}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <Button variant="outline" onClick={onBack} className="flex-1 h-12">
            Back
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {isSubmitting ? 'Submitting...' : 'Complete Registration'}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</motion.div>
  );
}
