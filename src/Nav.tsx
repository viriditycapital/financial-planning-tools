import { useAppStore } from '@/store';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/cn';
import type { NavPage } from '@/types';

const navItems: { page: NavPage; label: string }[] = [
  { page: 'Home', label: 'Home' },
  { page: 'CompoundInterest', label: 'Compound Interest' },
  { page: 'BuyVsRent', label: 'Buy vs. Rent' },
  { page: 'HistoricalSimulation', label: 'Historical Simulation' },
];

export default function Nav() {
  const { currentPage, setPage } = useAppStore();

  return (
    <div className="nav-sidebar">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg text-white">Viridity</h2>
        <ThemeToggle />
      </div>

      <nav>
        <ul className="space-y-1">
          {navItems.map(({ page, label }) => (
            <li key={page}>
              <button
                onClick={() => setPage(page)}
                className={cn(
                  'nav-item w-full text-left',
                  currentPage === page && 'nav-item-active'
                )}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4 right-4 text-xs text-emerald-300 dark:text-slate-500">
        Financial Planning Tools
      </div>
    </div>
  );
}
