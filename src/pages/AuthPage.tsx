import { useState } from "react";
import { logActivity } from "@/lib/activityLogger";
import { useLanguage } from "@/contexts/LanguageContext";
import { register, login } from "@/lib/authClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {
  const { t } = useLanguage();
  const { refreshUser } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await register(displayName, email, password);
        toast.success(t("authSignUpSuccess"));
      } else {
        await login(email, password);
        toast.success(t("authSignInSuccess"));
        await logActivity({ action: "登入", category: "auth", detail: email });
      }
      await refreshUser();
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || t("authFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-center mb-8">
          <img src={logoImg} alt="SignCMS" className="h-11 object-contain" />
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{isSignUp ? t("authCreateAccount") : t("authWelcome")}</CardTitle>
            <CardDescription>{isSignUp ? t("authSignUpDesc") : t("authSignInDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {isSignUp && (
                <div className="space-y-1.5">
                  <Label htmlFor="displayName">{t("authDisplayName")}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="displayName" className="pl-9" placeholder={t("authNamePlaceholder")} value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" className="pl-9" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("authPassword")}</Label>
                  {!isSignUp && <Link to="/forgot-password" className="text-xs text-primary hover:underline">{t("authForgotPassword")}</Link>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type="password" className="pl-9" placeholder={t("authPasswordPlaceholder")} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isSignUp ? t("authSignUp") : t("authSignIn")}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? t("authHaveAccount") : t("authNoAccount")}
              <button type="button" className="text-primary hover:underline ml-1 font-medium" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? t("authSignIn") : t("authSignUp")}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
