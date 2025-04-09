
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';
import { toast } from 'sonner';

export interface Asset {
  id: number;
  name: string;
  description: string;
  image: string;
  torrent_id: number | null;
  start_date: string;
  end_date: string;
  status: string;
  project_id: number;
  created_at: string;
  updated_at: string;
}

interface AssetResponse {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  assets: Asset[];
}

interface AssetState {
  assets: Asset[];
  selectedAsset: Asset | null;
  isLoading: boolean;
  error: string | null;
  totalAssets: number;
  currentPage: number;
  totalPages: number;
  getAssets: (page?: number, limit?: number) => Promise<void>;
  selectAsset: (asset: Asset) => void;
}

const API_BASE_URL = 'https://antipiracy.whyxpose.com/api';

export const useAssetStore = create<AssetState>()(
  devtools((set, get) => ({
    assets: [],
    selectedAsset: null,
    isLoading: false,
    error: null,
    totalAssets: 0,
    currentPage: 1,
    totalPages: 1,

    getAssets: async (page = 1, limit = 10) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_BASE_URL}/company/get_assets`, {
          params: { page, limit },
          withCredentials: true
        });
        
        if (response.status === 200) {
          const data: AssetResponse = response.data;
          set({
            assets: data.assets,
            totalAssets: data.total,
            currentPage: data.page,
            totalPages: data.total_pages,
            isLoading: false
          });
        } else {
          set({ isLoading: false, error: 'Failed to fetch assets' });
        }
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || 'Failed to fetch assets'
        });
        toast.error(error.response?.data?.message || 'Failed to fetch assets');
      }
    },

    selectAsset: (asset: Asset) => {
      set({ selectedAsset: asset });
    }
  }))
);
