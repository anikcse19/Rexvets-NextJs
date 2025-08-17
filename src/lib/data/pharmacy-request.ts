import { Appointment, PharmacyRequest } from "../types/pharmacy-transfer";

// Mock appointments data
export const mockAppointments: Appointment[] = [
  {
    id: "apt-001",
    date: "2024-01-15",
    time: "10:00 AM",
    petName: "Buddy",
    veterinarian: "Dr. Smith",
    service: "Regular Checkup",
  },
  {
    id: "apt-002",
    date: "2024-01-10",
    time: "2:30 PM",
    petName: "Luna",
    veterinarian: "Dr. Johnson",
    service: "Vaccination",
  },
  {
    id: "apt-003",
    date: "2024-01-05",
    time: "11:15 AM",
    petName: "Max",
    veterinarian: "Dr. Williams",
    service: "Dental Cleaning",
  },
  {
    id: "apt-004",
    date: "2023-12-28",
    time: "3:45 PM",
    petName: "Bella",
    veterinarian: "Dr. Brown",
    service: "Surgery Follow-up",
  },
];

// Mock pharmacy requests data
export const mockPharmacyRequests: PharmacyRequest[] = [
  {
    id: "req-001",
    pharmacyName: "PetCare Pharmacy",
    phoneNumber: "(555) 123-4567",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    appointmentId: "apt-001",
    appointmentDate: "2024-01-15",
    status: "completed",
    createdAt: "2024-01-16T10:30:00Z",
    paymentStatus: "paid",
    amount: 19.99,
  },
  {
    id: "req-002",
    pharmacyName: "Animal Health Pharmacy",
    phoneNumber: "(555) 987-6543",
    street: "456 Oak Ave",
    city: "Los Angeles",
    state: "CA",
    appointmentId: "apt-002",
    appointmentDate: "2024-01-10",
    status: "processing",
    createdAt: "2024-01-11T14:15:00Z",
    paymentStatus: "paid",
    amount: 19.99,
  },
];
