
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUsersStore } from '@/store/userStore';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { toast } from 'sonner';

interface Employee {
  id: number;
  name: string;
  email: string;
  profile?: string;
  phone?: string;
  status?: string;
  company_id?: number;
  created_at?: string;
  updated_at?: string;
  company_name?: string;
}

type UserDialogProps = {
  user?: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
};

const userSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().optional(),
  profile: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  status: z.string().optional(),
});

export function UserDialog({ user, open, onOpenChange, mode }: UserDialogProps) {
  const { addEmployee, updateEmployee, isLoading } = useUsersStore();
  const [avatarError, setAvatarError] = useState(false);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      profile: user?.profile || '',
      phone: user?.phone || '',
      status: user?.status || 'active',
    },
  });

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    try {
      if (mode === 'add') {
        // Password is required for adding a new user
        if (!values.password) {
          form.setError('password', { 
            type: 'manual', 
            message: 'Password is required for new users' 
          });
          return;
        }
        
        await addEmployee({
          name: values.name,
          email: values.email,
          password: values.password,
          profile: values.profile || undefined,
          phone: values.phone || undefined,
        });

        toast.success('New user created successfully');
      } else if (mode === 'edit' && user) {
        await updateEmployee(user.id, {
          name: values.name,
          email: values.email,
          profile: values.profile || undefined,
          phone: values.phone || undefined,
          status: values.status,
        });

        toast.success('User updated successfully');
      }
      
      onOpenChange(false);
    } catch (error) {
      toast.error('An error occurred while saving the user');
    }
  };

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New User' : 'Edit User'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Create a new user account.' 
              : 'Make changes to the user profile here.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-center mb-6">
              <Avatar className="h-20 w-20">
                {form.watch('profile') && !avatarError ? (
                  <AvatarImage 
                    src={form.watch('profile')} 
                    onError={handleAvatarError} 
                  />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {form.watch('name')?.substring(0, 2).toUpperCase() || <User className="h-8 w-8" />}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            
            <FormField
              control={form.control}
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
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === 'add' && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                    Saving...
                  </>
                ) : mode === 'add' ? 'Create User' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
