
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">
                Diona
              </h1>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-gray-900">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Register</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-grow bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7 lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
                <span className="text-blue-200">D</span>ata and<br />
                <span className="text-blue-200">I</span>ntelligence<br />
                <span className="text-blue-200">O</span>ptimisation for<br />
                <span className="text-blue-200">N</span>onprofit<br />
                <span className="text-blue-200">A</span>dvancement
              </h1>
              <p className="mt-6 text-lg text-white/90 max-w-2xl">
                Diona connects nonprofits with cutting-edge data intelligence 
                and technology solutions on a unified platform to streamline 
                operations, enhance impact measurement, and accelerate 
                mission-driven outcomes.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold mb-6 text-white">Our Platform Features</h2>
                <ul className="space-y-4">
                  {[
                    "Comprehensive allied health assessment tools and screening",
                    "AI-powered client case management and progress tracking", 
                    "Secure document management and stakeholder collaboration",
                    "Automated reporting and compliance for Australian standards",
                    "Integrated scheduling and appointment management system",
                    "Real-time analytics dashboard for service delivery insights"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-blue-500 rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-white/90 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-12 text-gray-900">How It Works</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "For Nonprofits",
                  description: "Access powerful analytics tools to measure your impact, manage donors, and streamline operations all in one platform.",
                },
                {
                  title: "For Funders",
                  description: "Get real-time insights into nonprofit performance and impact measurement with transparent reporting and data visualization.",
                },
                {
                  title: "For Communities",
                  description: "Connect with mission-driven organizations and track the collective impact of nonprofit initiatives in your area.",
                },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Diona. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
