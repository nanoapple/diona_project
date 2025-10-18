
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import SelfCarePortal from './SelfCarePortal';
import EmergencyPortal from './EmergencyPortal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Store,
  MoreVertical,
  Settings,
  Power
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showSelfCare, setShowSelfCare] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [enabledModules, setEnabledModules] = useState<Record<string, boolean>>({});

  const toggleSidebar = () => setCollapsed(!collapsed);
  
  const toggleModule = (modulePath: string) => {
    setEnabledModules(prev => ({
      ...prev,
      [modulePath]: prev[modulePath] === false ? true : false
    }));
  };
  
  const isModuleEnabled = (modulePath: string) => {
    return enabledModules[modulePath] !== false;
  };
  
  const navigateToModuleSettings = (tier: string) => {
    navigate(`/module-marketplace?category=${tier}`);
  };

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

  const ModuleNavItem = ({ 
    to, 
    icon: Icon, 
    label, 
    tier 
  }: { 
    to: string; 
    icon: any; 
    label: string; 
    tier: 'core' | 'professional' | 'institutional';
  }) => {
    const isActive = location.pathname === to || 
                    (to.includes('/interview') && location.pathname.includes('/interview')) ||
                    (to.includes('/clients') && location.pathname.includes('/client-details')) ||
                    (to.includes('/legal-tasks') && location.pathname.includes('/legal-tasks')) ||
                    (to.includes('/schedule') && location.pathname.includes('/schedule'));
    
    const enabled = isModuleEnabled(to);
    const isCore = tier === 'core';
    
    const tierColors = {
      core: {
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        text: "text-green-700 dark:text-green-400",
        icon: "text-green-600 dark:text-green-400",
        hover: "hover:bg-green-600 hover:text-white hover:border-green-600",
        hoverIcon: "group-hover:text-white",
        active: "bg-green-600 border-green-600 text-white",
        disabled: "bg-gray-300/50 border-gray-400/30 text-gray-500"
      },
      professional: {
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        text: "text-blue-700 dark:text-blue-400",
        icon: "text-blue-600 dark:text-blue-400",
        hover: "hover:bg-blue-600 hover:text-white hover:border-blue-600",
        hoverIcon: "group-hover:text-white",
        active: "bg-blue-600 border-blue-600 text-white",
        disabled: "bg-gray-300/50 border-gray-400/30 text-gray-500"
      },
      institutional: {
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        text: "text-purple-700 dark:text-purple-400",
        icon: "text-purple-600 dark:text-purple-400",
        hover: "hover:bg-purple-600 hover:text-white hover:border-purple-600",
        hoverIcon: "group-hover:text-white",
        active: "bg-purple-600 border-purple-600 text-white",
        disabled: "bg-gray-300/50 border-gray-400/30 text-gray-500"
      }
    };

    const colors = tierColors[tier];
    
    return (
      <div className="block mb-2 group relative">
        <Link to={to} className={cn("block", !enabled && "pointer-events-none")}>
          <div
            className={cn(
              "w-full px-3 py-2 rounded-md border transition-all flex items-center gap-3",
              !enabled && colors.disabled,
              enabled && (isActive ? colors.active : `${colors.bg} ${colors.border} ${colors.text} ${colors.hover}`)
            )}
          >
            <Icon size={18} className={cn(
              !enabled && "text-gray-400",
              enabled && (isActive ? "text-white" : `${colors.icon} ${colors.hoverIcon}`)
            )} />
            {!collapsed && (
              <>
                <span className="flex-1 font-medium text-sm">{label}</span>
              </>
            )}
          </div>
        </Link>
        
        {!collapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-black/10",
                  !enabled && "text-gray-400",
                  enabled && (isActive ? "text-white" : "text-muted-foreground")
                )}
              >
                <MoreVertical size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => toggleModule(to)}>
                <Power size={16} className="mr-2" />
                {enabled ? 'Disable Module' : 'Enable Module'}
              </DropdownMenuItem>
              {!isCore && (
                <DropdownMenuItem onClick={() => navigateToModuleSettings(tier)}>
                  <Settings size={16} className="mr-2" />
                  Module Settings
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  };

  // Define navigation items based on user role
  const getCoreModules = () => [
    { to: "/schedule", icon: Calendar, label: "Appointment", tier: 'core' as const },
    { to: "/clients", icon: Users, label: "Clients", tier: 'core' as const },
    { to: "/case-silo", icon: Archive, label: "Case Silo", tier: 'core' as const },
    { to: "/assessments", icon: ClipboardCheck, label: "Assessments", tier: 'core' as const },
  ];

  const getOtherModules = () => [
    { to: "/reports", icon: Book, label: "Reports", tier: 'professional' as const },
    { to: "/jitai", icon: Brain, label: "J.I.T.A.I.", tier: 'institutional' as const },
    { to: "/knowledge", icon: BookOpen, label: "Knowledge", tier: 'professional' as const },
    { to: "/service-data", icon: Database, label: "Service Data", tier: 'institutional' as const }
  ];

  const getRoleSpecificItems = () => {
    const defaultCaseId = getDefaultCaseId();
    
    const roleSpecificItems: Record<string, Array<{to: string; icon: any; label: string; tier: 'core' | 'professional' | 'institutional'}>> = {
      claimant: [
        { to: "/ai-assistant", icon: MessageSquare, label: "AI Assistant", tier: 'professional' as const },
        { to: "/documents", icon: FileText, label: "Documents", tier: 'core' as const },
        { to: `/interview/${defaultCaseId}`, icon: Mic, label: "Interview", tier: 'core' as const },
      ],
      lawyer: [
        { to: "/legal-tasks", icon: ClipboardList, label: "Legal Tasks", tier: 'institutional' as const },
        { to: "/ai-assistant", icon: MessageSquare, label: "AI Assistant", tier: 'professional' as const },
        { to: "/documents", icon: FileText, label: "Documents", tier: 'core' as const },
      ],
      psychologist: []
    };

    return currentUser?.role ? roleSpecificItems[currentUser.role] || [] : [];
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
        {/* Dashboard - Keep as simple nav item */}
        <NavItem to="/dashboard" icon={CheckSquare} label="Dashboard" />
        
        {/* Core Modules (Green) */}
        {getCoreModules().map((module) => (
          <ModuleNavItem 
            key={module.to} 
            to={module.to} 
            icon={module.icon} 
            label={module.label}
            tier={module.tier}
          />
        ))}
        
        {/* Core role-specific items */}
        {getRoleSpecificItems().filter(item => item.tier === 'core').map((item) => (
          <ModuleNavItem 
            key={item.to} 
            to={item.to} 
            icon={item.icon} 
            label={item.label}
            tier={item.tier}
          />
        ))}
        
        {/* Professional Modules (Blue) */}
        {getOtherModules().filter(module => module.tier === 'professional').map((module) => (
          <ModuleNavItem 
            key={module.to} 
            to={module.to} 
            icon={module.icon} 
            label={module.label}
            tier={module.tier}
          />
        ))}
        
        {/* Professional role-specific items */}
        {getRoleSpecificItems().filter(item => item.tier === 'professional').map((item) => (
          <ModuleNavItem 
            key={item.to} 
            to={item.to} 
            icon={item.icon} 
            label={item.label}
            tier={item.tier}
          />
        ))}
        
        {/* Institutional Modules (Purple) */}
        {getOtherModules().filter(module => module.tier === 'institutional').map((module) => (
          <ModuleNavItem 
            key={module.to} 
            to={module.to} 
            icon={module.icon} 
            label={module.label}
            tier={module.tier}
          />
        ))}
        
        {/* Institutional role-specific items */}
        {getRoleSpecificItems().filter(item => item.tier === 'institutional').map((item) => (
          <ModuleNavItem 
            key={item.to} 
            to={item.to} 
            icon={item.icon} 
            label={item.label}
            tier={item.tier}
          />
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
