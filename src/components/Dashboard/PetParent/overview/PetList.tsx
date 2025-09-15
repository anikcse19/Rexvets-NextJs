import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Heart, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import AddPetModal from "../Pets/AddPetModal";
import { PetRegistrationData } from "@/lib/validation/pet";
import { Pet } from "@/lib/types";
import { useSession } from "next-auth/react";
import { getPetsByParent } from "../Service/pet";

const PetList = () => {
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();

  const fetchPets = async () => {
    if (!session) {
      setPets([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getPetsByParent(
        (session.user as typeof session.user & { refId?: string })?.refId || ""
      );
      setPets(data.data || []);
    } catch (error) {
      console.error("Error fetching pets:", error);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [session]);

  const handlePetRegistrationSuccess = (petData: PetRegistrationData) => {
    console.log("Pet registered successfully:", petData);
    // Optionally, refetch pets list
    fetchPets();
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "bg-green-100 text-green-700 border-green-300";
      case "Under Treatment":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Critical":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <>
      <div className="xl:col-span-1">
        <Card className="shadow-xl border-0 bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">
                  My Pets
                </CardTitle>
                <p className="text-pink-100 mt-1">Your beloved companions</p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Loading Skeleton */}
              {loading && (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse flex items-center gap-4 p-4 border rounded-2xl bg-gray-50"
                    >
                      <div className="w-14 h-14 rounded-full bg-gray-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Pets Found */}
              {!loading && pets.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  <Heart className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                  <p className="text-lg font-medium">No pets found</p>
                  <p className="text-sm text-gray-400">
                    You haven’t added any pets yet. Click below to register a
                    new companion.
                  </p>
                </div>
              )}

              {/* Pets List */}
              {!loading &&
                pets.map((pet) => (
                  <div key={pet._id} className="group">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gray-50 to-pink-50/30 border border-gray-200/60 hover:border-pink-300/60 transition-all duration-300 hover:shadow-lg p-4">
                      <div className="flex items-center gap-4">
                        {/* Pet Avatar */}
                        <Avatar className="w-14 h-14 border-3 border-white shadow-md ring-2 ring-pink-100">
                          <AvatarImage src={pet.image} alt={pet.name} />
                          <AvatarFallback className="bg-gradient-to-br from-pink-100 to-pink-200 text-pink-700 font-bold">
                            {pet.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        {/* Pet Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">
                              {pet?.name}
                            </h3>
                            <Badge
                              className={`${getHealthStatusColor(
                                pet?.healthStatus
                              )} text-xs`}
                            >
                              {pet?.healthStatus || "Unknown"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 capitalize">
                            {pet?.species || "Unknown"} •{" "}
                            {pet?.breed || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Add New Pet Button */}
              <div
                onClick={() => setIsAddPetModalOpen(true)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 hover:border-pink-400 transition-all duration-300 p-6 text-center group-hover:bg-pink-50">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                        Add New Pet
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Register a new companion
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddPetModal
        isOpen={isAddPetModalOpen}
        onClose={() => setIsAddPetModalOpen(false)}
        onSuccess={handlePetRegistrationSuccess}
      />
    </>
  );
};

export default PetList;
