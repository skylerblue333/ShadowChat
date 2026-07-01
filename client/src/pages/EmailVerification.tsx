import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Mail, CheckCircle, Loader2, AlertCircle } from "lucide-react";

export function EmailVerification() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const email = localStorage.getItem("user_email") || "";

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!code || code.length !== 6) {
        toast.error("Please enter a valid 6-digit code");
        setLoading(false);
        return;
      }
      // Mock verification
      setVerified(true);
      localStorage.setItem("email_verified", "true");
      toast.success("Email verified successfully! 🎉");
      setTimeout(() => setLocation("/"), 2000);
    } catch (error) {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      toast.success("Verification code sent to " + email);
      setResendCooldown(60);
    } catch (error) {
      toast.error("Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-green-500/20 bg-slate-900/80 backdrop-blur text-center">
          <CardContent className="pt-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
            <p className="text-slate-400 mb-6">Your email has been confirmed. Redirecting...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-purple-500/20 bg-slate-900/80 backdrop-blur">
        <CardHeader className="space-y-2 text-center">
          <Mail className="w-12 h-12 text-purple-400 mx-auto" />
          <CardTitle className="text-xl text-white">Verify Your Email</CardTitle>
          <p className="text-sm text-slate-400">We sent a code to {email}</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Verification Code</label>
              <Input
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-widest bg-slate-800 border-slate-700 text-white"
                disabled={loading}
              />
              <p className="text-xs text-slate-500">Enter the 6-digit code from your email</p>
            </div>

            <Button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-slate-400 mb-2">Didn't receive the code?</p>
              <Button
                type="button"
                variant="ghost"
                disabled={loading || resendCooldown > 0}
                onClick={handleResend}
                className="text-purple-400 hover:text-purple-300"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
              </Button>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded p-3 flex gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300">Check your spam folder if you don't see the email</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EmailVerification;
