import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Clock, Target } from "lucide-react";

const JITAI = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Brain className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">J.I.T.A.I.</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Just-In-Time Adaptive Intervention
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              About JITAI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Just-In-Time Adaptive Intervention (JITAI) is a type of digital health intervention 
              that delivers tailored support to individuals based on their changing states and 
              contexts in real-time. It uses mobile and sensing technologies to monitor individuals 
              and provide the right type of support at the right time and place.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This approach aims to enhance the precision and effectiveness of health behavior 
              strategies, particularly in areas like physical activity, alcohol use, mental illness, 
              smoking, and obesity.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Development Status
            </CardTitle>
            <CardDescription>
              This feature is currently under development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                The JITAI functionality will be available soon. Please come back and check for updates.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JITAI;