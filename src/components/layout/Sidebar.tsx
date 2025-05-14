
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
  Archive
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => setCollapsed(!collapsed);

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname === to;
    
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
    const commonItems = [
      { to: "/dashboard", icon: CheckSquare, label: "Dashboard" },
      { to: "/case-silo", icon: Archive, label: "Case Silo" },
      { to: "/profile", icon: User, label: "Profile" }
    ];

    const roleSpecificItems = {
      victim: [
        { to: "/ai-assistant", icon: MessageSquare, label: "AI Assistant" },
        { to: "/documents", icon: FileText, label: "Documents" },
        { to: "/assessments", icon: ClipboardCheck, label: "Assessments" },
      ],
      lawyer: [
        { to: "/ai-assistant", icon: MessageSquare, label: "AI Assistant" },
        { to: "/documents", icon: FileText, label: "Documents" },
      ],
      psychologist: [
        { to: "/clients", icon: Users, label: "Clients" },
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
            <span className="text-gradient">Claim</span>Collab
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
                <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full capitalize">
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
