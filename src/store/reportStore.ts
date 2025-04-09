
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';
import { toast } from 'sonner';

export enum ReportStatus {
  DETECTED = 'detected',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved'
}

interface ExternalReport {
  id: number;
  reporter_id: number;
  link: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ReportState {
  reports: ExternalReport[];
  isLoading: boolean;
  error: string | null;
  getReports: () => Promise<void>;
  addReport: (link: string) => Promise<boolean>;
}

const API_BASE_URL = 'https://antipiracy.whyxpose.com/api';

export const useReportStore = create<ReportState>()(
  devtools((set, get) => ({
    reports: [],
    isLoading: false,
    error: null,

    getReports: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_BASE_URL}/company/get_external_report`, {
          withCredentials: true
        });
        
        if (response.status === 200) {
          set({
            reports: response.data.external_reports,
            isLoading: false
          });
        } else {
          set({ isLoading: false, error: 'Failed to fetch reports' });
        }
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || 'Failed to fetch reports'
        });
        toast.error(error.response?.data?.message || 'Failed to fetch reports');
      }
    },

    addReport: async (link: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(
          `${API_BASE_URL}/company/add_piray_link`,
          { link },
          { withCredentials: true }
        );
        
        if (response.status === 200) {
          toast.success('Report added successfully');
          await get().getReports();
          set({ isLoading: false });
          return true;
        } else {
          set({ isLoading: false, error: 'Failed to add report' });
          return false;
        }
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || 'Failed to add report'
        });
        toast.error(error.response?.data?.message || 'Failed to add report');
        return false;
      }
    },
  }))
);
