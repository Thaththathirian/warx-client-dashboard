
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
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
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Edit, EyeOff, Loader2, Search, UserPlus, X } from "lucide-react";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Navbar from '@/components/dashboard/Navbar';
import Sidebar from '@/components/dashboard/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

// Form schemas
const addEmployeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  profile: z.string().url("Invalid URL").optional(),
});

const editEmployeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  profile: z.string().url("Invalid URL").optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

const Users = () => {
  const { isLoading: authLoading } = useProtectedRoute();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');

  // User store
  const {
    employees,
    isLoading,
    getEmployees,
    addEmployee,
    updateEmployee,
    deactivateEmployee,
  } = useUsersStore();

  // Modal states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Forms
  const addForm = useForm<z.infer<typeof addEmployeeSchema>>({
    resolver: zodResolver(addEmployeeSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      profile: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  });

  const editForm = useForm<z.infer<typeof editEmployeeSchema>>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      profile: '',
      status: 'active',
    },
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Load employees on mount
  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  // Filter employees by search query
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form submissions
  const handleAddEmployee = async (data: z.infer<typeof addEmployeeSchema>) => {
    // Make sure all required fields are present
    const employeeData = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      profile: data.profile,
    };
    
    await addEmployee(employeeData);
    setAddDialogOpen(false);
    addForm.reset();
  };

  const handleEditEmployee = async (data: z.infer<typeof editEmployeeSchema>) => {
    if (selectedEmployeeId) {
      // Make sure all required fields are present
      const updateData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        profile: data.profile,
        status: data.status
      };
      
      await updateEmployee(selectedEmployeeId, updateData);
      setEditDialogOpen(false);
      editForm.reset();
    }
  };

  const handleDeactivateEmployee = async () => {
    if (selectedEmployeeId) {
      await deactivateEmployee(selectedEmployeeId);
      setConfirmDialogOpen(false);
    }
  };

  // Open edit form and populate with employee data
  const openEditDialog = (employee: typeof employees[0]) => {
    setSelectedEmployeeId(employee.id);
    editForm.reset({
      name: employee.name,
      email: employee.email,
      phone: employee.phone || '',
      profile: employee.profile || '',
      status: employee.status as "active" | "inactive",
    });
    setEditDialogOpen(true);
  };

  // Open confirm dialog for deactivation
  const openConfirmDialog = (id: number) => {
    setSelectedEmployeeId(id);
    setConfirmDialogOpen(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <motion.div 
          className="w-12 h-12 rounded-full border-4 border-t-theme-green-600 border-gray-200"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`${isMobile ? '' : 'lg:pl-64'} flex flex-col min-h-screen`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 lg:p-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-7xl mx-auto"
          >
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">User Management</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your company employees</p>
              </div>
              
              <Button 
                onClick={() => setAddDialogOpen(true)}
                className="mt-4 md:mt-0 bg-theme-green-600 hover:bg-theme-green-700"
              >
                <UserPlus className="mr-2 h-4 w-4" /> Add Employee
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Employees</CardTitle>
                  <CardDescription>View and manage your company employees</CardDescription>
                  <div className="relative flex items-center mt-4">
                    <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead className="hidden md:table-cell">Email</TableHead>
                          <TableHead className="hidden md:table-cell">Phone</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmployees.length > 0 ? (
                          filteredEmployees.map((employee) => (
                            <TableRow key={employee.id}>
                              <TableCell className="py-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={employee.profile} alt={employee.name} />
                                    <AvatarFallback>{employee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-semibold">{employee.name}</div>
                                    <div className="text-xs text-muted-foreground md:hidden">{employee.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{employee.email}</TableCell>
                              <TableCell className="hidden md:table-cell">{employee.phone || "—"}</TableCell>
                              <TableCell>
                                <Badge variant={employee.status === "active" ? "outline" : "secondary"} className={`px-2 py-1 ${employee.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-700 border-gray-200"}`}>
                                  {employee.status === "active" ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    onClick={() => openEditDialog(employee)}
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    onClick={() => openConfirmDialog(employee.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                                  >
                                    <EyeOff className="h-4 w-4" />
                                    <span className="sr-only">Deactivate</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                              {searchQuery 
                                ? "No employees found matching your search." 
                                : "No employees found. Add your first employee."}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* Add Employee Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddEmployee)} className="space-y-4">
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="profile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/profile.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={addForm.formState.isSubmitting}>
                  {addForm.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Employee
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditEmployee)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="profile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/profile.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={editForm.formState.isSubmitting}>
                  {editForm.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Employee
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirm Deactivation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deactivate Employee</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to deactivate this employee? They will no longer be able to log in.</p>
            <p className="text-sm text-gray-500 mt-2">This action doesn't delete the employee's data but changes their status to inactive.</p>
          </div>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleDeactivateEmployee}
              variant="destructive"
            >
              <EyeOff className="mr-2 h-4 w-4" />
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
