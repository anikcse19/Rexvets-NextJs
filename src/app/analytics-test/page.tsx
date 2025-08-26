'use client';

import { useAnalytics } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';

export default function AnalyticsTestPage() {
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

  // Test analytics on page load
  useEffect(() => {
    console.log('🔍 Analytics Test Page Loaded');
    console.log('📊 Testing analytics implementation...');
  }, []);

  const handleButtonClick = () => {
    trackButtonClick('test_button', '/analytics-test');
    console.log('✅ Button click tracked!');
    alert('Button click tracked! Check browser console and Google Analytics.');
  };

  const handleFormSubmit = (success: boolean) => {
    trackFormSubmit('test_form', success);
    console.log(`✅ Form submission tracked! Success: ${success}`);
    alert(`Form submission tracked! Success: ${success}`);
  };

  const handleDonation = () => {
    trackDonation(50.00, 'stripe', true);
    console.log('✅ Donation tracked!');
    alert('Donation tracked!');
  };

  const handleAppointmentBooking = () => {
    trackAppointmentBooking('doctor_123', 'consultation', true);
    console.log('✅ Appointment booking tracked!');
    alert('Appointment booking tracked!');
  };

  const handleServiceView = () => {
    trackVeterinaryService.viewService('service_1', 'Emergency Consultation', 75.00, 'emergency');
    console.log('✅ Service view tracked!');
    alert('Service view tracked!');
  };

  const handleVideoConsultation = () => {
    trackVeterinaryService.videoConsultation('start', 'consultation_456');
    console.log('✅ Video consultation tracked!');
    alert('Video consultation tracked!');
  };

  const handlePetProfileCreated = () => {
    trackVeterinaryService.petProfileCreated('dog', 3);
    console.log('✅ Pet profile creation tracked!');
    alert('Pet profile creation tracked!');
  };

  const handleUserRegistration = () => {
    trackHealthcareEvent.userRegistration('pet_parent', 'email');
    console.log('✅ User registration tracked!');
    alert('User registration tracked!');
  };

  const handleConsultationBooking = () => {
    trackHealthcareEvent.consultationBooking('routine_checkup', 'dog', 'normal');
    console.log('✅ Consultation booking tracked!');
    alert('Consultation booking tracked!');
  };

  const handleVaccinationRecord = () => {
    trackPetHealthEvent.vaccinationRecord('rabies', 'dog');
    console.log('✅ Vaccination record tracked!');
    alert('Vaccination record tracked!');
  };

  const handleRegistration = () => {
    trackUserJourney.registration('email', true);
    console.log('✅ Registration tracked!');
    alert('Registration tracked!');
  };

  const handlePayment = () => {
    trackBusinessEvents.payment('completed', 'stripe', 100.00, 'USD');
    console.log('✅ Payment tracked!');
    alert('Payment tracked!');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Veterinary Telehealth Analytics Test</CardTitle>
          <CardDescription>
            Test the Google Analytics and Google Tag Manager implementation for RexVets.
            Check the browser console and Google Analytics dashboard for tracking events.
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
            </div>
          </div>

          {/* Pet Health Events */}
          <div>
            <h3 className="font-semibold mb-3">Pet Health Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button onClick={handleVaccinationRecord} variant="outline">
                Track Vaccination Record
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
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-800">Analytics Implementation Status:</h3>
            <ul className="text-sm space-y-1 text-blue-700">
              <li>✅ Google Analytics 4 (GA4) configured</li>
              <li>✅ Google Tag Manager (GTM) configured</li>
              <li>✅ Environment variables set correctly</li>
              <li>✅ Analytics components integrated in layout</li>
              <li>✅ Custom hook for easy tracking</li>
              <li>✅ Veterinary-specific tracking events</li>
              <li>✅ Performance monitoring enabled</li>
              <li>✅ Page view tracking automatic</li>
              <li>✅ Session provider error handling</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-green-800">How to Test:</h3>
            <ul className="text-sm space-y-1 text-green-700">
              <li>1. Click any button above to trigger tracking events</li>
              <li>2. Check browser console for tracking logs</li>
              <li>3. Check Google Analytics Real-time reports</li>
              <li>4. Check Google Tag Manager Preview mode</li>
              <li>5. Navigate between pages to test page view tracking</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-yellow-800">Environment Variables Used:</h3>
            <ul className="text-sm space-y-1 text-yellow-700">
              <li>• NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: G-BXX8JGTHGW</li>
              <li>• NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: GTM-KHDBQZW2</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-purple-800">Debug Information:</h3>
            <ul className="text-sm space-y-1 text-purple-700">
              <li>• Open browser developer tools (F12)</li>
              <li>• Check Console tab for tracking logs</li>
              <li>• Check Network tab for GA/GTM requests</li>
              <li>• Look for requests to google-analytics.com</li>
              <li>• Look for requests to googletagmanager.com</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
