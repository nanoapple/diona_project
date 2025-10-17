
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import SelfCarePortal from './SelfCarePortal';
import EmergencyPortal from './EmergencyPortal';
import { 
  MessageSquare, 
  FileText, 
  ClipboardCheck, 
  Book, 
  User, 
  CheckSquare,
  Menu,
  X,
  Users,
  Archive,
  Mic,
  Briefcase,
  ClipboardList,
  Calendar,
  Brain,
  BookOpen,
  Database,
  Store
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();
  const [showSelfCare, setShowSelfCare] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  // Get default case ID for interview link (in real app, this would be fetched from API)
  const getDefaultCaseId = () => {
    // Use "1" as the default case ID for demonstration purposes
    return "1";
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname === to || 
                    (to.includes('/interview') && location.pathname.includes('/interview')) ||
                    (to.includes('/clients') && location.pathname.includes('/client-details')) ||
                    (to.includes('/legal-tasks') && location.pathname.includes('/legal-tasks')) ||
                    (to.includes('/schedule') && location.pathname.includes('/schedule'));
    
    return (
      <Link to={to}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start mb-1 text-left flex items-center gap-3",
            isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary"
          )}
        >
          <Icon size={18} />
          {!collapsed && <span>{label}</span>}
        </Button>
      </Link>
    );
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    const defaultCaseId = getDefaultCaseId();
    
    const allItems = [
      { to: "/dashboard", icon: CheckSquare, label: "Dashboard" },
      { to: "/schedule", icon: Calendar, label: "Appointment" },
      { to: "/clients", icon: Users, label: "Clients" },
      { to: "/case-silo", icon: Archive, label: "Case Silo" },
      { to: "/assessments", icon: ClipboardCheck, label: "Assessments" },
      { to: "/reports", icon: Book, label: "Reports" },
      { to: "/jitai", icon: Brain, label: "J.I.T.A.I." },
      { to: "/knowledge", icon: BookOpen, label: "Knowledge" },
      { to: "/service-data", icon: Database, label: "Service Data" }
    ];

    // Add role-specific items based on user role
    const roleSpecificItems = {
      claimant: [
        { to: "/ai-assistant", icon: MessageSquare, label: "AI Assistant" },
        { to: "/documents", icon: FileText, label: "Documents" },
        { to: `/interview/${defaultCaseId}`, icon: Mic, label: "Interview" },
      ],
      lawyer: [
        { to: "/legal-tasks", icon: ClipboardList, label: "Legal Tasks" },
        { to: "/ai-assistant", icon: MessageSquare, label: "AI Assistant" },
        { to: "/documents", icon: FileText, label: "Documents" },
      ],
      psychologist: []
    };

    return [
      ...allItems,
      ...(currentUser?.role ? roleSpecificItems[currentUser.role] || [] : [])
    ];
  };

  return (
    <aside 
      className={cn(
        "bg-card border-r border-border transition-all duration-300 flex flex-col shadow-sm",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="font-semibold text-xl">
            <span className="text-gradient">DI</span>ONA
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto" 
          onClick={toggleSidebar}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      
      <div className="flex flex-col flex-grow p-3 space-y-2 overflow-y-auto">
        {getNavItems().map((item) => (
          <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
        ))}
      </div>

      <div className="mt-auto">
        <div className="p-3">
          <Link to="/module-marketplace">
            <Button
              variant="default"
              className="w-full justify-start text-left flex items-center gap-3"
            >
              <Store size={18} />
              {!collapsed && <span>Service Modules</span>}
            </Button>
          </Link>
        </div>

        <div className="p-3 border-t border-border">
          {!collapsed && (
            <div className="text-xs text-muted-foreground">
              {currentUser?.role && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-foreground text-sm font-bold capitalize flex items-center">
                    {currentUser.role === 'lawyer' && <Briefcase className="mr-1 h-5 w-5" />}
                    {currentUser.role === 'psychologist' && <Book className="mr-1 h-5 w-5" />}
                    {currentUser.role === 'claimant' && <User className="mr-1 h-5 w-5" />}
                    {currentUser.role}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowSelfCare(true)}
                      className="w-8 h-8 rounded-full p-0 bg-green-500 hover:bg-green-600 border border-white shadow-md"
                      title="Self-Care Portal"
                    >
                      <img 
                        src="/lovable-uploads/59e03bbf-7415-4289-ac29-413d19f0a2ee.png" 
                        alt="Self-Care"
                        className="w-6 h-6 object-contain"
                      />
                    </Button>
                    
                    <Button
                      onClick={() => setShowEmergency(true)}
                      className="w-8 h-8 rounded-full p-0 bg-red-500 hover:bg-red-600 border border-white shadow-md"
                      title="Emergency & Crisis Support"
                    >
                      <img 
                        src="/lovable-uploads/52a1d7b8-5f43-4ba1-a9f6-5f526d58134d.png" 
                        alt="Emergency Support"
                        className="w-6 h-6 object-contain"
                      />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <SelfCarePortal 
        isOpen={showSelfCare} 
        onClose={() => setShowSelfCare(false)} 
      />
      
      <EmergencyPortal 
        isOpen={showEmergency} 
        onClose={() => setShowEmergency(false)} 
      />
    </aside>
  );
};

export default Sidebar;
