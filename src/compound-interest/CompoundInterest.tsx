import { useState, useCallback } from 'react';
import calcCompoundInterestTable, { monthNames } from './calc';
import CompoundInterestGraph from './CompoundInterestGraph';
import CompoundInterestTable from './CompoundInterestTable';
import { cn } from '@/lib/cn';
import type { InvestmentPeriod, CompoundInterestDataPoint } from '@/types';

interface RecurringInvestmentState {
  amount: number;
  period: InvestmentPeriod;
  customMonths?: number[];
}

const periodLabels: Record<InvestmentPeriod, string> = {
  daily: 'Day',
  weekly: 'Week',
  biweekly: 'Two Weeks',
  monthly: 'Month',
  quarter: 'Quarter (Jan/Apr/Jul/Oct)',
  'quarterly-rsu': 'Quarter - RSU (Feb/May/Aug/Nov)',
  annually: 'Year',
  custom: 'Custom Months...',
};

export default function CompoundInterest() {
  const [initialAmount, setInitialAmount] = useState(5000);
  const [interestRate, setInterestRate] = useState(0.1);
  const [inflationRate, setInflationRate] = useState(0.03);
  const [numYears, setNumYears] = useState(10);
  const [recurringInvestments, setRecurringInvestments] = useState<RecurringInvestmentState[]>([
    { amount: 1000, period: 'annually' },
  ]);
  const [displayDetailPeriod, setDisplayDetailPeriod] = useState(false);
  const [displayDetailInflation, setDisplayDetailInflation] = useState(false);
  const [data, setData] = useState<CompoundInterestDataPoint[] | undefined>();

  const calc = useCallback(() => {
    setData(
      calcCompoundInterestTable(
        initialAmount,
        interestRate,
        inflationRate,
        numYears,
        recurringInvestments.map((inv) => inv.amount),
        recurringInvestments.map((inv) => inv.period),
        recurringInvestments.map((inv) => inv.customMonths)
      )
    );
  }, [initialAmount, interestRate, inflationRate, numYears, recurringInvestments]);

  const updateInvestment = (index: number, key: keyof RecurringInvestmentState, value: number | InvestmentPeriod | number[]) => {
    setRecurringInvestments((prev) =>
      prev.map((inv, i) => (i === index ? { ...inv, [key]: value } : inv))
    );
  };

  const toggleCustomMonth = (index: number, month: number) => {
    setRecurringInvestments((prev) =>
      prev.map((inv, i) => {
        if (i !== index) return inv;
        const currentMonths = inv.customMonths || [];
        const newMonths = currentMonths.includes(month)
          ? currentMonths.filter((m) => m !== month)
          : [...currentMonths, month].sort((a, b) => a - b);
        return { ...inv, customMonths: newMonths };
      })
    );
  };

  const addRecurringInvestment = () => {
    setRecurringInvestments((prev) => [...prev, { amount: 1000, period: 'annually' }]);
  };

  const removeRecurringInvestment = (index: number) => {
    setRecurringInvestments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="main-content">
      <h1 className="text-3xl font-bold mb-6">Compound Interest Calculator</h1>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="label">Initial Investment ($)</label>
            <input
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(Number(e.target.value))}
              className="input"
            />
          </div>
          <div>
            <label className="label">Number of Years</label>
            <input
              type="number"
              value={numYears}
              onChange={(e) => setNumYears(Number(e.target.value))}
              className="input"
            />
          </div>
          <div>
            <label className="label">Interest Rate (%)</label>
            <input
              type="number"
              value={interestRate * 100}
              onChange={(e) => setInterestRate(Number(e.target.value) / 100)}
              className="input"
              step="0.1"
            />
          </div>
          <div>
            <label className="label">Inflation Rate (%)</label>
            <input
              type="number"
              value={inflationRate * 100}
              onChange={(e) => setInflationRate(Number(e.target.value) / 100)}
              className="input"
              step="0.1"
            />
          </div>
        </div>

        {/* Recurring Investments */}
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold text-lg">Recurring Investments</h3>
          {recurringInvestments.map((investment, index) => (
            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="label">Amount ($)</label>
                  <input
                    type="number"
                    value={investment.amount}
                    onChange={(e) => updateInvestment(index, 'amount', Number(e.target.value))}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Every</label>
                  <select
                    value={investment.period}
                    onChange={(e) => updateInvestment(index, 'period', e.target.value as InvestmentPeriod)}
                    className="select"
                  >
                    {Object.entries(periodLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  {index > 0 && (
                    <button
                      onClick={() => removeRecurringInvestment(index)}
                      className="btn btn-danger"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Custom months selector */}
              {investment.period === 'custom' && (
                <div className="mt-4">
                  <label className="label">Select months:</label>
                  <div className="flex flex-wrap gap-2">
                    {monthNames.map((month, monthIndex) => (
                      <label
                        key={month}
                        className={cn(
                          'flex items-center gap-1 px-3 py-1 rounded cursor-pointer transition-colors',
                          investment.customMonths?.includes(monthIndex)
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={investment.customMonths?.includes(monthIndex) || false}
                          onChange={() => toggleCustomMonth(index, monthIndex)}
                          className="sr-only"
                        />
                        {month}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={calc} className="btn btn-primary">
          Calculate
        </button>
        <button
          onClick={() => setDisplayDetailPeriod(!displayDetailPeriod)}
          className={cn('btn', displayDetailPeriod ? 'btn-primary' : 'btn-secondary')}
        >
          {displayDetailPeriod ? '\u25A0' : '\u25A1'} Break Down by Time
        </button>
        <button
          onClick={() => setDisplayDetailInflation(!displayDetailInflation)}
          className={cn('btn', displayDetailInflation ? 'btn-primary' : 'btn-secondary')}
        >
          {displayDetailInflation ? '\u25A0' : '\u25A1'} Compare Against Today's Dollars
        </button>
        <button onClick={addRecurringInvestment} className="btn btn-secondary">
          + Add Recurring Investment
        </button>
      </div>

      {/* Results */}
      {data && (
        <>
          <CompoundInterestGraph data={data} display_detail_inflation={displayDetailInflation} />
          <CompoundInterestTable
            data={data}
            display_detail_period={displayDetailPeriod}
            display_detail_inflation={displayDetailInflation}
          />
        </>
      )}
    </div>
  );
}
