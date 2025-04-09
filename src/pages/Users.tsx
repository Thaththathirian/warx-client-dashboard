
import { useState, useEffect } from 'react';
import { useUsersStore } from '@/store/userStore';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { UserTable } from '@/components/users/UserTable';
import { UserDialog } from '@/components/users/UserDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

const Users = () => {
  const { isLoading: isAuthLoading } = useProtectedRoute();
  const { getEmployees, isLoading } = useUsersStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!isAuthLoading) {
      getEmployees();
    }
  }, [getEmployees, isAuthLoading]);

  const handleRefresh = () => {
    getEmployees();
  };

  if (isAuthLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Users Management</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Add, edit, and manage user accounts for your organization.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        <UserTable />
        
        <UserDialog 
          open={isAddDialogOpen} 
          onOpenChange={setIsAddDialogOpen} 
          mode="add" 
        />
      </div>
    </DashboardLayout>
  );
};

export default Users;
