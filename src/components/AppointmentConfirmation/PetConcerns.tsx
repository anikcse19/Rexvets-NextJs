import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle, Heart, Plus } from "lucide-react";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const predefinedConcerns = [
  { name: "General Checkup", icon: "🩺", color: "from-blue-500 to-cyan-500" },
  { name: "Vaccination", icon: "💉", color: "from-green-500 to-emerald-500" },
  { name: "Dental Care", icon: "🦷", color: "from-yellow-500 to-amber-500" },
  { name: "Skin Issues", icon: "🧴", color: "from-pink-500 to-rose-500" },
  {
    name: "Behavioral Problems",
    icon: "🧠",
    color: "from-purple-500 to-violet-500",
  },
  {
    name: "Weight Management",
    icon: "⚖️",
    color: "from-indigo-500 to-blue-500",
  },
  { name: "Digestive Issues", icon: "🍽️", color: "from-orange-500 to-red-500" },
  { name: "Eye/Ear Problems", icon: "👁️", color: "from-teal-500 to-cyan-500" },
  { name: "Injury Assessment", icon: "🩹", color: "from-red-500 to-pink-500" },
  {
    name: "Medication Review",
    icon: "💊",
    color: "from-emerald-500 to-green-500",
  },
];

interface PetConcernsProps {
  selectedConcerns: string[];
  setSelectedConcerns: React.Dispatch<React.SetStateAction<string[]>>;
  customConcerns: string[];
  setCustomConcerns: React.Dispatch<React.SetStateAction<string[]>>;
}

const PetConcerns: React.FC<PetConcernsProps> = ({
  selectedConcerns,
  setSelectedConcerns,
  customConcerns,
  setCustomConcerns,
}) => {
  const [customConcern, setCustomConcern] = useState("");

  const handleConcernSelection = (concern: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((c) => c !== concern)
        : [...prev, concern]
    );
  };

  const addCustomConcern = () => {
    if (
      customConcern.trim() &&
      !customConcerns.includes(customConcern.trim())
    ) {
      setCustomConcerns([...customConcerns, customConcern.trim()]);
      setCustomConcern("");
    }
  };

  const removeCustomConcern = (concern: string) => {
    setCustomConcerns(customConcerns.filter((c) => c !== concern));
  };
  return (
    <Card className="mb-8 border border-gray-200 bg-white backdrop-blur-xl overflow-hidden">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 bg-red-600 rounded-xl">
            <Heart className="w-6 h-6 text-white" />
          </div>
          Health Concerns
          <Badge className="bg-red-600 text-white">
            {selectedConcerns.length + customConcerns.length} selected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {predefinedConcerns.map((concern) => (
            <div
              key={concern.name}
              onClick={() => handleConcernSelection(concern.name)}
              className={cn(
                "relative p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 group border-2",
                selectedConcerns.includes(concern.name)
                  ? `bg-gradient-to-r ${concern.color} text-white border-transparent shadow-lg scale-105`
                  : "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "text-2xl p-2 rounded-lg transition-all duration-300",
                    selectedConcerns.includes(concern.name)
                      ? "bg-white/20"
                      : "bg-gray-100 group-hover:bg-gray-200"
                  )}
                >
                  {concern.icon}
                </div>
                <div className="flex-1">
                  <p
                    className={cn(
                      "font-semibold transition-colors duration-300",
                      selectedConcerns.includes(concern.name)
                        ? "text-white"
                        : "text-gray-900"
                    )}
                  >
                    {concern.name}
                  </p>
                </div>
                {selectedConcerns.includes(concern.name) && (
                  <CheckCircle className="w-5 h-5 text-white animate-pulse" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <Label className="text-lg font-semibold mb-4 block text-gray-900">
            Add Custom Concern
          </Label>
          <div className="flex gap-3">
            <Input
              placeholder="Describe your specific concern..."
              value={customConcern}
              onChange={(e) => setCustomConcern(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCustomConcern()}
              className="flex-1 border-2 border-gray-200 focus:border-purple-500 transition-colors duration-300"
            />
            <Button
              onClick={addCustomConcern}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {customConcerns.length > 0 && (
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-gray-900">
              Your Custom Concerns
            </Label>
            <div className="flex flex-wrap gap-3">
              {customConcerns.map((concern) => (
                <Badge
                  key={concern}
                  variant="secondary"
                  className="cursor-pointer bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200 transition-all duration-300 transform hover:scale-105 px-4 py-2 text-sm"
                  onClick={() => removeCustomConcern(concern)}
                >
                  {concern} ×
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PetConcerns;
