
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
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
  Database
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();

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
    
    const commonItems = [
      { to: "/dashboard", icon: CheckSquare, label: "Dashboard" },
      { to: "/schedule", icon: Calendar, label: "Appointment" },
      { to: "/clients", icon: Users, label: "Clients" },
      { to: "/case-silo", icon: Archive, label: "Case Silo" },
      { to: "/jitai", icon: Brain, label: "J.I.T.A.I." },
      { to: "/knowledge", icon: BookOpen, label: "Knowledge" },
      { to: "/service-data", icon: Database, label: "Service Data" }
    ];

    const roleSpecificItems = {
      claimant: [
        { to: "/ai-assistant", icon: MessageSquare, label: "AI Assistant" },
        { to: "/documents", icon: FileText, label: "Documents" },
        { to: "/assessments", icon: ClipboardCheck, label: "Assessments" },
        { to: `/interview/${defaultCaseId}`, icon: Mic, label: "Interview" },
      ],
      lawyer: [
        { to: "/legal-tasks", icon: ClipboardList, label: "Legal Tasks" },
        { to: "/ai-assistant", icon: MessageSquare, label: "AI Assistant" },
        { to: "/documents", icon: FileText, label: "Documents" },
      ],
      psychologist: [
        { to: "/assessments", icon: ClipboardCheck, label: "Assessments" },
        { to: "/reports", icon: Book, label: "Reports" },
      ]
    };

    return [
      ...commonItems,
      ...(currentUser?.role ? roleSpecificItems[currentUser.role] : [])
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

      {!collapsed && (
        <div className="p-4 border-t border-border mt-auto">
          <div className="text-xs text-muted-foreground">
            {currentUser?.role && (
              <div className="flex items-center gap-2">
                <span className="bg-primary/20 text-primary text-sm px-3 py-1 rounded-full capitalize flex items-center">
                  {currentUser.role === 'lawyer' && <Briefcase className="mr-1 h-5 w-5" />}
                  {currentUser.role === 'psychologist' && <Book className="mr-1 h-5 w-5" />}
                  {currentUser.role === 'claimant' && <User className="mr-1 h-5 w-5" />}
                  {currentUser.role}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
