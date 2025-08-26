import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle, PawPrint, Plus } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import AddPetModal from "../Dashboard/PetParent/Pets/AddPetModal";
import { useSession } from "next-auth/react";
import { getPetsByParent } from "../Dashboard/PetParent/Service/pet";

interface Pet {
  _id: string;
  name: string;
  type: string;
  species: String;
  breed: string;
  age: string;
  image?: string;
  color?: string;
  dateOfBirth: string;
}

interface PetSelectionProps {
  selectedPet: string | null;
  setSelectedPet: React.Dispatch<React.SetStateAction<string | null>>;
}

const PetSelection: React.FC<PetSelectionProps> = ({
  selectedPet,
  setSelectedPet,
}) => {
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);

  const { data: session } = useSession();

  const fetchPets = async () => {
    if (!session) {
      setPets([]);
      return;
    }
    const data = await getPetsByParent(
      (session.user as typeof session.user & { refId?: string })?.refId || ""
    );
    setPets(data.data || []);
    if (data.data.length === 1) {
      setSelectedPet(data.data[0]._id);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [session]);

  const handlePetSelection = (id: string) => {
    setSelectedPet((prev) => (prev === id ? null : id));
  };

  const handleCloseModal = () => {
    setIsAddPetModalOpen(false);
    // setEditingPet(null);
    fetchPets();
  };

  function calculatePetAge(dob: string) {
    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""}`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""}`;
    } else {
      return `${days} day${days > 1 ? "s" : ""}`;
    }
  }
  return (
    <div>
      <Card className="mb-8 border border-gray-200 bg-white backdrop-blur-xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="relative pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-green-600 rounded-xl">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              Choose Your Pets
              <Badge className="bg-blue-600 text-white">
                {selectedPet ? "1 selected" : "0 selected"}
              </Badge>
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => setIsAddPetModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Pet
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Array.isArray(pets) ? pets : [])?.map((pet) => (
              <div
                key={pet._id}
                onClick={() => handlePetSelection(pet._id)}
                className={cn(
                  "relative p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group",
                  selectedPet === pet._id
                    ? "bg-blue-600 text-white shadow-2xl scale-105"
                    : "bg-white hover:bg-gray-50 shadow-lg border border-gray-100"
                )}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <Avatar className="w-16 h-16 ring-4 ring-white/50 shadow-lg">
                      <AvatarImage src={pet.image} alt={pet.name} />
                      <AvatarFallback
                        className={cn(
                          "text-white text-lg font-bold bg-gradient-to-r",
                          pet.color || "from-gray-400 to-gray-500"
                        )}
                      >
                        {pet.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    {selectedPet === pet._id && (
                      <div className="p-2 bg-white/20 rounded-full">
                        <CheckCircle className="w-6 h-6 text-white animate-pulse" />
                      </div>
                    )}
                  </div>
                  <h4
                    className={cn(
                      "text-xl font-bold mb-2",
                      selectedPet === pet._id ? "text-white" : "text-gray-900"
                    )}
                  >
                    {pet.name}
                  </h4>
                  <div className="space-y-1">
                    <p
                      className={cn(
                        "text-sm font-medium capitalize",
                        selectedPet === pet._id
                          ? "text-white/90"
                          : "text-gray-600"
                      )}
                    >
                      {pet.species} • {pet.breed}
                    </p>
                    <p
                      className={cn(
                        "text-sm",
                        selectedPet === pet._id
                          ? "text-white/80"
                          : "text-gray-500"
                      )}
                    >
                      {calculatePetAge(pet?.dateOfBirth)} old
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <AddPetModal isOpen={isAddPetModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default PetSelection;
