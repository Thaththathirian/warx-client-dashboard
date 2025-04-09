
import { useReportStore } from '@/store/reportStore';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link2, ExternalLink } from 'lucide-react';

export function ReportTable() {
  const { reports, isLoading } = useReportStore();

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Pending</Badge>;
      case 1:
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Processed</Badge>;
      case 2:
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!reports.length) {
    return (
      <div className="text-center py-10 border rounded-md bg-white dark:bg-gray-800">
        <Link2 className="w-10 h-10 mx-auto text-gray-400" />
        <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">No reports found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Start by adding a new report using the form above.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white dark:bg-gray-800">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1 max-w-xs overflow-hidden">
                  <a 
                    href={report.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline truncate flex items-center gap-1"
                  >
                    {report.link}
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(report.status)}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(report.updated_at), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
