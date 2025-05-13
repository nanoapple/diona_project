
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { getInitials } from '@/lib/utils';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '555-123-4567', // Mock data
    address: '123 Main Street, Anytown, CA 94123', // Mock data
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = () => {
    setIsUpdating(true);
    
    // Simulate API delay
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated",
      });
      setIsUpdating(false);
    }, 1000);
  };

  const handlePasswordUpdate = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters",
        variant: "destructive"
      });
      return;
    }
    
    setIsUpdating(true);
    
    // Simulate API delay
    setTimeout(() => {
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed",
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsUpdating(false);
    }, 1000);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'victim':
        return 'Claimant';
      case 'lawyer':
        return 'Legal Representative';
      case 'psychologist':
        return 'Healthcare Provider';
      default:
        return 'User';
    }
  };

  return (
    <div className="container max-w-4xl">
      <h1 className="text-3xl font-bold mb-1">Profile</h1>
      <p className="text-muted-foreground mb-6">
        Manage your account information
      </p>
      
      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg bg-primary text-white">
                  {currentUser?.name ? getInitials(currentUser.name) : <User size={32} />}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{currentUser?.name}</CardTitle>
                <CardDescription>{currentUser?.email}</CardDescription>
                <div className="mt-1">
                  <span className="inline-block bg-primary/10 text-primary px-2 py-1 text-xs rounded-full">
                    {currentUser?.role ? getRoleLabel(currentUser.role) : 'User'}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Tabs defaultValue="account">
          <TabsList className="mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={profileData.name} 
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profileData.email} 
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={profileData.phone} 
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      value={profileData.address} 
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleProfileUpdate} disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    value={passwordData.currentPassword} 
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      value={passwordData.newPassword} 
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={passwordData.confirmPassword} 
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handlePasswordUpdate} 
                  disabled={isUpdating || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage login sessions and security options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-medium">Active Sessions</div>
                    <div className="text-sm text-muted-foreground">
                      You are currently logged in on this device
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Login History</div>
                    <div className="text-sm text-muted-foreground">
                      Last login: Today at 10:23 AM
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={logout}>Log Out of All Devices</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-muted-foreground">
                        Receive email updates about your case
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">SMS Notifications</div>
                      <div className="text-sm text-muted-foreground">
                        Receive text messages for important updates
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
