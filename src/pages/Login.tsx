
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import { useEffect } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, isAuthenticated, error } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <motion.div variants={itemVariants} className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-theme-green-600 to-theme-green-400 bg-clip-text text-transparent mb-2">
            Anti-Piracy Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Enter your credentials to sign in
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-theme-green-600 to-theme-green-400" />
            
            <CardHeader className="pb-2">
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Access your dashboard</CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="email@company.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button 
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-md"
                  >
                    {error}
                  </motion.div>
                )}
              </CardContent>
              
              <CardFooter className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-theme-green-600 to-theme-green-500 hover:from-theme-green-700 hover:to-theme-green-600 transition-all shadow-md hover:shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-black/20 p-3 rounded-md shadow-sm">
          <p>Demo credentials: john.smith@company.com / newpassword123</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
