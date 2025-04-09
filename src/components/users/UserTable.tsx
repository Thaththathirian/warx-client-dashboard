
import { useState } from 'react';
import { useUsersStore } from '@/store/userStore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Pencil, 
  User, 
  XCircle, 
  Search,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';
import { UserDialog } from './UserDialog';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

export function UserTable() {
  const { 
    employees, 
    isLoading, 
    deactivateEmployee, 
    updateEmployee,
    totalPages, 
    currentPage, 
    setCurrentPage,
    setSearchQuery,
    setLimit,
    limit,
    totalEmployees
  } = useUsersStore();
  const [editingUser, setEditingUser] = useState<Employee | null>(null);
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditClick = (user: Employee) => {
    setEditingUser(user);
    setIsOpenEditDialog(true);
  };

  const handleDeactivate = async (id: number) => {
    setIsDeletingId(id);
    try {
      await deactivateEmployee(id);
      toast.success('User has been deactivated successfully');
    } catch (error) {
      toast.error('Failed to deactivate user');
    } finally {
      setIsDeletingId(null);
    }
  };
  
  const handleActivate = async (id: number) => {
    setIsDeletingId(id);
    try {
      // Find the employee we want to activate
      const employeeToActivate = employees.find(emp => emp.id === id);
      
      if (employeeToActivate) {
        // Pass all required fields along with the status update
        await updateEmployee(id, {
          name: employeeToActivate.name,
          email: employeeToActivate.email,
          phone: employeeToActivate.phone,
          profile: employeeToActivate.profile,
          status: 'active'
        });
        toast.success('User has been activated successfully');
      } else {
        toast.error('User not found');
      }
    } catch (error) {
      toast.error('Failed to activate user');
    } finally {
      setIsDeletingId(null);
    }
  };
  
  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
  };

  const handleLimitChange = (value: string) => {
    setLimit(parseInt(value));
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of visible page range
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the start
      if (currentPage <= 3) {
        endPage = Math.min(maxVisiblePages - 1, totalPages - 1);
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - (maxVisiblePages - 2));
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('ellipsis-start');
      }
      
      // Add visible pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-end">
        <form onSubmit={handleSearch} className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show:</span>
          <Select value={limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No users found. Add a new user to get started.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={employee.profile} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-200">{employee.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{employee.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={employee.status === 'active' ? 'success' : 'secondary'}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {employee.phone || 'N/A'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-500 dark:text-gray-400">
                    {getTimeAgo(employee.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(employee)}
                              className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit user</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit user</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {employee.status === 'active' ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeactivate(employee.id)}
                                disabled={isDeletingId === employee.id}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4" />
                                <span className="sr-only">Deactivate user</span>
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleActivate(employee.id)}
                                disabled={isDeletingId === employee.id}
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <Check className="h-4 w-4" />
                                <span className="sr-only">Activate user</span>
                              </Button>
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{employee.status === 'active' ? 'Deactivate user' : 'Activate user'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          Showing {employees.length > 0 ? (currentPage - 1) * limit + 1 : 0} to {Math.min(currentPage * limit, totalEmployees)} of {totalEmployees} users
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={currentPage === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) => (
              typeof page === 'number' ? (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => handlePageChange(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ) : (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            ))}

            <PaginationItem>
              <PaginationNext
                className={currentPage === totalPages ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {editingUser && (
        <UserDialog
          user={editingUser}
          open={isOpenEditDialog}
          onOpenChange={setIsOpenEditDialog}
          mode="edit"
        />
      )}
    </div>
  );
}
