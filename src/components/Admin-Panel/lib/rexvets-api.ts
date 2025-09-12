// RexVets API Service for Admin Monitoring
// Handles communication with RexVets monitoring endpoints

export interface RexVetsAppointment {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentTimeUTC?: string;
  doctorName: string;
  doctorEmail: string;
  doctorId: string;
  doctorType: string;
  parentName: string;
  parentEmail: string;
  parentId: string;
  petName: string;
  petId: string;
  petConcerns?: string[];
  meetingLink: string;
  roomId?: string;
  status: string;
  state?: string;
  timezone?: string;
  createdAt?: any;
  AccessCode?: string;
}

export interface ActiveCall {
  appointmentId: string;
  roomId: string;
  parentName: string;
  doctorName: string;
  startTime: string;
  duration: string;
  status: "active" | "connecting" | "ended";
  monitorLink: string;
  accessCode: string;
}

export interface AdminTokenResponse {
  success: boolean;
  token?: string;
  expiresAt?: string;
  error?: string;
}

export interface AppointmentsResponse {
  success: boolean;
  data?: {
    appointments: RexVetsAppointment[];
    total: number;
    hasMore: boolean;
  };
  meta?: {
    timestamp: string;
    status: string;
    limit: number;
  };
  error?: string;
}

export interface ActiveCallsResponse {
  success: boolean;
  data?: ActiveCall[];
  error?: string;
}

class RexVetsApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.REXVETS_API_BASE_URL || "https://www.rexvets.com/api";
  }

  // Generate admin token using local API route
  async generateAdminToken(): Promise<AdminTokenResponse> {
    try {
      const response = await fetch("/api/rexvets/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "generate" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error generating admin token:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Validate admin token using local API route
  async validateAdminToken(token: string): Promise<AdminTokenResponse> {
    try {
      const response = await fetch("/api/rexvets/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "validate", token: token }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error validating admin token:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get appointments with monitoring links
  async getAppointmentsWithMonitoring(
    status: string = "Upcoming",
    limit: number = 50,
    doctorId?: string,
    date?: string
  ): Promise<AppointmentsResponse> {
    try {
      const token = localStorage.getItem("rexvets_admin_token");
      if (!token) {
        throw new Error("No admin token available");
      }

      const params = new URLSearchParams({
        status,
        limit: limit.toString(),
      });

      if (doctorId) {
        params.append("doctorId", doctorId);
      }

      if (date) {
        params.append("date", date);
      }

      const response = await fetch(`${this.baseUrl}/appointments?${params}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Token expired or invalid, try to regenerate
          const newToken = await this.generateAdminToken();
          if (newToken.success && newToken.token) {
            // Retry with new token
            const retryResponse = await fetch(
              `${this.baseUrl}/appointments?${params}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${newToken.token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!retryResponse.ok) {
              throw new Error(`HTTP error! status: ${retryResponse.status}`);
            }

            return await retryResponse.json();
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get active video calls
  async getActiveVideoCalls(): Promise<ActiveCallsResponse> {
    try {
      const token = localStorage.getItem("rexvets_admin_token");
      if (!token) {
        throw new Error("No admin token available");
      }

      const response = await fetch(
        `${this.baseUrl}/appointments/active-calls`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Token expired or invalid, try to regenerate
          const newToken = await this.generateAdminToken();
          if (newToken.success && newToken.token) {
            // Retry with new token
            const retryResponse = await fetch(
              `${this.baseUrl}/appointments/active-calls`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${newToken.token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!retryResponse.ok) {
              throw new Error(`HTTP error! status: ${retryResponse.status}`);
            }

            return await retryResponse.json();
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching active calls:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get monitoring statistics
  async getMonitoringStats(): Promise<any> {
    try {
      const token = localStorage.getItem("rexvets_admin_token");
      if (!token) {
        throw new Error("No admin token available");
      }

      const response = await fetch(`${this.baseUrl}/appointments/stats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching monitoring stats:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Revoke admin token
  async revokeAdminToken(token: string): Promise<AdminTokenResponse> {
    try {
      const response = await fetch("/api/rexvets/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "revoke", token: token }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error revoking admin token:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// Export singleton instance
const rexVetsApi = new RexVetsApiService();
export default rexVetsApi;
