
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">
                <span className="text-gradient">Affirm</span>Claim
              </h1>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
                <span className="text-blue-500">Affirm</span> and Clarify the Collaborative Path to Your <span className="text-blue-500">Claim</span>
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                AffirmClaim connects claimants, lawyers, and psychologists on a single platform to streamline 
                personal injury, workplace, and insurance-related compensation claims.
              </p>
              <div className="mt-8 sm:mx-auto sm:max-w-lg sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">Log In</Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden">
                <div className="px-6 py-8">
                  <h2 className="text-2xl font-bold mb-4">Our Platform Features</h2>
                  <ul className="space-y-4">
                    {[
                      "AI-powered answers to your claim questions",
                      "Secure document sharing between all parties",
                      "Online psychometric assessments",
                      "Automated report generation for professionals",
                      "Real-time case progress updates",
                      "Role-based access for security"
                    ].map((feature, index) => (
                      <li key={index} className="flex">
                        <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                        <span className="ml-3">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-secondary py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-12">How It Works</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "For Claimants",
                  description: "Get answers to your questions, complete assessments, and securely access your case documents all in one place.",
                },
                {
                  title: "For Lawyers",
                  description: "Share case updates and documents with clients and collaborate with healthcare providers to build stronger cases.",
                },
                {
                  title: "For Psychologists",
                  description: "Administer assessments and generate professional reports with AI assistance to streamline your workflow.",
                },
              ].map((item, index) => (
                <div key={index} className="bg-card rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} AffirmClaim. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
