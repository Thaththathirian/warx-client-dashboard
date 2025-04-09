
import { useEffect } from 'react';
import { useReportStore } from '@/store/reportStore';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ReportForm } from '@/components/reports/ReportForm';
import { ReportTable } from '@/components/reports/ReportTable';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

const Reports = () => {
  const { isLoading: isAuthLoading } = useProtectedRoute();
  const { getReports, isLoading } = useReportStore();
  
  useEffect(() => {
    if (!isAuthLoading) {
      getReports();
    }
  }, [getReports, isAuthLoading]);

  const handleRefresh = () => {
    getReports();
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
            <h1 className="text-2xl font-bold tracking-tight">Reports Management</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Submit and monitor content piracy reports.
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <ReportForm />
        <ReportTable />
      </div>
    </DashboardLayout>
  );
};

export default Reports;
