import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const checks = useMemo(() => {
    return {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [password]);

  const strength = useMemo(() => {
    const passed = Object.values(checks).filter(Boolean).length;
    return (passed / 5) * 100;
  }, [checks]);

  const strengthLabel = useMemo(() => {
    if (strength === 0) return { text: "", color: "" };
    if (strength <= 20) return { text: "Very Weak", color: "text-destructive" };
    if (strength <= 40) return { text: "Weak", color: "text-orange-500" };
    if (strength <= 60) return { text: "Fair", color: "text-yellow-500" };
    if (strength <= 80) return { text: "Good", color: "text-lime-500" };
    return { text: "Strong", color: "text-green-500" };
  }, [strength]);

  const progressColor = useMemo(() => {
    if (strength <= 20) return "bg-destructive";
    if (strength <= 40) return "bg-orange-500";
    if (strength <= 60) return "bg-yellow-500";
    if (strength <= 80) return "bg-lime-500";
    return "bg-green-500";
  }, [strength]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <Progress 
          value={strength} 
          className="h-2 flex-1 mr-3"
          style={{ 
            "--progress-color": progressColor 
          } as React.CSSProperties}
        />
        <span className={`text-xs font-medium ${strengthLabel.color}`}>
          {strengthLabel.text}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-1 text-xs">
        <CheckItem passed={checks.length} label="8+ characters" />
        <CheckItem passed={checks.lowercase} label="Lowercase" />
        <CheckItem passed={checks.uppercase} label="Uppercase" />
        <CheckItem passed={checks.number} label="Number" />
        <CheckItem passed={checks.special} label="Special char" />
      </div>
    </div>
  );
};

const CheckItem = ({ passed, label }: { passed: boolean; label: string }) => (
  <div className={`flex items-center gap-1 ${passed ? "text-green-600" : "text-muted-foreground"}`}>
    {passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
    <span>{label}</span>
  </div>
);

export default PasswordStrengthIndicator;
