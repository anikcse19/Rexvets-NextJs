import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doctor } from "@/lib/types";
import { Award, Heart } from "lucide-react";
import {
  PawPrint,
  Dog,
  Cat,
  Bird,
  Rabbit,
  Fish,
  Turtle,
  Bug,
  Squirrel,
  Egg,
} from "lucide-react";
import React, { JSX } from "react";
export const getSpeciesIcon = (species: string) => {
  const speciesMap: Record<string, JSX.Element> = {
    Dogs: <Dog className="w-6 h-6 text-pink-600" />,
    Cats: <Cat className="w-6 h-6 text-pink-600" />,
    Birds: <Bird className="w-6 h-6 text-pink-600" />,
    "Exotic Birds": <Bird className="w-6 h-6 text-pink-600" />,
    Rabbits: <Rabbit className="w-6 h-6 text-pink-600" />,
    Hamsters: <Squirrel className="w-6 h-6 text-pink-600" />,
    "Guinea Pigs": <Squirrel className="w-6 h-6 text-pink-600" />,
    Ferrets: <Squirrel className="w-6 h-6 text-pink-600" />,
    Reptiles: <Turtle className="w-6 h-6 text-pink-600" />,
    Fish: <Fish className="w-6 h-6 text-pink-600" />,
    Horses: <PawPrint className="w-6 h-6 text-pink-600" />, // fallback
    Cattle: <PawPrint className="w-6 h-6 text-pink-600" />, // fallback
    Sheep: <PawPrint className="w-6 h-6 text-pink-600" />, // fallback
    Goats: <PawPrint className="w-6 h-6 text-pink-600" />, // fallback
    Pigs: <PawPrint className="w-6 h-6 text-pink-600" />, // fallback
    Chickens: <Egg className="w-6 h-6 text-pink-600" />,
    Primates: <Bug className="w-6 h-6 text-pink-600" />,
    Wildlife: <Bug className="w-6 h-6 text-pink-600" />,
  };

  return speciesMap[species] || <PawPrint className="w-6 h-6 text-pink-600" />;
};

const SpecialitiesAndSpecies = ({ vet }: { vet: Doctor }) => {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Specialities
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vet?.specialities?.length ? (
            <div className="space-y-3">
              {vet.specialities.map((specialty, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{specialty}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
              <Award className="w-10 h-10 text-yellow-400 mb-2" />
              <p className="text-sm font-medium">No specialities added yet.</p>
              <p className="text-xs text-gray-400">
                Your expertise will shine here ✨
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Species Treated */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-600" />
            Species Treated
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vet?.treatedSpecies?.length ? (
            <div className="grid grid-cols-2 gap-3">
              {vet.treatedSpecies.map((species, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-gray-50 text-center hover:bg-gray-100 transition-colors flex flex-col items-center justify-center"
                >
                  <div className="text-2xl mb-1">{getSpeciesIcon(species)}</div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {species}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
              <PawPrint className="w-10 h-10 text-pink-500 mb-2" />
              <p className="text-sm font-medium">No species selected yet.</p>
              <p className="text-xs text-gray-400">
                Add the animals you treat 🐾
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecialitiesAndSpecies;
