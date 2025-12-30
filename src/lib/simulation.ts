import type { ScenarioData, SimulationResult } from '@/types';
import { averageMonthlyReturn } from '@/data/historical-scenarios';

export interface SimulationParams {
  initialAmount: number;
  monthlyContribution: number;
  scenario: ScenarioData;
}

export interface SimulationSummary {
  results: SimulationResult[];
  scenarioFinalValue: number;
  averageFinalValue: number;
  scenarioTotalReturn: number;
  averageTotalReturn: number;
  maxDrawdown: number;
  maxDrawdownMonth: number;
  totalInvested: number;
}

export function runSimulation({
  initialAmount,
  monthlyContribution,
  scenario,
}: SimulationParams): SimulationSummary {
  const results: SimulationResult[] = [];

  let scenarioValue = initialAmount;
  let averageValue = initialAmount;
  let amountInvested = initialAmount;
  let peakScenarioValue = initialAmount;
  let maxDrawdown = 0;
  let maxDrawdownMonth = 0;

  // Initial data point
  results.push({
    month: 0,
    year: scenario.startYear,
    scenarioValue,
    averageValue,
    amountInvested,
  });

  for (let i = 0; i < scenario.monthlyReturns.length; i++) {
    const monthReturn = scenario.monthlyReturns[i];
    const month = i + 1;
    const year = scenario.startYear + Math.floor(i / 12);

    // Apply returns
    scenarioValue *= 1 + monthReturn;
    averageValue *= 1 + averageMonthlyReturn;

    // Add monthly contribution (at end of month)
    scenarioValue += monthlyContribution;
    averageValue += monthlyContribution;
    amountInvested += monthlyContribution;

    // Track drawdown
    if (scenarioValue > peakScenarioValue) {
      peakScenarioValue = scenarioValue;
    }
    const currentDrawdown = (peakScenarioValue - scenarioValue) / peakScenarioValue;
    if (currentDrawdown > maxDrawdown) {
      maxDrawdown = currentDrawdown;
      maxDrawdownMonth = month;
    }

    results.push({
      month,
      year,
      scenarioValue,
      averageValue,
      amountInvested,
    });
  }

  const scenarioTotalReturn = (scenarioValue - amountInvested) / amountInvested;
  const averageTotalReturn = (averageValue - amountInvested) / amountInvested;

  return {
    results,
    scenarioFinalValue: scenarioValue,
    averageFinalValue: averageValue,
    scenarioTotalReturn,
    averageTotalReturn,
    maxDrawdown,
    maxDrawdownMonth,
    totalInvested: amountInvested,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}
