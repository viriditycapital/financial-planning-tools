import { useAppStore } from '@/store';
import type { NavPage } from '@/types';

const tools: { page: NavPage; title: string; description: string }[] = [
  {
    page: 'CompoundInterest',
    title: 'Compound Interest',
    description: 'Calculate investment growth over time with recurring contributions and inflation adjustment.',
  },
  {
    page: 'BuyVsRent',
    title: 'Buy vs. Rent',
    description: 'Compare the financial outcomes of buying a home versus renting.',
  },
  {
    page: 'HistoricalSimulation',
    title: 'Historical Simulation',
    description: 'See how your portfolio would have performed during major market events.',
  },
];

export default function Home() {
  const setPage = useAppStore((state) => state.setPage);

  return (
    <div className="main-content">
      <h1 className="text-3xl font-bold mb-6">Viridity Financial Planning Tools</h1>

      <div className="card max-w-2xl">
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Welcome to Viridity's financial planning tools. Use these calculators to plan your
          investments, compare buying vs. renting, and simulate how your portfolio would perform
          during historical market events.
        </p>

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
          This is not intended to be investment advice.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        {tools.map(({ page, title, description }) => (
          <button
            key={page}
            onClick={() => setPage(page)}
            className="card text-left hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer"
          >
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
