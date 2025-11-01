
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserRole } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "client" as UserRole,
    specialization: "",
  });
  const [formError, setFormError] = useState("");
  
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData({
      ...formData,
      role: value,
      specialization: value === "therapist" ? formData.specialization : "",
    });
  };

  const handleSpecializationChange = (value: string) => {
    setFormData({
      ...formData,
      specialization: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Basic validations
    if (!formData.name.trim()) {
      setFormError("Please enter your name");
      return;
    }

    if (!formData.email.trim()) {
      setFormError("Please enter your email");
      return;
    }

    if (!formData.password) {
      setFormError("Please enter a password");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      
      // Map frontend role to database enum
      let dbRole: 'client' | 'psychologist' | 'counsellor' | 'social_worker' | 'admin' = 'client';
      if (formData.role === 'therapist') {
        dbRole = 'psychologist';
      } else if (formData.role === 'orgadmin') {
        dbRole = 'admin';
      } else if (formData.role === 'intake') {
        dbRole = 'social_worker';
      } else {
        dbRole = 'client';
      }

      // Import supabase dynamically to avoid circular dependencies
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: dbRole,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      // The handle_new_user_comprehensive trigger will create the user_profile
      // but we need to add them to a tenant
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          full_name: formData.name,
          role: dbRole,
          specializations: formData.specialization ? [formData.specialization] : null,
        })
        .eq('user_id', authData.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      // Navigate to login
      navigate("/login", { 
        state: { message: "Account created successfully! Please check your email to verify your account, then log in." } 
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      setFormError(error.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-muted/40">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {formError && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {formError}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleRoleChange(value as UserRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="therapist">Therapist</SelectItem>
                  <SelectItem value="orgadmin">Organisation Admin</SelectItem>
                  <SelectItem value="intake">Intake Officer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.role === "therapist" && (
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select
                  value={formData.specialization}
                  onValueChange={handleSpecializationChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="art-therapy">Art therapy</SelectItem>
                    <SelectItem value="counselling">Counselling</SelectItem>
                    <SelectItem value="physiology">Physiology</SelectItem>
                    <SelectItem value="genetic-counselling">Genetic counselling</SelectItem>
                    <SelectItem value="music-therapy">Music therapy</SelectItem>
                    <SelectItem value="nutrition-dietetics">Nutrition and dietetics</SelectItem>
                    <SelectItem value="occupational-therapy">Occupational therapy</SelectItem>
                    <SelectItem value="physiotherapy">Physiotherapy</SelectItem>
                    <SelectItem value="psychology">Psychology</SelectItem>
                    <SelectItem value="social-work">Social work</SelectItem>
                    <SelectItem value="speech-pathology">Speech pathology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
            <p className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline text-primary">
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
