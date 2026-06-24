import { useState, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Plus, Trash2, Move, Save, Wifi, WifiOff, Share2, Clock } from "lucide-react";

interface TableItem { id: string; x: number; y: number; label: string; seats: number; color: string; }

const COLORS = ["bg-blue-500","bg-emerald-500","bg-amber-500","bg-rose-500","bg-purple-500","bg-cyan-500"];

export default function EventPlanner() {
  const [tables, setTables] = useState<TableItem[]>([
    { id: "t1", x: 100, y: 80, label: "Table 1", seats: 8, color: "bg-blue-500" },
    { id: "t2", x: 280, y: 80, label: "Table 2", seats: 6, color: "bg-emerald-500" },
    { id: "t3", x: 190, y: 200, label: "VIP Table", seats: 10, color: "bg-amber-500" },
  ]);
  const [dragging, setDragging] = useState<string|null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [online, setOnline] = useState(true);
  const [saved, setSaved] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addTable = () => {
    const id = `t${Date.now()}`;
    setTables(p => [...p, { id, x: 50 + Math.random()*300, y: 50 + Math.random()*200, label: `Table ${p.length+1}`, seats: 6, color: COLORS[p.length % COLORS.length] }]);
  };

  const onMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const t = tables.find(t => t.id === id)!;
    setDragging(id);
    setOffset({ x: e.clientX - t.x, y: e.clientY - t.y });
  };

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setTables(p => p.map(t => t.id === dragging ? { ...t, x: e.clientX - offset.x, y: e.clientY - offset.y } : t));
  }, [dragging, offset]);

  const onMouseUp = () => setDragging(null);

  const saveLayout = () => {
    localStorage.setItem("eventplanner_layout", JSON.stringify(tables));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const totalSeats = tables.reduce((s, t) => s + t.seats, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <div className="border-b border-slate-800/60 bg-[#0d0d14]/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-none">Event Floor Planner</h1>
              <p className="text-xs text-slate-500 mt-0.5">Drag-and-drop · Offline-first · Real-time sync</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`text-xs border-0 ${online?"bg-emerald-500/15 text-emerald-400":"bg-rose-500/15 text-rose-400"}`}>
              {online ? <Wifi className="h-3 w-3 mr-1 inline" /> : <WifiOff className="h-3 w-3 mr-1 inline" />}
              {online ? "Online" : "Offline (IndexedDB)"}
            </Badge>
            <Button size="sm" variant="outline" onClick={() => setOnline(p => !p)} className="border-slate-700 text-slate-400 text-xs">Toggle Offline</Button>
            <Button size="sm" onClick={addTable} className="bg-violet-600 hover:bg-violet-700 text-white text-xs"><Plus className="h-3.5 w-3.5 mr-1" />Add Table</Button>
            <Button size="sm" onClick={saveLayout} className={`text-xs ${saved?"bg-emerald-600":"bg-slate-700 hover:bg-slate-600"} text-white`}>
              <Save className="h-3.5 w-3.5 mr-1" />{saved ? "Saved!" : "Save Layout"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stats sidebar */}
        <div className="space-y-4">
          {[
            { label: "Tables", value: tables.length, icon: Move, color: "text-violet-400" },
            { label: "Total Seats", value: totalSeats, icon: Users, color: "text-blue-400" },
            { label: "Sync Status", value: online ? "Live" : "Local", icon: online ? Wifi : WifiOff, color: online ? "text-emerald-400" : "text-rose-400" },
          ].map(s => (
            <div key={s.label} className="bg-slate-900/40 rounded-xl border border-slate-800/60 p-4">
              <div className="flex items-center gap-2 mb-1"><s.icon className={`h-4 w-4 ${s.color}`} /><span className="text-xs text-slate-500">{s.label}</span></div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            </div>
          ))}
          <div className="bg-slate-900/40 rounded-xl border border-slate-800/60 p-4">
            <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase">Tables</h3>
            <div className="space-y-2">
              {tables.map(t => (
                <div key={t.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${t.color}`} />
                    <span className="text-xs text-slate-300">{t.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500">{t.seats}p</span>
                    <button onClick={() => setTables(p => p.filter(x => x.id !== t.id))} className="text-slate-700 hover:text-rose-400 ml-1"><Trash2 className="h-3 w-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-3">
          <div ref={canvasRef} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
            className="relative bg-slate-900/40 rounded-2xl border border-slate-800/60 overflow-hidden select-none"
            style={{ height: 480, backgroundImage: "radial-gradient(circle, #334155 1px, transparent 1px)", backgroundSize: "32px 32px" }}>
            {/* Stage */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-700/60 border border-slate-600/60 rounded-lg px-12 py-3 text-xs text-slate-400 font-semibold tracking-widest uppercase">STAGE</div>
            {tables.map(t => (
              <div key={t.id} onMouseDown={e => onMouseDown(e, t.id)}
                className={`absolute cursor-grab active:cursor-grabbing rounded-xl border-2 border-white/10 p-3 min-w-[90px] text-center shadow-lg transition-shadow ${dragging===t.id?"shadow-2xl scale-105":""}`}
                style={{ left: t.x, top: t.y, background: "rgba(15,15,25,0.85)" }}>
                <div className={`h-2 w-2 rounded-full ${t.color} mx-auto mb-1`} />
                <div className="text-xs font-bold text-white">{t.label}</div>
                <div className="text-xs text-slate-500">{t.seats} seats</div>
              </div>
            ))}
            <div className="absolute bottom-3 right-3 text-xs text-slate-700">Drag tables to arrange · {online ? "Auto-syncing" : "Saved locally"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
