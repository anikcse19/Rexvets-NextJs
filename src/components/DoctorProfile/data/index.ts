// Mock Doctor Data & Slots
export const mockDoctor = {
  id: "1",
  name: "Dr. Anik Rahman",
  image:
    "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
  degree: "DVM, PhD in Veterinary Medicine",
  bio: "Dr. Anik Rahman is a highly experienced veterinarian with over 12 years of practice in small animal medicine and surgery. He specializes in emergency medicine, cardiology, and complex surgical procedures. Dr. Rahman is passionate about providing compassionate care to pets and educating pet owners about preventive healthcare.",
  rating: 4.9,
  totalReviews: 847,
  licenseNumber: "VET-BD-2012-001234",
  experience: "12 years",

  contact: {
    phone: "+880 1234-567890",
    email: "anik@rexvet.com",
    clinicName: "RexVet Animal Hospital",
    address: "456 Pet Care Avenue, Gulshan, Dhaka 1212, Bangladesh",
  },

  specialties: [
    "Small Animal Surgery",
    "Emergency Medicine",
    "Cardiology",
    "Dermatology",
    "Orthopedics",
    "Oncology",
    "Dental Care",
    "Nutrition",
  ],

  speciesTreated: [
    { name: "Dogs", experience: "Expert", count: "1,245+" },
    { name: "Cats", experience: "Expert", count: "987+" },
    { name: "Birds", experience: "Advanced", count: "234+" },
    { name: "Rabbits", experience: "Advanced", count: "156+" },
    { name: "Hamsters", experience: "Intermediate", count: "89+" },
    { name: "Guinea Pigs", experience: "Intermediate", count: "67+" },
  ],

  reviews: [
    {
      id: "1",
      patientName: "Sarah Johnson",
      petName: "Max",
      rating: 5,
      date: "2025-01-10",
      comment:
        "Dr. Rahman was absolutely wonderful with Max. He took the time to explain everything and made sure we understood the treatment plan. Max is doing much better now!",
    },
    {
      id: "2",
      patientName: "Mike Chen",
      petName: "Luna",
      rating: 5,
      date: "2025-01-08",
      comment:
        "Excellent care and very professional. Dr. Rahman diagnosed Luna's condition quickly and the treatment was very effective. Highly recommended!",
    },
    {
      id: "3",
      patientName: "Emma Davis",
      petName: "Charlie",
      rating: 5,
      date: "2025-01-05",
      comment:
        "Amazing veterinarian! Charlie was very anxious but Dr. Rahman was so gentle and patient. The surgery went perfectly and Charlie recovered quickly.",
    },
    {
      id: "4",
      patientName: "James Wilson",
      petName: "Bella",
      rating: 4,
      date: "2025-01-03",
      comment:
        "Great experience overall. Dr. Rahman is very knowledgeable and caring. The only minor issue was the wait time, but the quality of care made up for it.",
    },
  ],
};

export const mockAvailableSlots: Record<
  string,
  { time: string; available: boolean }[]
> = {
  "2025-08-25": [
    { time: "09:00", available: true },
    { time: "09:30", available: false },
    { time: "10:00", available: true },
  ],
  "2025-08-21": [
    { time: "09:00", available: true },
    { time: "09:30", available: true },
    { time: "10:00", available: false },
  ],
  "2025-08-22": [
    { time: "09:00", available: true },
    { time: "10:00", available: true },
    { time: "11:00", available: true },
  ],
};
