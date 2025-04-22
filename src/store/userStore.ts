
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';
import { toast } from 'sonner';

interface Employee {
  id: number;
  name: string;
  email: string;
  profile: string;
  phone: string;
  company_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  company_name: string;
}

interface UsersState {
  employees: Employee[];
  currentEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
  totalEmployees: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  searchQuery: string;
  getEmployees: (page?: number, limit?: number, search?: string) => Promise<void>;
  getEmployee: (id: number) => Promise<void>;
  addEmployee: (employee: {
    name: string;
    email: string;
    password: string;
    profile?: string;
    phone?: string;
  }) => Promise<void>;
  updateEmployee: (
    id: number,
    employee: {
      name: string;
      email: string;
      phone?: string;
      profile?: string;
      status?: string;
    }
  ) => Promise<void>;
  deactivateEmployee: (id: number) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setLimit: (limit: number) => void;
  setCurrentPage: (page: number) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useUsersStore = create<UsersState>()(
  devtools((set, get) => ({
    employees: [],
    currentEmployee: null,
    isLoading: false,
    error: null,
    totalEmployees: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    searchQuery: '',

    setSearchQuery: (query: string) => {
      set({ searchQuery: query });
      get().getEmployees(1, get().limit, query);
    },

    setLimit: (limit: number) => {
      set({ limit });
      get().getEmployees(1, limit, get().searchQuery);
    },

    setCurrentPage: (page: number) => {
      set({ currentPage: page });
      get().getEmployees(page, get().limit, get().searchQuery);
    },

    getEmployees: async (page = 1, limit = 10, search = '') => {
      set({ isLoading: true, error: null });
      try {
        // Construct the URL with query parameters
        let url = `${API_BASE_URL}/company/get_employees?page=${page}&limit=${limit}`;
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }

        const response = await axios.get(url, {
          withCredentials: true
        });
        
        if (response.status === 200) {
          set({
            employees: response.data.employees,
            totalEmployees: response.data.total,
            currentPage: response.data.page,
            totalPages: response.data.total_pages,
            limit: response.data.limit,
            isLoading: false
          });
        } else {
          set({ isLoading: false, error: 'Failed to fetch employees' });
        }
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || 'Failed to fetch employees'
        });
        toast.error(error.response?.data?.message || 'Failed to fetch employees');
      }
    },

    getEmployee: async (id: number) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_BASE_URL}/company/get_employee/${id}`, {
          withCredentials: true
        });
        
        if (response.status === 200) {
          set({ currentEmployee: response.data.employee, isLoading: false });
        } else {
          set({ isLoading: false, error: 'Failed to fetch employee details' });
        }
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || 'Failed to fetch employee details'
        });
        toast.error(error.response?.data?.message || 'Failed to fetch employee details');
      }
    },

    addEmployee: async (employee) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(
          `${API_BASE_URL}/company/add_employee`,
          employee,
          { withCredentials: true }
        );
        
        if (response.status === 200) {
          toast.success('Employee added successfully');
          await get().getEmployees(); // Refresh the list
          set({ isLoading: false });
        } else {
          set({ isLoading: false, error: 'Failed to add employee' });
        }
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || 'Failed to add employee'
        });
        toast.error(error.response?.data?.message || 'Failed to add employee');
      }
    },

    updateEmployee: async (id, employee) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(
          `${API_BASE_URL}/company/edit_employee/${id}`,
          employee,
          { withCredentials: true }
        );
        
        if (response.status === 200) {
          toast.success('Employee updated successfully');
          await get().getEmployees(); // Refresh the list
          set({ isLoading: false });
        } else {
          set({ isLoading: false, error: 'Failed to update employee' });
        }
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || 'Failed to update employee'
        });
        toast.error(error.response?.data?.message || 'Failed to update employee');
      }
    },

    deactivateEmployee: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(
          `${API_BASE_URL}/company/deactivate_employee/${id}`,
          {},
          { withCredentials: true }
        );
        
        if (response.status === 200) {
          toast.success('Employee deactivated successfully');
          await get().getEmployees(); // Refresh the list
          set({ isLoading: false });
        } else {
          set({ isLoading: false, error: 'Failed to deactivate employee' });
        }
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || 'Failed to deactivate employee'
        });
        toast.error(error.response?.data?.message || 'Failed to deactivate employee');
      }
    },
  }))
);
