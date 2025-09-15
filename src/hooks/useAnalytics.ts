'use client';

import { useCallback } from 'react';
import { useSession } from 'next-auth/react';
import analytics, {
  trackEvent,
  trackUserEngagement,
  trackPerformance,
  trackVeterinaryServices,
  trackHealthcareEvents,
  trackPetHealthEvents,
  setUserId,
  setUserRole,
} from '@/lib/analytics';

export const useAnalytics = () => {
  // Make session optional to prevent errors when SessionProvider is not available
  let session: any = null;
  try {
    const sessionResult = useSession();
    session = sessionResult.data;
  } catch (error) {
    // Session provider not available, continue without session
    console.warn('Session provider not available for analytics');
  }

  // Set user properties when session changes
  const setUserProperties = useCallback(() => {
    if (session?.user) {
      const user = session.user as any;
      
      // Set user ID if available
      if (user.id) {
        setUserId(user.id);
      }
      
      // Set user role if available
      if (user.role) {
        setUserRole(user.role);
      }
    }
  }, [session]);

  // Track page views
  const trackPageView = useCallback((url: string, title?: string) => {
    analytics.trackPageView(url, title);
  }, []);

  // Track custom events
  const trackCustomEvent = useCallback((
    action: string,
    category: string,
    label?: string,
    value?: number,
    customParameters?: Record<string, any>
  ) => {
    trackEvent(action, category, label, value, customParameters);
  }, []);

  // Track button clicks
  const trackButtonClick = useCallback((buttonName: string, page?: string) => {
    trackUserEngagement.buttonClick(buttonName, page);
  }, []);

  // Track form submissions
  const trackFormSubmit = useCallback((formName: string, success: boolean = true) => {
    trackUserEngagement.formSubmit(formName, success);
  }, []);

  // Track video interactions
  const trackVideoInteraction = useCallback((
    action: 'play' | 'pause' | 'complete',
    videoName: string
  ) => {
    trackUserEngagement.videoInteraction(action, videoName);
  }, []);

  // Track donation events
  const trackDonation = useCallback((
    amount: number,
    method: string,
    success: boolean = true
  ) => {
    trackUserEngagement.donation(amount, method, success);
  }, []);

  // Track appointment booking
  const trackAppointmentBooking = useCallback((
    doctorId: string,
    appointmentType: string,
    success: boolean = true
  ) => {
    trackUserEngagement.appointmentBooking(doctorId, appointmentType, success);
  }, []);

  // Track chat interactions
  const trackChatInteraction = useCallback((
    action: 'start' | 'message' | 'end',
    chatType: string
  ) => {
    trackUserEngagement.chatInteraction(action, chatType);
  }, []);

  // Track search queries
  const trackSearch = useCallback((query: string, resultsCount: number) => {
    trackUserEngagement.search(query, resultsCount);
  }, []);

  // Track file uploads
  const trackFileUpload = useCallback((
    fileType: string,
    fileSize: number,
    success: boolean = true
  ) => {
    trackUserEngagement.fileUpload(fileType, fileSize, success);
  }, []);

  // Track performance metrics
  const trackPerformanceMetrics = useCallback((metrics: {
    cls?: number;
    lcp?: number;
    fid?: number;
    fcp?: number;
    ttfb?: number;
  }) => {
    trackPerformance.coreWebVitals(metrics);
  }, []);

  // Track page load time
  const trackPageLoadTime = useCallback((loadTime: number) => {
    trackPerformance.pageLoadTime(loadTime);
  }, []);

  // Track API response times
  const trackApiResponseTime = useCallback((
    endpoint: string,
    responseTime: number,
    success: boolean = true
  ) => {
    trackPerformance.apiResponseTime(endpoint, responseTime, success);
  }, []);

  // Track veterinary service events
  const trackVeterinaryService = {
    viewService: useCallback((
      serviceId: string,
      serviceName: string,
      price: number,
      category: string
    ) => {
      trackVeterinaryServices.viewService(serviceId, serviceName, price, category);
    }, []),

    scheduleAppointment: useCallback((
      doctorId: string,
      serviceType: string,
      price: number,
      appointmentDate: string
    ) => {
      trackVeterinaryServices.scheduleAppointment(doctorId, serviceType, price, appointmentDate);
    }, []),

    requestPrescription: useCallback((
      prescriptionType: string,
      petType: string
    ) => {
      trackVeterinaryServices.requestPrescription(prescriptionType, petType);
    }, []),

    emergencyConsultation: useCallback((
      consultationType: string,
      urgency: string
    ) => {
      trackVeterinaryServices.emergencyConsultation(consultationType, urgency);
    }, []),

    videoConsultation: useCallback((
      action: 'start' | 'join' | 'end',
      consultationId: string
    ) => {
      trackVeterinaryServices.videoConsultation(action, consultationId);
    }, []),

    petProfileCreated: useCallback((
      petType: string,
      petAge: number
    ) => {
      trackVeterinaryServices.petProfileCreated(petType, petAge);
    }, []),

    medicalRecordUpload: useCallback((
      recordType: string,
      fileSize: number
    ) => {
      trackVeterinaryServices.medicalRecordUpload(recordType, fileSize);
    }, []),

    symptomChecker: useCallback((
      symptoms: string[],
      petType: string
    ) => {
      trackVeterinaryServices.symptomChecker(symptoms, petType);
    }, []),
  };

  // Track healthcare events
  const trackHealthcareEvent = {
    userRegistration: useCallback((
      userType: 'pet_parent' | 'veterinarian',
      method: string
    ) => {
      trackHealthcareEvents.userRegistration(userType, method);
    }, []),

    profileCompletion: useCallback((
      userType: string,
      completionPercentage: number
    ) => {
      trackHealthcareEvents.profileCompletion(userType, completionPercentage);
    }, []),

    consultationBooking: useCallback((
      consultationType: string,
      petType: string,
      urgency: string
    ) => {
      trackHealthcareEvents.consultationBooking(consultationType, petType, urgency);
    }, []),

    paymentProcessing: useCallback((
      amount: number,
      method: string,
      success: boolean
    ) => {
      trackHealthcareEvents.paymentProcessing(amount, method, success);
    }, []),

    prescriptionFulfillment: useCallback((
      prescriptionType: string,
      fulfillmentMethod: string
    ) => {
      trackHealthcareEvents.prescriptionFulfillment(prescriptionType, fulfillmentMethod);
    }, []),

    followUpScheduling: useCallback((
      originalConsultationId: string,
      followUpType: string
    ) => {
      trackHealthcareEvents.followUpScheduling(originalConsultationId, followUpType);
    }, []),
  };

  // Track pet health events
  const trackPetHealthEvent = {
    vaccinationRecord: useCallback((
      vaccineType: string,
      petType: string
    ) => {
      trackPetHealthEvents.vaccinationRecord(vaccineType, petType);
    }, []),

    healthCheckup: useCallback((
      checkupType: string,
      petAge: number
    ) => {
      trackPetHealthEvents.healthCheckup(checkupType, petAge);
    }, []),

    medicationReminder: useCallback((
      medicationType: string,
      reminderFrequency: string
    ) => {
      trackPetHealthEvents.medicationReminder(medicationType, reminderFrequency);
    }, []),

    weightTracking: useCallback((
      petType: string,
      weightChange: number
    ) => {
      trackPetHealthEvents.weightTracking(petType, weightChange);
    }, []),

    behaviorTracking: useCallback((
      behaviorType: string,
      severity: string
    ) => {
      trackPetHealthEvents.behaviorTracking(behaviorType, severity);
    }, []),
  };

  // Track user journey events
  const trackUserJourney = {
    // Track user registration
    registration: useCallback((method: 'email' | 'google' | 'facebook', success: boolean = true) => {
      trackCustomEvent('registration', 'user_journey', method, undefined, {
        success,
        registration_method: method,
      });
    }, [trackCustomEvent]),

    // Track user login
    login: useCallback((method: 'email' | 'google' | 'facebook', success: boolean = true) => {
      trackCustomEvent('login', 'user_journey', method, undefined, {
        success,
        login_method: method,
      });
    }, [trackCustomEvent]),

    // Track profile completion
    profileCompletion: useCallback((completionPercentage: number) => {
      trackCustomEvent('profile_completion', 'user_journey', 'profile', completionPercentage, {
        completion_percentage: completionPercentage,
      });
    }, [trackCustomEvent]),

    // Track onboarding steps
    onboardingStep: useCallback((step: string, stepNumber: number, completed: boolean = true) => {
      trackCustomEvent('onboarding_step', 'user_journey', step, stepNumber, {
        completed,
        step_number: stepNumber,
      });
    }, [trackCustomEvent]),
  };

  // Track business events
  const trackBusinessEvents = {
    // Track subscription events
    subscription: useCallback((
      action: 'start' | 'cancel' | 'upgrade' | 'downgrade',
      plan: string,
      amount?: number
    ) => {
      trackCustomEvent(`subscription_${action}`, 'business', plan, amount, {
        subscription_plan: plan,
        subscription_action: action,
      });
    }, [trackCustomEvent]),

    // Track payment events
    payment: useCallback((
      action: 'initiated' | 'completed' | 'failed',
      method: string,
      amount: number,
      currency: string = 'USD'
    ) => {
      trackCustomEvent(`payment_${action}`, 'business', method, amount, {
        payment_method: method,
        currency,
      });
    }, [trackCustomEvent]),

    // Track referral events
    referral: useCallback((
      action: 'sent' | 'received' | 'converted',
      referralCode: string,
      value?: number
    ) => {
      trackCustomEvent(`referral_${action}`, 'business', referralCode, value, {
        referral_code: referralCode,
      });
    }, [trackCustomEvent]),
  };

  return {
    // Core tracking functions
    trackPageView,
    trackCustomEvent,
    setUserProperties,
    
    // User engagement tracking
    trackButtonClick,
    trackFormSubmit,
    trackVideoInteraction,
    trackDonation,
    trackAppointmentBooking,
    trackChatInteraction,
    trackSearch,
    trackFileUpload,
    
    // Performance tracking
    trackPerformanceMetrics,
    trackPageLoadTime,
    trackApiResponseTime,
    
    // Veterinary service tracking
    trackVeterinaryService,
    
    // Healthcare event tracking
    trackHealthcareEvent,
    
    // Pet health tracking
    trackPetHealthEvent,
    
    // User journey tracking
    trackUserJourney,
    
    // Business event tracking
    trackBusinessEvents,
  };
};
