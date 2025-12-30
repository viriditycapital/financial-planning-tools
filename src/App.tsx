import { useAppStore } from '@/store';
import Nav from './Nav';
import Home from './Home';
import CompoundInterest from './compound-interest/CompoundInterest';
import BuyVsRent from './buy-vs-rent/BuyVsRent';
import HistoricalSimulation from './historical-simulation/HistoricalSimulation';
import type { NavPage } from '@/types';

const pages: Record<NavPage, JSX.Element> = {
  Home: <Home />,
  CompoundInterest: <CompoundInterest />,
  BuyVsRent: <BuyVsRent />,
  HistoricalSimulation: <HistoricalSimulation />,
};

export default function App() {
  const { currentPage } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Nav />
      <main>{pages[currentPage]}</main>
    </div>
  );
}
