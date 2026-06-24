import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowRightLeft,
  PieChart,
  Activity,
  Zap,
  DollarSign,
  ChevronDown,
  Search,
  Plus,
  ArrowUp,
  ArrowDown,
  History,
  Shield,
} from 'lucide-react';

interface Asset {
  symbol: string;
  name: string;
  price: string;
  change: number;
  volume: string;
  chart: number[];
  type: 'crypto' | 'token';
}

const TradingTerminal: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset>({
    symbol: 'SKY4444',
    name: 'SkyCoin444',
    price: '$4.44',
    change: 12.5,
    volume: '$2.4M',
    chart: [3.2, 3.5, 3.8, 4.1, 3.9, 4.2, 4.44],
    type: 'token',
  });

  const assets: Asset[] = [
    { symbol: 'SKY4444', name: 'SkyCoin444', price: '$4.44', change: 12.5, volume: '$2.4M', chart: [3, 4, 3, 5, 4, 6, 7], type: 'token' },
    { symbol: 'BTC', name: 'Bitcoin', price: '$68,450', change: 2.4, volume: '$45B', chart: [6, 5, 7, 6, 8, 7, 9], type: 'crypto' },
    { symbol: 'ETH', name: 'Ethereum', price: '$3,840', change: -1.2, volume: '$18B', chart: [8, 7, 6, 5, 4, 3, 2], type: 'crypto' },
    { symbol: 'SOL', name: 'Solana', price: '$145.20', change: 5.8, volume: '$3.2B', chart: [2, 4, 3, 5, 6, 8, 9], type: 'crypto' },
    { symbol: 'DOGE', name: 'Dogecoin', price: '$0.15', change: 8.4, volume: '$1.2B', chart: [1, 2, 3, 4, 5, 6, 7], type: 'crypto' },
    { symbol: 'XMR', name: 'Monero', price: '$124.50', change: -0.5, volume: '$450M', chart: [5, 5, 5, 5, 4, 4, 4], type: 'crypto' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold">S</div>
            <h1 className="text-xl font-black">Trading Terminal</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {assets.slice(0, 4).map((a) => (
              <div key={a.symbol} className="flex items-center gap-2 border-r border-slate-800 pr-4 last:border-0">
                <span className="text-slate-400 font-bold">{a.symbol}</span>
                <span className="font-mono">{a.price}</span>
                <span className={a.change >= 0 ? 'text-purple-400' : 'text-red-400'}>
                  {a.change >= 0 ? '+' : ''}{a.change}%
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-purple-600/10 border border-purple-500/20 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-purple-400 uppercase">Live Market</span>
          </div>
          <button className="p-2 hover:bg-slate-800 rounded-lg transition"><Zap className="h-5 w-5 text-yellow-400" /></button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-px bg-slate-800 overflow-hidden">
        {/* Left Sidebar: Assets */}
        <div className="col-span-12 lg:col-span-3 bg-slate-950 flex flex-col">
          <div className="p-4 border-b border-slate-900">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search assets..."
                className="w-full bg-slate-900 border border-slate-800 rounded px-9 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {assets.map((asset) => (
              <div
                key={asset.symbol}
                onClick={() => setSelectedAsset(asset)}
                className={`p-4 border-b border-slate-900 hover:bg-slate-900 cursor-pointer transition ${
                  selectedAsset.symbol === asset.symbol ? 'bg-slate-900 border-l-2 border-l-purple-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{asset.symbol}</span>
                    <span className="text-xs text-slate-500">{asset.name}</span>
                  </div>
                  <span className="font-mono text-sm">{asset.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Vol: {asset.volume}</span>
                  <span className={`text-xs font-bold ${asset.change >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
                    {asset.change >= 0 ? '+' : ''}{asset.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Chart & History */}
        <div className="col-span-12 lg:col-span-6 bg-slate-950 flex flex-col border-x border-slate-900">
          {/* Asset Info Header */}
          <div className="p-6 border-b border-slate-900 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-black">{selectedAsset.symbol}/USDT</h2>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  selectedAsset.change >= 0 ? 'bg-purple-600/20 text-purple-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {selectedAsset.change}%
                </span>
              </div>
              <p className="text-slate-400 text-sm">{selectedAsset.name} Ecosystem Token</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-mono font-bold text-purple-400">{selectedAsset.price}</p>
              <p className="text-slate-500 text-xs">Last Trade: 2s ago</p>
            </div>
          </div>

          {/* Chart Area */}
          <div className="flex-1 p-6 relative bg-slate-950">
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <BarChart3 className="w-64 h-64" />
            </div>
            {/* Simulated Chart */}
            <div className="h-full w-full flex items-end gap-1">
              {selectedAsset.chart.map((val, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t transition-all duration-1000 ${
                    selectedAsset.change >= 0 ? 'bg-purple-600/20 hover:bg-purple-600/40' : 'bg-red-500/20 hover:bg-red-500/40'
                  }`}
                  style={{ height: `${val * 10}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Order History Table */}
          <div className="h-48 border-t border-slate-900 overflow-hidden flex flex-col">
            <div className="bg-slate-900 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Recent Trades</span>
              <History className="h-3 w-3" />
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="grid grid-cols-3 text-xs p-2 hover:bg-slate-900 rounded">
                  <span className={i % 2 === 0 ? 'text-purple-400' : 'text-red-400'}>
                    {selectedAsset.price}
                  </span>
                  <span className="text-center text-slate-300">{(Math.random() * 1000).toFixed(2)}</span>
                  <span className="text-right text-slate-500">12:0{i}:45</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Trading Panel */}
        <div className="col-span-12 lg:col-span-3 bg-slate-950 p-6 flex flex-col gap-6">
          {/* Trade Tabs */}
          <div className="flex bg-slate-900 rounded p-1">
            <button className="flex-1 py-2 bg-slate-800 rounded font-bold text-sm">Buy</button>
            <button className="flex-1 py-2 hover:bg-slate-800 rounded font-bold text-sm text-slate-500">Sell</button>
          </div>

          {/* Order Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Price (USDT)</label>
              <div className="relative">
                <input
                  type="text"
                  value={selectedAsset.price.replace('$', '')}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-3 font-mono focus:outline-none focus:border-purple-500"
                />
                <span className="absolute right-3 top-3 text-slate-500 text-xs">USDT</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Amount ({selectedAsset.symbol})</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-800 rounded p-3 font-mono focus:outline-none focus:border-purple-500"
                />
                <span className="absolute right-3 top-3 text-slate-500 text-xs">{selectedAsset.symbol}</span>
              </div>
            </div>

            {/* Percentage Selectors */}
            <div className="flex gap-2">
              {['25%', '50%', '75%', '100%'].map((p) => (
                <button key={p} className="flex-1 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-xs text-slate-400">
                  {p}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-900">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Total</span>
                <span className="font-bold">$0.00 USDT</span>
              </div>
              <button className="w-full py-4 bg-purple-600 hover:bg-purple-600 rounded font-black text-lg transition shadow-lg shadow-green-500/20">
                Buy {selectedAsset.symbol}
              </button>
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="mt-auto p-4 bg-slate-900/50 rounded-xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
              <Shield className="h-3 w-3 text-purple-400" />
              Wallet Balance
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">USDT</span>
                <span className="font-mono">12,450.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{selectedAsset.symbol}</span>
                <span className="font-mono">850.44</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingTerminal;
