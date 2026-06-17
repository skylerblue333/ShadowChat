import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/trading', label: 'Trading' },
    { href: '/gaming', label: 'Gaming' },
    { href: '/learning', label: 'Learning' },
    { href: '/governance', label: 'Governance' },
    { href: '/leaderboard', label: 'Leaderboard' },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 sticky top-0 z-40 border-b border-slate-700/60">
      <div className="container flex justify-between items-center">
        <Link href="/" className="font-bold text-2xl" onClick={() => setIsOpen(false)}>
          🚀 SKYCOIN4444
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`${isOpen ? 'flex flex-col absolute top-full left-0 right-0 bg-slate-900 p-4 gap-4 border-b border-slate-700 md:static md:p-0' : 'hidden'} md:flex md:flex-row gap-6`}>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="hover:text-cyan-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
