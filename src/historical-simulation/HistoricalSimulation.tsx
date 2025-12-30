import { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import '@/lib/chartjs';
import { historicalScenarios } from '@/data/historical-scenarios';
import { runSimulation, formatCurrency, formatPercent } from '@/lib/simulation';
import { cn } from '@/lib/cn';
import type { HistoricalScenarioId, ScenarioData } from '@/types';

function ScenarioCard({
  scenario,
  selected,
  onSelect,
}: {
  scenario: ScenarioData;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'card text-left transition-all',
        selected
          ? 'ring-2 ring-green-500 border-green-500'
          : 'hover:border-slate-400 dark:hover:border-slate-500'
      )}
    >
      <h3 className="font-semibold text-lg mb-1">{scenario.name}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
        {scenario.description}
      </p>
      <p className="text-xs text-slate-500">
        {scenario.startYear} - {scenario.endYear} ({scenario.monthlyReturns.length} months)
      </p>
    </button>
  );
}

export default function HistoricalSimulation() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<HistoricalScenarioId | null>(null);
  const [initialAmount, setInitialAmount] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);

  const selectedScenario = useMemo(
    () => historicalScenarios.find((s) => s.id === selectedScenarioId) || null,
    [selectedScenarioId]
  );

  const simulation = useMemo(() => {
    if (!selectedScenario) return null;
    return runSimulation({
      initialAmount,
      monthlyContribution,
      scenario: selectedScenario,
    });
  }, [selectedScenario, initialAmount, monthlyContribution]);

  const chartData: ChartData<'line'> | null = useMemo(() => {
    if (!simulation || !selectedScenario) return null;

    return {
      labels: simulation.results.map((r) =>
        r.month === 0 ? 'Start' : `Month ${r.month}`
      ),
      datasets: [
        {
          label: `${selectedScenario.name}`,
          data: simulation.results.map((r) => Math.round(r.scenarioValue)),
          borderColor: 'rgb(220, 38, 38)',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          fill: false,
          tension: 0.1,
        },
        {
          label: 'Average Returns (10%/yr)',
          data: simulation.results.map((r) => Math.round(r.averageValue)),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: false,
          tension: 0.1,
          borderDash: [5, 5],
        },
        {
          label: 'Amount Invested',
          data: simulation.results.map((r) => Math.round(r.amountInvested)),
          borderColor: 'rgb(156, 163, 175)',
          backgroundColor: 'rgba(156, 163, 175, 0.1)',
          fill: false,
          borderDash: [2, 2],
        },
      ],
    };
  }, [simulation, selectedScenario]);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: true,
        text: 'Portfolio Value Over Time',
        font: { size: 18, family: 'Source Sans Pro' },
      },
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${formatCurrency(context.raw as number)}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
        ticks: {
          maxTicksLimit: 12,
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => formatCurrency(value as number),
        },
      },
    },
  };

  return (
    <div className="main-content">
      <h1 className="text-3xl font-bold mb-2">Historical Scenario Simulation</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        See how your portfolio would have performed during major market events. Compare against
        average historical returns (10%/year).
      </p>

      {/* Scenario Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {historicalScenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            selected={selectedScenarioId === scenario.id}
            onSelect={() => setSelectedScenarioId(scenario.id)}
          />
        ))}
      </div>

      {selectedScenario && (
        <>
          {/* Input Parameters */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Simulation Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Initial Investment ($)</label>
                <input
                  type="number"
                  className="input"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(Number(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="label">Monthly Contribution ($)</label>
                <input
                  type="number"
                  className="input"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Results */}
          {simulation && (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="card text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Invested</p>
                  <p className="text-xl font-bold">{formatCurrency(simulation.totalInvested)}</p>
                </div>
                <div className="card text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Final Value ({selectedScenario.name.split(' ')[0]})
                  </p>
                  <p
                    className={cn(
                      'text-xl font-bold',
                      simulation.scenarioFinalValue >= simulation.totalInvested
                        ? 'text-green-600'
                        : 'text-red-600'
                    )}
                  >
                    {formatCurrency(simulation.scenarioFinalValue)}
                  </p>
                  <p className="text-sm text-slate-500">
                    ({formatPercent(simulation.scenarioTotalReturn)} return)
                  </p>
                </div>
                <div className="card text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Final Value (Avg 10%/yr)
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(simulation.averageFinalValue)}
                  </p>
                  <p className="text-sm text-slate-500">
                    ({formatPercent(simulation.averageTotalReturn)} return)
                  </p>
                </div>
                <div className="card text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Max Drawdown</p>
                  <p className="text-xl font-bold text-red-600">
                    {formatPercent(simulation.maxDrawdown)}
                  </p>
                  <p className="text-sm text-slate-500">at month {simulation.maxDrawdownMonth}</p>
                </div>
              </div>

              {/* Chart */}
              {chartData && (
                <div className="card mb-6">
                  <Line data={chartData} options={chartOptions} />
                </div>
              )}

              {/* Key Insights */}
              <div className="card">
                <h3 className="font-semibold text-lg mb-3">Key Insights</h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>
                    <span className="font-medium">Difference:</span> The{' '}
                    {selectedScenario.name.split('(')[0].trim()} scenario resulted in{' '}
                    <span
                      className={cn(
                        'font-semibold',
                        simulation.scenarioFinalValue >= simulation.averageFinalValue
                          ? 'text-green-600'
                          : 'text-red-600'
                      )}
                    >
                      {formatCurrency(
                        Math.abs(simulation.scenarioFinalValue - simulation.averageFinalValue)
                      )}{' '}
                      {simulation.scenarioFinalValue >= simulation.averageFinalValue ? 'more' : 'less'}
                    </span>{' '}
                    than average returns.
                  </li>
                  <li>
                    <span className="font-medium">Dollar-Cost Averaging:</span> Your $
                    {monthlyContribution.toLocaleString()}/month contributions helped reduce the
                    impact of volatility by buying more shares when prices were low.
                  </li>
                  {simulation.maxDrawdown > 0.2 && (
                    <li>
                      <span className="font-medium">Volatility Warning:</span> This scenario had a
                      significant drawdown of {formatPercent(simulation.maxDrawdown)}. Staying
                      invested through such periods requires strong conviction.
                    </li>
                  )}
                  <li>
                    <span className="font-medium">Time Horizon:</span> This simulation covers{' '}
                    {selectedScenario.monthlyReturns.length} months (
                    {(selectedScenario.monthlyReturns.length / 12).toFixed(1)} years). Longer
                    investment horizons typically reduce sequence-of-returns risk.
                  </li>
                </ul>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
