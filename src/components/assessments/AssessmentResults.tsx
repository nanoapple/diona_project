
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Assessment, AssessmentResults as AssessmentResultsType } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface AssessmentResultsProps {
  assessment: Assessment;
  results: AssessmentResultsType;
  onClose: () => void;
}

export function AssessmentResults({ assessment, results, onClose }: AssessmentResultsProps) {
  const chartData = [
    {
      name: "Depression",
      value: results.depression || 0,
      fill: "#ef4444",
      maxValue: 21,
    },
    {
      name: "Anxiety",
      value: results.anxiety || 0,
      fill: "#f97316",
      maxValue: 21,
    },
    {
      name: "Stress",
      value: results.stress || 0,
      fill: "#8b5cf6",
      maxValue: 21,
    },
  ];

  // Define severity thresholds for each scale
  const severityLevels = {
    depression: [
      { max: 4, label: "Normal", color: "#10b981" },
      { max: 6, label: "Mild", color: "#facc15" },
      { max: 10, label: "Moderate", color: "#f97316" },
      { max: 13, label: "Severe", color: "#ef4444" },
      { max: 21, label: "Extremely Severe", color: "#7f1d1d" },
    ],
    anxiety: [
      { max: 3, label: "Normal", color: "#10b981" },
      { max: 5, label: "Mild", color: "#facc15" },
      { max: 7, label: "Moderate", color: "#f97316" },
      { max: 9, label: "Severe", color: "#ef4444" },
      { max: 21, label: "Extremely Severe", color: "#7f1d1d" },
    ],
    stress: [
      { max: 7, label: "Normal", color: "#10b981" },
      { max: 9, label: "Mild", color: "#facc15" },
      { max: 12, label: "Moderate", color: "#f97316" },
      { max: 16, label: "Severe", color: "#ef4444" },
      { max: 21, label: "Extremely Severe", color: "#7f1d1d" },
    ],
  };

  // Helper to get severity level text and color
  const getSeverity = (score: number, type: 'depression' | 'anxiety' | 'stress') => {
    const levels = severityLevels[type];
    for (const level of levels) {
      if (score <= level.max) {
        return { label: level.label, color: level.color };
      }
    }
    return { label: "Unknown", color: "#64748b" };
  };

  const depressionSeverity = getSeverity(results.depression || 0, 'depression');
  const anxietySeverity = getSeverity(results.anxiety || 0, 'anxiety');
  const stressSeverity = getSeverity(results.stress || 0, 'stress');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{assessment.title} Results</CardTitle>
        <CardDescription>
          Assessment completed for {assessment.patientName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 21]} />
              <Tooltip 
                formatter={(value: number) => [`Score: ${value}`, ""]}
                labelFormatter={(name) => `${name} Scale`}
              />
              <Bar dataKey="value" barSize={60}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Assessment Summary</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="border rounded-md p-4">
              <div className="font-medium">Depression</div>
              <div className="text-2xl font-bold">{results.depression}</div>
              <div className="text-sm mt-1" style={{ color: depressionSeverity.color }}>
                {depressionSeverity.label}
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="font-medium">Anxiety</div>
              <div className="text-2xl font-bold">{results.anxiety}</div>
              <div className="text-sm mt-1" style={{ color: anxietySeverity.color }}>
                {anxietySeverity.label}
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="font-medium">Stress</div>
              <div className="text-2xl font-bold">{results.stress}</div>
              <div className="text-sm mt-1" style={{ color: stressSeverity.color }}>
                {stressSeverity.label}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Interpretation</h4>
            <p className="text-sm text-muted-foreground">
              The client's results indicate {depressionSeverity.label.toLowerCase()} levels of depression, {anxietySeverity.label.toLowerCase()} levels of anxiety, and {stressSeverity.label.toLowerCase()} levels of stress based on the DASS-21 scale.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={() => window.print()}>
          Print Results
        </Button>
        <Button onClick={onClose}>
          Close
        </Button>
      </CardFooter>
    </Card>
  );
}
