
import { motion } from 'framer-motion';
import { FiShield, FiAlertCircle, FiFile, FiFilm, FiGlobe, FiAlertTriangle, FiUserCheck, FiLock } from 'react-icons/fi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/dashboard/StatCard';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Dashboard = () => {
  const contentVariants = {
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

  return (
    <DashboardLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        className="max-w-7xl mx-auto"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold mb-2">Welcome to your Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Monitor and protect your content from piracy threats</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Protected Content"
            value="1,284"
            description="Files under protection"
            icon={<FiShield className="h-4 w-4" />}
            trend={{ value: 12, isPositive: true }}
            delay={0}
          />
          <StatCard
            title="Active Threats"
            value="37"
            description="Across 18 domains"
            icon={<FiAlertCircle className="h-4 w-4" />}
            trend={{ value: 5, isPositive: false }}
            delay={1}
          />
          <StatCard
            title="DMCA Notices"
            value="96"
            description="This month"
            icon={<FiFile className="h-4 w-4" />}
            trend={{ value: 8, isPositive: true }}
            delay={2}
          />
          <StatCard
            title="Takedown Rate"
            value="93%"
            description="Average success rate"
            icon={<FiAlertTriangle className="h-4 w-4" />}
            trend={{ value: 3, isPositive: true }}
            delay={3}
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="threats">Threats</TabsTrigger>
              <TabsTrigger value="protection">Protection</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Protection Status</CardTitle>
                    <CardDescription>Your protection coverage by content type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FiFilm className="mr-2 h-4 w-4 text-theme-green-600" />
                          <span>Video Content</span>
                        </div>
                        <div className="w-[180px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-theme-green-600 rounded-full" style={{ width: '94%' }} />
                        </div>
                        <span className="ml-2 text-sm font-medium">94%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FiFile className="mr-2 h-4 w-4 text-theme-green-600" />
                          <span>Document Files</span>
                        </div>
                        <div className="w-[180px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-theme-green-600 rounded-full" style={{ width: '87%' }} />
                        </div>
                        <span className="ml-2 text-sm font-medium">87%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FiGlobe className="mr-2 h-4 w-4 text-theme-green-600" />
                          <span>Website Content</span>
                        </div>
                        <div className="w-[180px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-theme-green-600 rounded-full" style={{ width: '76%' }} />
                        </div>
                        <span className="ml-2 text-sm font-medium">76%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Latest protection events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="mt-0.5 bg-red-100 dark:bg-red-900 p-1 rounded-full">
                          <FiAlertTriangle className="h-3 w-3 text-red-600 dark:text-red-300" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">New threat detected</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">15 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="mt-0.5 bg-theme-green-100 dark:bg-theme-green-900 p-1 rounded-full">
                          <FiUserCheck className="h-3 w-3 text-theme-green-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">DMCA takedown successful</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="mt-0.5 bg-blue-100 dark:bg-blue-900 p-1 rounded-full">
                          <FiShield className="h-3 w-3 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">New content protected</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="mt-0.5 bg-yellow-100 dark:bg-yellow-900 p-1 rounded-full">
                          <FiLock className="h-3 w-3 text-yellow-600 dark:text-yellow-300" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">Security scan completed</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="threats">
              <Card>
                <CardHeader>
                  <CardTitle>Threat Analysis</CardTitle>
                  <CardDescription>Detailed view of content threats</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    This section will display detailed threat analysis data
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="protection">
              <Card>
                <CardHeader>
                  <CardTitle>Protection Measures</CardTitle>
                  <CardDescription>Active protection methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    This section will display active protection measures and statistics
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
