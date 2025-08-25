// Google Analytics and Google Tag Manager utilities for Veterinary Telehealth Platform
import clientConfig from '@/config/client.config';

// Declare global gtag function
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Google Analytics Measurement ID
export const GA_MEASUREMENT_ID = clientConfig.GOOGLE_ANALYTICS_ID;
export const GTM_ID = clientConfig.GOOGLE_TAG_MANAGER_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];

  // Define gtag function
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer.push(args);
  };

  // Set initial timestamp
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title || document.title,
  });
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  customParameters?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...customParameters,
  });
};

// Track user engagement events
export const trackUserEngagement = {
  // Track button clicks
  buttonClick: (buttonName: string, page?: string) => {
    trackEvent('click', 'engagement', buttonName, undefined, {
      page: page || window.location.pathname,
    });
  },

  // Track form submissions
  formSubmit: (formName: string, success: boolean = true) => {
    trackEvent('submit', 'form', formName, undefined, {
      success: success,
      page: window.location.pathname,
    });
  },

  // Track video interactions
  videoInteraction: (action: 'play' | 'pause' | 'complete', videoName: string) => {
    trackEvent(action, 'video', videoName);
  },

  // Track donation events
  donation: (amount: number, method: string, success: boolean = true) => {
    trackEvent('donation', 'fundraising', method, amount, {
      success: success,
      currency: 'USD',
    });
  },

  // Track appointment booking
  appointmentBooking: (doctorId: string, appointmentType: string, success: boolean = true) => {
    trackEvent('appointment_booking', 'appointment', appointmentType, undefined, {
      doctor_id: doctorId,
      success: success,
    });
  },

  // Track chat interactions
  chatInteraction: (action: 'start' | 'message' | 'end', chatType: string) => {
    trackEvent(action, 'chat', chatType);
  },

  // Track search queries
  search: (query: string, resultsCount: number) => {
    trackEvent('search', 'search', query, resultsCount);
  },

  // Track file uploads
  fileUpload: (fileType: string, fileSize: number, success: boolean = true) => {
    trackEvent('file_upload', 'file', fileType, fileSize, {
      success: success,
    });
  },
};

// Track performance metrics
export const trackPerformance = {
  // Track Core Web Vitals
  coreWebVitals: (metrics: {
    cls?: number;
    lcp?: number;
    fid?: number;
    fcp?: number;
    ttfb?: number;
  }) => {
    if (typeof window === 'undefined' || !window.gtag) return;

    Object.entries(metrics).forEach(([metric, value]) => {
      if (value !== undefined) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: metric.toUpperCase(),
          value: Math.round(metric === 'cls' ? value * 1000 : value),
          custom_parameters: {
            [metric]: value,
          },
        });
      }
    });
  },

  // Track page load time
  pageLoadTime: (loadTime: number) => {
    trackEvent('page_load', 'performance', 'load_time', Math.round(loadTime));
  },

  // Track API response times
  apiResponseTime: (endpoint: string, responseTime: number, success: boolean = true) => {
    trackEvent('api_response', 'performance', endpoint, Math.round(responseTime), {
      success: success,
    });
  },
};

// Track veterinary service events
export const trackVeterinaryServices = {
  // Track service views
  viewService: (serviceId: string, serviceName: string, price: number, category: string) => {
    trackEvent('view_service', 'veterinary_service', serviceName, price, {
      service_id: serviceId,
      service_category: category,
    });
  },

  // Track appointment scheduling
  scheduleAppointment: (doctorId: string, serviceType: string, price: number, appointmentDate: string) => {
    trackEvent('schedule_appointment', 'veterinary_service', serviceType, price, {
      doctor_id: doctorId,
      appointment_date: appointmentDate,
      service_type: serviceType,
    });
  },

  // Track prescription requests
  requestPrescription: (prescriptionType: string, petType: string) => {
    trackEvent('prescription_request', 'veterinary_service', prescriptionType, undefined, {
      pet_type: petType,
    });
  },

  // Track emergency consultations
  emergencyConsultation: (consultationType: string, urgency: string) => {
    trackEvent('emergency_consultation', 'veterinary_service', consultationType, undefined, {
      urgency: urgency,
    });
  },

  // Track video consultations
  videoConsultation: (action: 'start' | 'join' | 'end', consultationId: string) => {
    trackEvent(`video_consultation_${action}`, 'veterinary_service', consultationId);
  },

  // Track pet profile creation
  petProfileCreated: (petType: string, petAge: number) => {
    trackEvent('pet_profile_created', 'veterinary_service', petType, petAge);
  },

  // Track medical record uploads
  medicalRecordUpload: (recordType: string, fileSize: number) => {
    trackEvent('medical_record_upload', 'veterinary_service', recordType, fileSize);
  },

  // Track symptom checker usage
  symptomChecker: (symptoms: string[], petType: string) => {
    trackEvent('symptom_checker', 'veterinary_service', petType, symptoms.length, {
      symptoms: symptoms.join(','),
    });
  },
};

// Track user properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    custom_map: properties,
  });
};

// Track user ID (when user is authenticated)
export const setUserId = (userId: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    user_id: userId,
  });
};

// Track user role
export const setUserRole = (role: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    custom_map: {
      user_role: role,
    },
  });
};

// Initialize Google Tag Manager
export const initGTM = () => {
  if (typeof window === 'undefined' || !GTM_ID) return;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];

  // Create GTM script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  script.onerror = () => {
    console.warn('GTM failed to load - this is normal in development');
  };

  // Insert script
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode?.insertBefore(script, firstScript);

  // Push initial dataLayer event
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });
};

// Push custom dataLayer events
export const pushDataLayer = (data: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.dataLayer) return;

  window.dataLayer.push(data);
};

// Track conversion events
export const trackConversion = (conversionId: string, conversionLabel: string, value?: number) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'conversion', {
    send_to: `${GA_MEASUREMENT_ID}/${conversionId}/${conversionLabel}`,
    value: value,
  });
};

// Track healthcare-specific events
export const trackHealthcareEvents = {
  // Track user registration
  userRegistration: (userType: 'pet_parent' | 'veterinarian', method: string) => {
    trackEvent('user_registration', 'healthcare', userType, undefined, {
      registration_method: method,
    });
  },

  // Track profile completion
  profileCompletion: (userType: string, completionPercentage: number) => {
    trackEvent('profile_completion', 'healthcare', userType, completionPercentage);
  },

  // Track consultation booking
  consultationBooking: (consultationType: string, petType: string, urgency: string) => {
    trackEvent('consultation_booking', 'healthcare', consultationType, undefined, {
      pet_type: petType,
      urgency: urgency,
    });
  },

  // Track payment processing
  paymentProcessing: (amount: number, method: string, success: boolean) => {
    trackEvent('payment_processing', 'healthcare', method, amount, {
      success: success,
    });
  },

  // Track prescription fulfillment
  prescriptionFulfillment: (prescriptionType: string, fulfillmentMethod: string) => {
    trackEvent('prescription_fulfillment', 'healthcare', prescriptionType, undefined, {
      fulfillment_method: fulfillmentMethod,
    });
  },

  // Track follow-up scheduling
  followUpScheduling: (originalConsultationId: string, followUpType: string) => {
    trackEvent('follow_up_scheduling', 'healthcare', followUpType, undefined, {
      original_consultation_id: originalConsultationId,
    });
  },
};

// Track pet health events
export const trackPetHealthEvents = {
  // Track vaccination records
  vaccinationRecord: (vaccineType: string, petType: string) => {
    trackEvent('vaccination_record', 'pet_health', vaccineType, undefined, {
      pet_type: petType,
    });
  },

  // Track health checkups
  healthCheckup: (checkupType: string, petAge: number) => {
    trackEvent('health_checkup', 'pet_health', checkupType, petAge);
  },

  // Track medication reminders
  medicationReminder: (medicationType: string, reminderFrequency: string) => {
    trackEvent('medication_reminder', 'pet_health', medicationType, undefined, {
      reminder_frequency: reminderFrequency,
    });
  },

  // Track weight tracking
  weightTracking: (petType: string, weightChange: number) => {
    trackEvent('weight_tracking', 'pet_health', petType, weightChange);
  },

  // Track behavior tracking
  behaviorTracking: (behaviorType: string, severity: string) => {
    trackEvent('behavior_tracking', 'pet_health', behaviorType, undefined, {
      severity: severity,
    });
  },
};

// Export default analytics object
const analytics = {
  initGA,
  initGTM,
  trackPageView,
  trackEvent,
  trackUserEngagement,
  trackPerformance,
  trackVeterinaryServices,
  trackHealthcareEvents,
  trackPetHealthEvents,
  setUserProperties,
  setUserId,
  setUserRole,
  pushDataLayer,
  trackConversion,
};

export default analytics;
