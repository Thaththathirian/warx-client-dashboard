
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

interface DailyStats {
  day: string;
  count: {
    detected: number;
    enforced: number;
    removed: number;
  };
}

interface WeeklyStats {
  week: string;
  count: {
    detected: number;
    enforced: number;
    removed: number;
  };
}

interface MonthlyStats {
  month: string;
  count: {
    detected: number;
    enforced: number;
    removed: number;
  };
}

interface CountItem {
  name: string;
  icon: string;
  color_code: string;
  link_count: number;
}

interface TorrentActivity {
  date: string;
  unique_ips: number;
}

interface CountryStats {
  country: string;
  country_code: string;
  leechers: number;
  seeders: number;
  total: number;
}

interface IspStats {
  count: number;
  isp: string;
}

interface GeoLocation {
  latitude: number;
  longitude: number;
}

interface Peer {
  city: string;
  client: string;
  country: string;
  country_code: string;
  geo: GeoLocation;
  ip: string;
  isp: string;
  last_seen: string;
  leecher: boolean;
  port: number;
  seeder: boolean;
}

export interface AssetDetail {
  statistics: {
    daily_stats: DailyStats[];
    weekly_stats: WeeklyStats[];
    monthly_stats: MonthlyStats[];
    today: { detected: number; enforced: number; removed: number };
    yesterday: { detected: number; enforced: number; removed: number };
    this_week: { detected: number; enforced: number; removed: number };
    last_week: { detected: number; enforced: number; removed: number };
    start_date: string;
    end_date: string;
  };
  count: {
    detected: CountItem[];
    enforced: CountItem[];
    removed: CountItem[];
    totals: {
      detected: number;
      enforced: number;
      removed: number;
    };
    grand_total: number;
  };
  asset: Asset;
  torrent?: {
    activity: TorrentActivity[];
    client_stats: { client: string; count: number }[];
    country_stats: CountryStats[];
    isp_stats: IspStats[];
    latest_peers: Peer[];
    project: {
      created_at: string;
      description: string;
      id: number;
      image_url: string;
      name: string;
    };
    stats: {
      leecher_count: number;
      peer_count: number;
      seeder_count: number;
      torrent_count: number;
      unique_ip_count: number;
    };
    success?: boolean;
  };
}

interface AssetState {
  assets: Asset[];
  selectedAsset: Asset | null;
  assetDetail: AssetDetail | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: string | null;
  totalAssets: number;
  currentPage: number;
  totalPages: number;
  getAssets: (page?: number, limit?: number) => Promise<void>;
  selectAsset: (asset: Asset | null) => void;
  getAssetDetail: (id: number) => Promise<void>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAssetStore = create<AssetState>()(
  devtools((set, get) => ({
    assets: [],
    selectedAsset: null,
    assetDetail: null,
    isLoading: false,
    isLoadingDetail: false,
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

    selectAsset: (asset: Asset | null) => {
      set({ selectedAsset: asset });
      if (asset) {
        get().getAssetDetail(asset.id);
      } else {
        set({ assetDetail: null });
      }
    },

    getAssetDetail: async (id: number) => {
      set({ isLoadingDetail: true, error: null });
      try {
        const response = await axios.get(`${API_BASE_URL}/company/get_asset/${id}`, {
          withCredentials: true
        });
        
        if (response.status === 200) {
          const detailData = response.data;
          
          // Handle case where torrent data might be missing
          if (!detailData.torrent) {
            console.log("No torrent data available for this asset");
          }
          
          set({
            assetDetail: detailData,
            isLoadingDetail: false
          });
        } else {
          set({ isLoadingDetail: false, error: 'Failed to fetch asset details' });
        }
      } catch (error: any) {
        set({
          isLoadingDetail: false,
          error: error.response?.data?.message || 'Failed to fetch asset details'
        });
        toast.error(error.response?.data?.message || 'Failed to fetch asset details');
      }
    }
  }))
);
