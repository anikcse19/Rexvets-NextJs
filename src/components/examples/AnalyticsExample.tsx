'use client';

import { useAnalytics } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsExample() {
  const {
    trackButtonClick,
    trackFormSubmit,
    trackDonation,
    trackAppointmentBooking,
    trackVeterinaryService,
    trackHealthcareEvent,
    trackPetHealthEvent,
    trackUserJourney,
    trackBusinessEvents,
  } = useAnalytics();

  const handleButtonClick = () => {
    trackButtonClick('example_button', '/analytics-example');
    alert('Button click tracked!');
  };

  const handleFormSubmit = (success: boolean) => {
    trackFormSubmit('example_form', success);
    alert(`Form submission tracked! Success: ${success}`);
  };

  const handleDonation = () => {
    trackDonation(50.00, 'stripe', true);
    alert('Donation tracked!');
  };

  const handleAppointmentBooking = () => {
    trackAppointmentBooking('doctor_123', 'consultation', true);
    alert('Appointment booking tracked!');
  };

  const handleServiceView = () => {
    trackVeterinaryService.viewService('service_1', 'Emergency Consultation', 75.00, 'emergency');
    alert('Service view tracked!');
  };

  const handleVideoConsultation = () => {
    trackVeterinaryService.videoConsultation('start', 'consultation_456');
    alert('Video consultation tracked!');
  };

  const handlePetProfileCreated = () => {
    trackVeterinaryService.petProfileCreated('dog', 3);
    alert('Pet profile creation tracked!');
  };

  const handleMedicalRecordUpload = () => {
    trackVeterinaryService.medicalRecordUpload('vaccination_record', 1024);
    alert('Medical record upload tracked!');
  };

  const handleSymptomChecker = () => {
    trackVeterinaryService.symptomChecker(['coughing', 'lethargy'], 'cat');
    alert('Symptom checker tracked!');
  };

  const handleUserRegistration = () => {
    trackHealthcareEvent.userRegistration('pet_parent', 'email');
    alert('User registration tracked!');
  };

  const handleConsultationBooking = () => {
    trackHealthcareEvent.consultationBooking('routine_checkup', 'dog', 'normal');
    alert('Consultation booking tracked!');
  };

  const handlePaymentProcessing = () => {
    trackHealthcareEvent.paymentProcessing(100.00, 'stripe', true);
    alert('Payment processing tracked!');
  };

  const handleVaccinationRecord = () => {
    trackPetHealthEvent.vaccinationRecord('rabies', 'dog');
    alert('Vaccination record tracked!');
  };

  const handleHealthCheckup = () => {
    trackPetHealthEvent.healthCheckup('annual', 5);
    alert('Health checkup tracked!');
  };

  const handleMedicationReminder = () => {
    trackPetHealthEvent.medicationReminder('heartworm_prevention', 'monthly');
    alert('Medication reminder tracked!');
  };

  const handleRegistration = () => {
    trackUserJourney.registration('email', true);
    alert('Registration tracked!');
  };

  const handlePayment = () => {
    trackBusinessEvents.payment('completed', 'stripe', 100.00, 'USD');
    alert('Payment tracked!');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Veterinary Telehealth Analytics Tracking Examples</CardTitle>
          <CardDescription>
            This component demonstrates how to use the analytics tracking system for a veterinary telehealth platform.
            Check the browser console and Google Analytics for tracking events.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Tracking */}
          <div>
            <h3 className="font-semibold mb-3">Basic Tracking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button onClick={handleButtonClick} variant="outline">
                Track Button Click
              </Button>
              
              <Button onClick={() => handleFormSubmit(true)} variant="outline">
                Track Form Success
              </Button>
              
              <Button onClick={() => handleFormSubmit(false)} variant="outline">
                Track Form Error
              </Button>
              
              <Button onClick={handleDonation} variant="outline">
                Track Donation
              </Button>
              
              <Button onClick={handleAppointmentBooking} variant="outline">
                Track Appointment
              </Button>
            </div>
          </div>

          {/* Veterinary Services */}
          <div>
            <h3 className="font-semibold mb-3">Veterinary Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button onClick={handleServiceView} variant="outline">
                Track Service View
              </Button>
              
              <Button onClick={handleVideoConsultation} variant="outline">
                Track Video Consultation
              </Button>
              
              <Button onClick={handlePetProfileCreated} variant="outline">
                Track Pet Profile Created
              </Button>
              
              <Button onClick={handleMedicalRecordUpload} variant="outline">
                Track Medical Record Upload
              </Button>
              
              <Button onClick={handleSymptomChecker} variant="outline">
                Track Symptom Checker
              </Button>
            </div>
          </div>

          {/* Healthcare Events */}
          <div>
            <h3 className="font-semibold mb-3">Healthcare Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button onClick={handleUserRegistration} variant="outline">
                Track User Registration
              </Button>
              
              <Button onClick={handleConsultationBooking} variant="outline">
                Track Consultation Booking
              </Button>
              
              <Button onClick={handlePaymentProcessing} variant="outline">
                Track Payment Processing
              </Button>
            </div>
          </div>

          {/* Pet Health Events */}
          <div>
            <h3 className="font-semibold mb-3">Pet Health Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button onClick={handleVaccinationRecord} variant="outline">
                Track Vaccination Record
              </Button>
              
              <Button onClick={handleHealthCheckup} variant="outline">
                Track Health Checkup
              </Button>
              
              <Button onClick={handleMedicationReminder} variant="outline">
                Track Medication Reminder
              </Button>
            </div>
          </div>

          {/* User Journey & Business */}
          <div>
            <h3 className="font-semibold mb-3">User Journey & Business</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button onClick={handleRegistration} variant="outline">
                Track Registration
              </Button>
              
              <Button onClick={handlePayment} variant="outline">
                Track Payment
              </Button>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Veterinary Telehealth Tracking Events:</h3>
            <ul className="text-sm space-y-1">
              <li>• Button clicks with page context</li>
              <li>• Form submissions with success/error status</li>
              <li>• Donation events for nonprofit fundraising</li>
              <li>• Appointment bookings with doctor and type</li>
              <li>• Veterinary service views with pricing</li>
              <li>• Video consultation tracking</li>
              <li>• Pet profile creation and management</li>
              <li>• Medical record uploads</li>
              <li>• Symptom checker usage</li>
              <li>• User registration and onboarding</li>
              <li>• Healthcare consultation bookings</li>
              <li>• Payment processing for services</li>
              <li>• Vaccination and health records</li>
              <li>• Medication reminders and tracking</li>
              <li>• User journey and business events</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
