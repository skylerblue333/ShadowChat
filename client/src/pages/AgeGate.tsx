import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function AgeGate() {
  const [, navigate] = useLocation();
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    // Store age verification in sessionStorage
    sessionStorage.setItem("age_verified", "true");
    setConfirmed(true);
    setTimeout(() => navigate("/nsfw-feed"), 1200);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#050308] flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-black text-white mb-2">Age Verified</h2>
          <p className="text-slate-400 text-sm">Redirecting to ShadowFans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050308] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full">
        {/* Warning card */}
        <div className="bg-slate-900 border border-red-500/30 rounded-2xl overflow-hidden">
          {/* Top bar */}
          <div className="bg-red-900/20 border-b border-red-500/20 px-6 py-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-sm font-bold text-red-300">Adult Content Warning</span>
          </div>

          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-red-600/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-red-400" />
            </div>

            <h1 className="text-2xl font-black text-white mb-3">Age Verification Required</h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The content you are attempting to access is intended for adults aged <strong className="text-white">18 years or older</strong>. By proceeding, you confirm that you meet this age requirement and that viewing adult content is legal in your jurisdiction.
            </p>

            {/* Legal notice */}
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  This platform complies with 18 U.S.C. § 2257 (Record-Keeping Requirements). All performers depicted are at least 18 years of age. Records are maintained by the content custodian.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleConfirm}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 text-base"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                I am 18 or older — Enter
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 py-3"
                >
                  I am under 18 — Exit
                </Button>
              </Link>
            </div>

            <p className="text-[11px] text-slate-600 mt-4">
              By clicking "Enter" you agree to our{" "}
              <span className="text-slate-500 underline cursor-pointer">Terms of Service</span>
              {" "}and{" "}
              <span className="text-slate-500 underline cursor-pointer">Content Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
