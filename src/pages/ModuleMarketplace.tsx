import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, Users, Archive, Calendar, ClipboardCheck, FileText,
  ClipboardList, TrendingUp, BookOpen, UserPlus, MessageSquare, 
  Users2, Briefcase, Brain, Shield, Activity, DollarSign, Database,
  GraduationCap, Microscope, BarChart3, Code, Store, Lightbulb,
  CheckCircle2, Clock, Lock
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

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Service Modules</h1>
        <p className="text-xl text-muted-foreground">
          Explore DIONA's modular ecosystem. Activate modules as you need them.
        </p>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <Card key={category.title}>
            <CardHeader>
              <CardTitle className="text-2xl">{category.title}</CardTitle>
              <CardDescription>
                {category.modules.length} module{category.modules.length !== 1 ? 's' : ''} available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.modules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <Card key={module.name} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Icon size={20} className="text-primary" />
                            </div>
                            <CardTitle className="text-base">{module.name}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {getStatusBadge(module.status)}
                          {getTierBadge(module.tier)}
                        </div>
                        {module.status === 'active' && (
                          <Button size="sm" variant="outline" className="w-full">
                            Configure
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 bg-primary/5">
        <CardHeader>
          <CardTitle>Need a Custom Module?</CardTitle>
          <CardDescription>
            Join our Co-creation Lab or contact us about custom development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Contact Us</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleMarketplace;
