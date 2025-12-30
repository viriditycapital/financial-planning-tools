// Investment Period Types
export type InvestmentPeriod =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarter'
  | 'quarterly-rsu'
  | 'annually'
  | 'custom';

export interface RecurringInvestment {
  amount: number;
  period: InvestmentPeriod;
  customMonths?: number[]; // 0-11 for Jan-Dec
}

// Compound Interest Types
export interface CompoundInterestDataPoint {
  year: number | string;
  period: number | string;
  amount_invested: number;
  value: number;
  returns: number;
  amount_invested_in_todays_dollars: number;
  value_in_todays_dollars: number;
  returns_in_todays_dollars: number;
  end_of_year: boolean;
}

export interface CompoundInterestState {
  initial_amount: number;
  interest_rate: number;
  inflation_rate: number;
  num_years: number;
  recurring_investments: RecurringInvestment[];
  display_detail_period: boolean;
  display_detail_inflation: boolean;
  data: CompoundInterestDataPoint[] | undefined;
}

// Historical Simulation Types
export type HistoricalScenarioId =
  | 'lost-decade'
  | 'black-monday'
  | 'dotcom-bubble'
  | 'gfc-2008'
  | 'covid-crash';

export interface ScenarioData {
  id: HistoricalScenarioId;
  name: string;
  description: string;
  startYear: number;
  endYear: number;
  monthlyReturns: number[];
}

export interface SimulationResult {
  month: number;
  year: number;
  scenarioValue: number;
  averageValue: number;
  amountInvested: number;
}

// Buy vs Rent Types
export interface MortgagePayment {
  interest: number;
  balance: number;
}

export interface BuyVsRentState {
  equity: number;
  riskFree: number;
  numYears: number;
  income: number;
  taxRate: number;
  rent: number;
  rentersInsurance: number;
  price: number;
  down: number;
  tax: number;
  cc: number;
  mortgageRate: number;
  mortgageLoanTerm: number;
  isCondo: boolean;
}

// Navigation Types
export type NavPage = 'Home' | 'CompoundInterest' | 'BuyVsRent' | 'HistoricalSimulation';

// Theme Types
export type Theme = 'light' | 'dark';
