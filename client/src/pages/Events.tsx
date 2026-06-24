import { useState } from "react";
import { Link } from "wouter";
import { CalendarDays, Plus, Users, Clock, MapPin, Ticket, ArrowRight, Star, Video, Zap } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EVENTS = [
  {
    id: "1", title: "SKY444 Token Launch Party",
    date: "Jun 25, 2026", time: "8:00 PM UTC", type: "Virtual",
    category: "Crypto", attendees: 1240, maxAttendees: 2000,
    host: "SKYCOIN4444 Team", desc: "Celebrate the official SKY444 mainnet launch with live AMA, giveaways, and early staking bonuses.",
    tags: ["Token Launch", "AMA", "Giveaway"], featured: true, rsvp: true,
  },
  {
    id: "2", title: "AI Agents Hackathon",
    date: "Jul 4, 2026", time: "12:00 PM UTC", type: "Virtual",
    category: "AI", attendees: 567, maxAttendees: 1000,
    host: "ShadowChat Dev Team", desc: "48-hour hackathon to build AI agents on the ShadowChat platform. $50K prize pool.",
    tags: ["Hackathon", "AI", "$50K Prize"], featured: true, rsvp: false,
  },
  {
    id: "3", title: "Creator Monetization Workshop",
    date: "Jun 28, 2026", time: "3:00 PM UTC", type: "Virtual",
    category: "Creator", attendees: 312, maxAttendees: 500,
    host: "NOVA AI", desc: "Learn how to maximize earnings with subscriptions, tips, and premium content on ShadowChat.",
    tags: ["Workshop", "Monetization", "Creators"], featured: false, rsvp: true,
  },
  {
    id: "4", title: "DeFi Yield Strategies AMA",
    date: "Jun 22, 2026", time: "6:00 PM UTC", type: "Virtual",
    category: "DeFi", attendees: 891, maxAttendees: 1500,
    host: "CIPHER AI", desc: "Deep dive into yield farming, liquidity pools, and maximizing DeFi returns with SKY444.",
    tags: ["AMA", "DeFi", "Yield"], featured: false, rsvp: true,
  },
  {
    id: "5", title: "Web3 Gaming Tournament",
    date: "Jul 10, 2026", time: "2:00 PM UTC", type: "Virtual",
    category: "Gaming", attendees: 234, maxAttendees: 500,
    host: "Gaming Arena", desc: "Compete in the first ShadowChat Web3 gaming tournament with SKY444 prize pool.",
    tags: ["Tournament", "Gaming", "Prize Pool"], featured: false, rsvp: false,
  },
];

const CATEGORIES = ["All", "Crypto", "AI", "Creator", "DeFi", "Gaming"];

export default function Events() {
  const [category, setCategory] = useState("All");
  const [rsvped, setRsvped] = useState<Set<string>>(new Set(["1", "4"]));

  const filtered = EVENTS.filter(e => category === "All" || e.category === category);

  const toggleRsvp = (id: string) => {
    setRsvped(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div className="container py-8 max-w-4xl animate-page-in">
      <PageHeader
        backHref="/social"
        icon={CalendarDays}
        title="Events"
        subtitle="Upcoming AMAs, hackathons, launches, and community gatherings"
        actions={
          <Link href="/event-planner">
            <Button className="btn-primary gap-2">
              <Plus className="w-4 h-4" /> Create Event
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={CalendarDays} label="Upcoming Events" value={EVENTS.length.toString()} color="primary" />
        <StatCard icon={Ticket} label="Your RSVPs" value={rsvped.size.toString()} color="success" />
        <StatCard icon={Star} label="Featured" value="2" color="warning" />
        <StatCard icon={Users} label="Total Attendees" value="3.2K" color="accent" />
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.97] ${
              category === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-slate-700/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events */}
      <div className="space-y-4">
        {filtered.map(event => (
          <div key={event.id} className={`card p-5 transition-all hover:border-slate-700/60 ${event.featured ? "border-primary/30 bg-primary/5" : ""}`}>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-secondary/50 flex flex-col items-center justify-center shrink-0 border border-slate-700/40">
                <div className="text-xs text-muted-foreground font-medium">{event.date.split(" ")[0]}</div>
                <div className="text-lg font-black text-foreground leading-none">{event.date.split(" ")[1].replace(",", "")}</div>
                <div className="text-xs text-muted-foreground">{event.date.split(" ")[2]}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm">{event.title}</h3>
                      {event.featured && (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0.5">⭐ Featured</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>
                      <span className="flex items-center gap-1"><Video className="w-3 h-3" />{event.type}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{event.attendees.toLocaleString()} / {event.maxAttendees.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{event.desc}</p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {event.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground border border-slate-700/30">
                      {tag}
                    </span>
                  ))}
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">by {event.host}</span>
                    <button
                      onClick={() => toggleRsvp(event.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                        rsvped.has(event.id)
                          ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                          : "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
                      }`}
                    >
                      <Ticket className="w-3 h-3" />
                      {rsvped.has(event.id) ? "RSVP'd ✓" : "RSVP"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Attendance bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{event.attendees.toLocaleString()} attending</span>
                <span>{Math.round((event.attendees / event.maxAttendees) * 100)}% full</span>
              </div>
              <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-cyan-500 rounded-full transition-all"
                  style={{ width: `${Math.min((event.attendees / event.maxAttendees) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
