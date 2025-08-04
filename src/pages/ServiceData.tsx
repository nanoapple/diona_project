import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

const ServiceData = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Database className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Service Data</h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive service data management and analytics
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Under Development</CardTitle>
            <CardDescription>
              This section is being prepared for future functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                Service data functionality will be implemented based on your requirements.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceData;