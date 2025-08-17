"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  Shield, 
  Bell, 
  Globe, 
  Clock,
  Heart,
  Users,
  Settings
} from "lucide-react";

export default function UserProfileCard() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const user = session.user;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Basic Profile Information */}
      <Card className="backdrop-blur-sm bg-white/95 shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            {user.image && (
              <img 
                src={user.image} 
                alt={user.name || "Profile"} 
                className="w-16 h-16 rounded-full border-2 border-blue-200"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <Badge variant={user.role === 'veterinarian' ? 'default' : 'secondary'} className="mt-1">
                {user.role === 'veterinarian' ? 'Veterinarian' : 
                 user.role === 'technician' ? 'Vet Technician' : 'Pet Parent'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {user.phoneNumber && (
              <div className="flex items-center space-x-2 text-gray-700">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>{user.phoneNumber}</span>
              </div>
            )}
            
            {user.state && (
              <div className="flex items-center space-x-2 text-gray-700">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>
                  {[user.city, user.state, user.zipCode].filter(Boolean).join(', ')}
                </span>
              </div>
            )}

            {user.address && (
              <div className="flex items-center space-x-2 text-gray-700">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>{user.address}</span>
              </div>
            )}

            {user.emailVerified && (
              <div className="flex items-center space-x-2 text-green-700">
                <Shield className="w-4 h-4" />
                <span>Email Verified</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Professional Information (for veterinarians) */}
      {user.role === 'veterinarian' && (
        <Card className="backdrop-blur-sm bg-white/95 shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.specialization && (
              <div className="flex items-center space-x-2 text-gray-700">
                <span className="font-medium">Specialization:</span>
                <Badge variant="outline">{user.specialization}</Badge>
              </div>
            )}

            {user.licenseNumber && (
              <div className="flex items-center space-x-2 text-gray-700">
                <span className="font-medium">License:</span>
                <span>{user.licenseNumber}</span>
              </div>
            )}

            {user.consultationFee && (
              <div className="flex items-center space-x-2 text-gray-700">
                <span className="font-medium">Consultation Fee:</span>
                <span>${user.consultationFee}</span>
              </div>
            )}

            <div className="flex items-center space-x-2 text-gray-700">
              <span className="font-medium">Status:</span>
              <Badge variant={user.available ? 'default' : 'secondary'}>
                {user.available ? 'Available' : 'Unavailable'}
              </Badge>
            </div>

            {user.isApproved && (
              <div className="flex items-center space-x-2 text-green-700">
                <Shield className="w-4 h-4" />
                <span>Approved Veterinarian</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Emergency Contact */}
      {user.emergencyContact?.name && (
        <Card className="backdrop-blur-sm bg-white/95 shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2 text-gray-700">
              <Users className="w-4 h-4 text-red-600" />
              <span className="font-medium">{user.emergencyContact.name}</span>
            </div>
            
            {user.emergencyContact.phone && (
              <div className="flex items-center space-x-2 text-gray-700">
                <Phone className="w-4 h-4 text-red-600" />
                <span>{user.emergencyContact.phone}</span>
              </div>
            )}

            {user.emergencyContact.relationship && (
              <div className="flex items-center space-x-2 text-gray-700">
                <span className="font-medium">Relationship:</span>
                <span>{user.emergencyContact.relationship}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preferences */}
      {user.preferences && (
        <Card className="backdrop-blur-sm bg-white/95 shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${user.preferences.notifications.email ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm text-gray-700">Email Notifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${user.preferences.notifications.sms ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm text-gray-700">SMS Notifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${user.preferences.notifications.push ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm text-gray-700">Push Notifications</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-gray-700">
              <Globe className="w-4 h-4" />
              <span className="font-medium">Language:</span>
              <span>{user.preferences.language.toUpperCase()}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-700">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Timezone:</span>
              <span>{user.preferences.timezone}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pets (for pet parents) */}
      {user.role === 'pet_parent' && user.pets && user.pets.length > 0 && (
        <Card className="backdrop-blur-sm bg-white/95 shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent flex items-center gap-2">
              <Heart className="w-5 h-5" />
              My Pets ({user.pets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.pets.map((pet: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">{pet.name}</h4>
                    <p className="text-sm text-gray-600">{pet.type} • {pet.breed}</p>
                  </div>
                  <Badge variant="outline">{pet.age} years</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
