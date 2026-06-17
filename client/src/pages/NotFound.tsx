import { Button } from "@/components/ui/button";
import { Compass, Home, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";

const QUICK_LINKS: { href: string; label: string }[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/trading", label: "Trading" },
  { href: "/gaming", label: "Gaming" },
  { href: "/learning", label: "Learning" },
  { href: "/governance", label: "Governance" },
  { href: "/analytics", label: "Analytics" },
  { href: "/charity", label: "Charity" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function NotFound() {
  const [location, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-16">
      <div className="w-full max-w-2xl text-center">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-fuchsia-600 flex items-center justify-center shadow-2xl">
              <Compass className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        <p className="text-sm font-medium tracking-widest text-cyan-400 uppercase mb-3">
          Lost in the ecosystem
        </p>
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-slate-100 mb-3">
          This page drifted off the map
        </h2>
        <p className="text-slate-400 mb-2 leading-relaxed max-w-md mx-auto">
          We couldn't find{" "}
          <code className="text-fuchsia-300 break-all">{location}</code>. Pick a
          destination below and you'll be right back on course.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 mb-10">
          <Button
            onClick={() => setLocation("/")}
            className="bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:opacity-90 text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="border-slate-700 text-slate-200 hover:bg-slate-800 px-6 py-2.5 rounded-xl"
          >
            Go Back
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-200 transition-all duration-200 hover:border-cyan-500/60 hover:bg-slate-800/80"
            >
              <span>{link.label}</span>
              <ArrowRight className="h-4 w-4 text-slate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-cyan-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
