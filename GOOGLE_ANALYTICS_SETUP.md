# Google Analytics Setup Guide for RexVets Veterinary Telehealth Platform

This guide explains how to set up Google Analytics and Google Tag Manager in the RexVets Next.js veterinary telehealth platform.

## 🚀 Quick Setup

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Google Analytics Configuration
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-BXX8JGTHGW
NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-KHDBQZW2
```

### 2. Get Your Analytics IDs

#### Google Analytics 4 (GA4)
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property or use existing one
3. Copy the Measurement ID (format: G-XXXXXXXXXX)
4. Set it as `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`

#### Google Tag Manager (GTM)
1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new account or use existing one
3. Copy the Container ID (format: GTM-XXXXXXX)
4. Set it as `NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID`

## 📊 Features Implemented

### Core Analytics
- ✅ Google Analytics 4 (GA4) integration
- ✅ Google Tag Manager (GTM) integration
- ✅ Automatic page view tracking
- ✅ Performance monitoring (Core Web Vitals)
- ✅ User engagement tracking

### Veterinary Service Tracking
- ✅ Service views with pricing
- ✅ Appointment scheduling
- ✅ Video consultation tracking
- ✅ Prescription requests
- ✅ Emergency consultations
- ✅ Pet profile creation
- ✅ Medical record uploads
- ✅ Symptom checker usage

### Healthcare Event Tracking
- ✅ User registration (pet parents & veterinarians)
- ✅ Profile completion tracking
- ✅ Consultation bookings
- ✅ Payment processing
- ✅ Prescription fulfillment
- ✅ Follow-up scheduling

### Pet Health Tracking
- ✅ Vaccination records
- ✅ Health checkups
- ✅ Medication reminders
- ✅ Weight tracking
- ✅ Behavior tracking

### User Engagement Tracking
- ✅ Button clicks with page context
- ✅ Form submissions with success/error status
- ✅ Video interactions (play, pause, complete)
- ✅ Donation events for nonprofit fundraising
- ✅ Chat interactions (start, message, end)
- ✅ Search queries with results count
- ✅ File uploads with type and size

### Performance Monitoring
- ✅ Core Web Vitals (CLS, LCP, FID, FCP, TTFB)
- ✅ Page load times
- ✅ API response times
- ✅ Resource loading performance

## 🛠️ Usage Examples

### Basic Usage

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function MyComponent() {
  const { trackButtonClick, trackFormSubmit } = useAnalytics();

  const handleClick = () => {
    trackButtonClick('cta_button', '/homepage');
    // Your button logic
  };

  const handleFormSubmit = (success: boolean) => {
    trackFormSubmit('contact_form', success);
    // Your form logic
  };

  return (
    <button onClick={handleClick}>
      Click Me
    </button>
  );
}
```

### Veterinary Service Tracking

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function AppointmentBooking() {
  const { trackVeterinaryService } = useAnalytics();

  const handleAppointmentBooking = () => {
    trackVeterinaryService.scheduleAppointment(
      'doctor_123',
      'consultation',
      50.00,
      '2024-01-15'
    );
  };

  const handleVideoConsultation = () => {
    trackVeterinaryService.videoConsultation('start', 'consultation_456');
  };

  const handlePetProfileCreated = () => {
    trackVeterinaryService.petProfileCreated('dog', 3);
  };

  return (
    <div>
      <button onClick={handleAppointmentBooking}>Book Appointment</button>
      <button onClick={handleVideoConsultation}>Start Video Call</button>
      <button onClick={handlePetProfileCreated}>Create Pet Profile</button>
    </div>
  );
}
```

### Healthcare Event Tracking

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function HealthcareComponent() {
  const { trackHealthcareEvent } = useAnalytics();

  const handleUserRegistration = () => {
    trackHealthcareEvent.userRegistration('pet_parent', 'email');
  };

  const handleConsultationBooking = () => {
    trackHealthcareEvent.consultationBooking('routine_checkup', 'dog', 'normal');
  };

  const handlePaymentProcessing = () => {
    trackHealthcareEvent.paymentProcessing(100.00, 'stripe', true);
  };

  return (
    <div>
      <button onClick={handleUserRegistration}>Register</button>
      <button onClick={handleConsultationBooking}>Book Consultation</button>
      <button onClick={handlePaymentProcessing}>Process Payment</button>
    </div>
  );
}
```

### Pet Health Tracking

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function PetHealthComponent() {
  const { trackPetHealthEvent } = useAnalytics();

  const handleVaccinationRecord = () => {
    trackPetHealthEvent.vaccinationRecord('rabies', 'dog');
  };

  const handleHealthCheckup = () => {
    trackPetHealthEvent.healthCheckup('annual', 5);
  };

  const handleMedicationReminder = () => {
    trackPetHealthEvent.medicationReminder('heartworm_prevention', 'monthly');
  };

  return (
    <div>
      <button onClick={handleVaccinationRecord}>Record Vaccination</button>
      <button onClick={handleHealthCheckup}>Schedule Checkup</button>
      <button onClick={handleMedicationReminder}>Set Reminder</button>
    </div>
  );
}
```

### Performance Tracking

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function PerformanceMonitor() {
  const { trackPerformanceMetrics } = useAnalytics();

  useEffect(() => {
    // Track Core Web Vitals
    trackPerformanceMetrics({
      cls: 0.1,
      lcp: 2500,
      fid: 100,
      fcp: 1200,
      ttfb: 800,
    });
  }, []);

  return <div>Performance monitoring active</div>;
}
```

### User Journey Tracking

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function RegistrationForm() {
  const { trackUserJourney } = useAnalytics();

  const handleRegistration = async () => {
    try {
      // Registration logic
      trackUserJourney.registration('email', true);
    } catch (error) {
      trackUserJourney.registration('email', false);
    }
  };

  return (
    <form onSubmit={handleRegistration}>
      {/* Form fields */}
    </form>
  );
}
```

## 🔧 Advanced Configuration

### Custom Event Tracking

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function CustomTracking() {
  const { trackCustomEvent } = useAnalytics();

  const trackCustomAction = () => {
    trackCustomEvent(
      'custom_action',           // action
      'custom_category',         // category
      'custom_label',           // label
      100,                      // value
      {                         // custom parameters
        custom_param: 'value',
        timestamp: Date.now(),
      }
    );
  };

  return <button onClick={trackCustomAction}>Custom Action</button>;
}
```

### Veterinary Service Tracking

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function VeterinaryServicePage() {
  const { trackVeterinaryService } = useAnalytics();

  const handleEmergencyConsultation = () => {
    trackVeterinaryService.emergencyConsultation('urgent_care', 'high');
  };

  const handleSymptomChecker = () => {
    trackVeterinaryService.symptomChecker(['coughing', 'lethargy'], 'cat');
  };

  const handleMedicalRecordUpload = () => {
    trackVeterinaryService.medicalRecordUpload('vaccination_record', 1024);
  };

  return (
    <div>
      <button onClick={handleEmergencyConsultation}>Emergency Care</button>
      <button onClick={handleSymptomChecker}>Check Symptoms</button>
      <button onClick={handleMedicalRecordUpload}>Upload Records</button>
    </div>
  );
}
```

## 📈 Analytics Dashboard Setup

### Google Analytics 4 Dashboard

1. **Real-time Reports**: Monitor live user activity
2. **Engagement Reports**: Track user engagement metrics
3. **Healthcare Reports**: Monitor veterinary service conversions
4. **Performance Reports**: Track Core Web Vitals

### Google Tag Manager Setup

1. **Triggers**: Set up triggers for custom events
2. **Tags**: Configure tags for different tracking needs
3. **Variables**: Define custom variables for dynamic tracking
4. **Preview Mode**: Test your tracking implementation

## 🔍 Debugging

### Development Mode
- Analytics only loads in production or when IDs are provided
- Console logs show tracking events in development
- Use browser dev tools to verify tracking

### Verification
1. Check browser network tab for GA/GTM requests
2. Use Google Analytics Real-time reports
3. Use Google Tag Manager Preview mode
4. Check browser console for tracking logs

## 📋 Best Practices

1. **Privacy Compliance**: Ensure HIPAA and GDPR compliance for healthcare data
2. **Performance**: Analytics loads asynchronously
3. **Error Handling**: Graceful fallbacks for missing IDs
4. **Testing**: Test all tracking events thoroughly
5. **Documentation**: Document custom events and parameters
6. **Healthcare Specific**: Ensure tracking doesn't violate patient privacy

## 🚨 Important Notes

- Analytics only loads in production or when environment variables are set
- User data is anonymized and compliant with healthcare privacy regulations
- Performance monitoring is automatic and non-intrusive
- All tracking is opt-out compliant
- Healthcare-specific tracking respects patient privacy laws

## 📞 Support

For issues or questions about the analytics implementation:
1. Check the console for error messages
2. Verify environment variables are set correctly
3. Test in production environment
4. Review Google Analytics documentation

---

**Note**: Replace the placeholder IDs (`G-BXX8JGTHGW` and `GTM-KHDBQZW2`) with your actual Google Analytics and Google Tag Manager IDs.
