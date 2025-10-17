import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Users, Archive, Calendar, ClipboardCheck, FileText,
  ClipboardList, TrendingUp, BookOpen, UserPlus, MessageSquare, 
  Users2, Briefcase, Brain, Shield, Activity, DollarSign, Database,
  GraduationCap, Microscope, BarChart3, Code, Store, Lightbulb,
  CheckCircle2, Clock, Lock, ChevronRight
} from "lucide-react";

interface Module {
  name: string;
  icon: any;
  status: 'active' | 'planned' | 'coming-soon';
  description: string;
  tier?: 'core' | 'professional' | 'institutional';
}

interface ModuleCategory {
  title: string;
  modules: Module[];
}

const ModuleMarketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("Core Platform");
  
  const categories: ModuleCategory[] = [
    {
      title: "Core Platform",
      modules: [
        { name: "Dashboard", icon: LayoutDashboard, status: "active", description: "Overview of practice activity and key metrics", tier: "core" },
        { name: "Clients", icon: Users, status: "active", description: "Client information repository", tier: "core" },
        { name: "Case Silo", icon: Archive, status: "active", description: "Fundamental case management system", tier: "core" },
        { name: "Appointment", icon: Calendar, status: "active", description: "Basic scheduling and appointment management", tier: "core" },
        { name: "Assessments", icon: ClipboardCheck, status: "active", description: "Standardized clinical assessment tools", tier: "core" },
        { name: "Session Notes", icon: FileText, status: "active", description: "Essential clinical documentation", tier: "core" },
      ]
    },
    {
      title: "Clinical Workflow",
      modules: [
        { name: "Treatment Planner", icon: ClipboardList, status: "planned", description: "Structured treatment planning and goal setting", tier: "professional" },
        { name: "Progress & Outcomes Tracking", icon: TrendingUp, status: "planned", description: "Monitor client progress and treatment outcomes", tier: "professional" },
        { name: "Reports", icon: BookOpen, status: "active", description: "AI-assisted clinical report generation", tier: "professional" },
      ]
    },
    {
      title: "Collaboration & Client Engagement",
      modules: [
        { name: "Client Portal", icon: UserPlus, status: "planned", description: "Secure client access to their information", tier: "professional" },
        { name: "Referral Hub", icon: Users2, status: "planned", description: "Manage incoming and outgoing referrals", tier: "professional" },
        { name: "Messaging & Notifications", icon: MessageSquare, status: "planned", description: "Secure communication with clients and colleagues", tier: "professional" },
        { name: "Multidisciplinary Collaboration", icon: Users2, status: "planned", description: "Cross-team case collaboration tools", tier: "institutional" },
        { name: "Medico-legal", icon: Briefcase, status: "active", description: "Legal task and documentation management", tier: "institutional" },
        { name: "J.I.T.A.I.", icon: Brain, status: "planned", description: "Just-In-Time Adaptive Intervention system", tier: "institutional" },
      ]
    },
    {
      title: "Compliance & Operations",
      modules: [
        { name: "Consent & Compliance Management", icon: Shield, status: "planned", description: "Track consent and regulatory compliance", tier: "professional" },
        { name: "Audit & Activity Log", icon: Activity, status: "planned", description: "Comprehensive audit trail and activity monitoring", tier: "institutional" },
        { name: "Billing / Invoicing / Insurance Integration", icon: DollarSign, status: "planned", description: "Financial management and insurance claims", tier: "institutional" },
        { name: "Service Data", icon: Database, status: "active", description: "Aggregate service delivery data", tier: "institutional" },
      ]
    },
    {
      title: "Knowledge & Professional Development",
      modules: [
        { name: "Knowledge Hub", icon: BookOpen, status: "active", description: "Personal professional development resources", tier: "professional" },
        { name: "Supervision & Peer Review", icon: Users2, status: "planned", description: "Structured supervision and case review", tier: "professional" },
        { name: "CPD / Training Tracker", icon: GraduationCap, status: "planned", description: "Track continuing professional development", tier: "professional" },
        { name: "Research & Quality Module", icon: Microscope, status: "planned", description: "Research participation and quality improvement", tier: "institutional" },
      ]
    },
    {
      title: "Analytics & Intelligence",
      modules: [
        { name: "Predictive Insights", icon: Brain, status: "planned", description: "AI-powered clinical decision support", tier: "institutional" },
        { name: "Population Dashboard / Service Analytics", icon: BarChart3, status: "planned", description: "Aggregate insights for organizations", tier: "institutional" },
        { name: "API & Integration Gateway", icon: Code, status: "planned", description: "Connect with existing systems and tools", tier: "institutional" },
      ]
    },
    {
      title: "Ecosystem & Innovation",
      modules: [
        { name: "Developer SDK", icon: Code, status: "coming-soon", description: "Build custom modules for DIONA", tier: "institutional" },
        { name: "Marketplace Governance Dashboard", icon: Store, status: "coming-soon", description: "Review and manage third-party modules", tier: "institutional" },
        { name: "Co-creation Lab", icon: Lightbulb, status: "coming-soon", description: "Collaborate on new features and research", tier: "institutional" },
      ]
    },
  ];

  const getStatusBadge = (status: Module['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="gap-1"><CheckCircle2 size={12} /> Active</Badge>;
      case 'planned':
        return <Badge variant="secondary" className="gap-1"><Clock size={12} /> Planned</Badge>;
      case 'coming-soon':
        return <Badge variant="outline" className="gap-1"><Lock size={12} /> Coming Soon</Badge>;
    }
  };

  const getTierBadge = (tier?: Module['tier']) => {
    if (!tier) return null;
    const colors = {
      core: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
      professional: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      institutional: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20"
    };
    return <Badge variant="outline" className={colors[tier]}>{tier}</Badge>;
  };

  const selectedCategoryData = categories.find(cat => cat.title === selectedCategory);
  const totalModules = categories.reduce((acc, cat) => acc + cat.modules.length, 0);

  return (
    <div className="flex h-full bg-background">
      {/* Left Sidebar - Categories */}
      <div className="w-64 border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Categories</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-4 space-y-1">
            <button
              onClick={() => setSelectedCategory("All")}
              className={cn(
                "w-full flex items-start gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                selectedCategory === "All" 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="flex-1 text-left">All categories</span>
              <span className="text-xs shrink-0">{totalModules}</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.title}
                onClick={() => setSelectedCategory(category.title)}
                className={cn(
                  "w-full flex items-start gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left",
                  selectedCategory === category.title 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="flex-1 leading-snug">{category.title}</span>
                <span className="text-xs shrink-0 mt-0.5">{category.modules.length}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Store size={16} />
              <ChevronRight size={16} />
              <span>{selectedCategory}</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {selectedCategory === "All" ? "All Modules" : selectedCategory}
            </h1>
            <p className="text-muted-foreground">
              {selectedCategory === "All" 
                ? `Explore all ${totalModules} modules in DIONA's ecosystem`
                : selectedCategoryData 
                  ? `${selectedCategoryData.modules.length} module${selectedCategoryData.modules.length !== 1 ? 's' : ''} available`
                  : "Explore DIONA's modular ecosystem"
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedCategory === "All" 
              ? categories.flatMap(cat => cat.modules) 
              : selectedCategoryData?.modules || []
            ).map((module) => {
              const Icon = module.icon;
              return (
                <Card key={module.name} className="hover:shadow-lg transition-all hover:border-primary/50 flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon size={24} className="text-primary" />
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        {getStatusBadge(module.status)}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{module.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{module.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      {getTierBadge(module.tier)}
                    </div>
                    <div className="mt-auto">
                      {module.status === 'active' && (
                        <Button size="sm" variant="outline" className="w-full">
                          Configure Module
                        </Button>
                      )}
                      {module.status === 'planned' && (
                        <Button size="sm" variant="ghost" className="w-full" disabled>
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Custom Module CTA */}
          <Card className="mt-12 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Need a Custom Module?</CardTitle>
              <CardDescription className="text-base">
                Join our Co-creation Lab or contact us about custom development for your specific needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="gap-2">
                <MessageSquare size={18} />
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModuleMarketplace;
