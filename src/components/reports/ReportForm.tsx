
import { useState } from 'react';
import { useReportStore } from '@/store/reportStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Link2 } from 'lucide-react';

export function ReportForm() {
  const { addReport, isLoading } = useReportStore();
  const [link, setLink] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!link) {
      setError('Please enter a link');
      return;
    }

    // Basic URL validation
    try {
      new URL(link);
    } catch (_) {
      setError('Please enter a valid URL');
      return;
    }

    const success = await addReport(link);
    if (success) {
      setLink('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Add New Report</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Submit a link to report content for piracy monitoring.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="https://example.com/content-to-report"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className={`pl-9 ${error ? 'border-red-500' : ''}`}
            />
            <Link2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <Button type="submit" disabled={isLoading || !link}>
            {isLoading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
        
        {error && (
          <div className="flex items-center text-red-500 text-sm gap-1">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </form>
  );
}
