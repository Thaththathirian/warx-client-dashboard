
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Pencil, User, XCircle } from 'lucide-react';
import { UserDialog } from './UserDialog';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

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
  const { employees, isLoading, deactivateEmployee } = useUsersStore();
  const [editingUser, setEditingUser] = useState<Employee | null>(null);
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

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
  
  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Phone</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleEditClick(employee)}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeactivate(employee.id)}
                        disabled={isDeletingId === employee.id || employee.status !== 'active'}
                        className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        <span>Deactivate</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

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
