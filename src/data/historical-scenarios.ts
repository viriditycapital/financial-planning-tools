import type { ScenarioData } from '@/types';

// Historical S&P 500 monthly returns (approximate)
// These are based on historical data for educational simulation purposes

export const historicalScenarios: ScenarioData[] = [
  {
    id: 'lost-decade',
    name: 'Lost Decade (1970s)',
    description: 'Period of stagflation with high inflation eroding real returns. The S&P 500 had near-zero real returns for the entire decade.',
    startYear: 1970,
    endYear: 1980,
    // 120 months of approximate monthly returns
    monthlyReturns: [
      // 1970 - Bear market
      -0.076, 0.052, 0.002, -0.090, -0.060, -0.049, 0.074, 0.046, 0.033, -0.010, 0.050, 0.058,
      // 1971 - Recovery
      0.040, 0.011, 0.038, 0.037, -0.040, 0.002, -0.040, 0.040, -0.007, -0.041, 0.000, 0.087,
      // 1972 - Bull market
      0.018, 0.027, 0.007, 0.005, 0.018, -0.021, -0.004, 0.036, -0.005, 0.009, 0.047, 0.012,
      // 1973 - Oil crisis begins
      -0.017, -0.037, -0.001, -0.040, -0.019, -0.006, 0.038, -0.036, 0.040, -0.001, -0.112, 0.017,
      // 1974 - Severe bear market
      -0.010, -0.003, -0.023, -0.039, -0.032, -0.014, -0.078, -0.090, -0.119, 0.165, -0.053, -0.020,
      // 1975 - Recovery
      0.123, 0.060, 0.022, 0.048, 0.045, 0.045, -0.066, -0.021, -0.034, 0.062, 0.027, -0.011,
      // 1976 - Continued recovery
      0.119, -0.011, 0.031, -0.010, -0.013, 0.042, -0.008, -0.004, 0.022, -0.022, -0.007, 0.052,
      // 1977 - Flat
      -0.050, -0.020, -0.013, 0.000, -0.023, 0.046, -0.016, -0.021, -0.002, -0.042, 0.029, 0.003,
      // 1978 - Volatile
      -0.061, -0.025, 0.025, 0.086, 0.005, -0.017, 0.054, 0.028, -0.007, -0.091, 0.019, 0.016,
      // 1979 - Inflation concerns
      0.040, -0.035, 0.056, 0.002, -0.024, 0.040, 0.010, 0.054, 0.000, -0.066, 0.043, 0.017,
    ],
  },
  {
    id: 'black-monday',
    name: 'Black Monday (1987)',
    description: 'October 19, 1987 saw the largest single-day percentage decline in stock market history (-22.6%). Markets recovered relatively quickly.',
    startYear: 1987,
    endYear: 1989,
    // 24 months
    monthlyReturns: [
      // 1987
      0.132, 0.039, 0.028, -0.010, 0.009, 0.049, 0.049, 0.036, -0.023, -0.217, -0.084, 0.074,
      // 1988 - Recovery
      0.041, 0.045, -0.031, 0.010, 0.007, 0.044, -0.005, -0.036, 0.041, 0.027, -0.017, 0.016,
    ],
  },
  {
    id: 'dotcom-bubble',
    name: 'Dot-com Bubble (2000-2002)',
    description: 'The technology bubble burst, leading to a ~78% decline in the NASDAQ and ~49% decline in the S&P 500 over nearly 3 years.',
    startYear: 2000,
    endYear: 2003,
    // 48 months
    monthlyReturns: [
      // 2000 - Bubble bursting
      -0.051, -0.020, 0.097, -0.031, -0.022, 0.024, -0.016, 0.060, -0.053, -0.004, -0.080, 0.004,
      // 2001 - Continued decline + 9/11
      0.035, -0.092, -0.064, 0.077, 0.006, -0.025, -0.011, -0.064, -0.081, 0.018, 0.076, 0.008,
      // 2002 - Bottom
      -0.015, -0.020, 0.037, -0.061, -0.009, -0.073, -0.079, 0.006, -0.110, 0.087, 0.057, -0.060,
      // 2003 - Recovery begins
      -0.027, -0.017, 0.008, 0.081, 0.051, 0.011, 0.017, 0.018, -0.012, 0.055, 0.007, 0.051,
    ],
  },
  {
    id: 'gfc-2008',
    name: 'Global Financial Crisis (2008-2009)',
    description: 'The housing bubble and banking crisis led to a ~57% decline in the S&P 500. Recovery took about 4 years to reach previous highs.',
    startYear: 2007,
    endYear: 2010,
    // 48 months
    monthlyReturns: [
      // 2007 - Peak and early signs
      0.015, -0.020, 0.010, 0.043, 0.033, -0.017, -0.032, 0.013, 0.036, 0.015, -0.044, -0.009,
      // 2008 - Crisis unfolds
      -0.061, -0.035, -0.006, 0.048, 0.011, -0.086, -0.010, 0.012, -0.090, -0.169, -0.074, 0.008,
      // 2009 - Bottom in March, recovery
      -0.086, -0.109, 0.086, 0.094, 0.055, 0.002, 0.074, 0.036, 0.037, -0.019, 0.060, 0.019,
      // 2010 - Continued recovery
      -0.037, 0.030, 0.060, 0.015, -0.082, -0.052, 0.069, -0.046, 0.088, 0.037, 0.000, 0.066,
    ],
  },
  {
    id: 'covid-crash',
    name: 'COVID-19 Crash (2020)',
    description: 'The pandemic caused a rapid 34% decline in just 23 trading days, followed by the fastest recovery in market history.',
    startYear: 2020,
    endYear: 2021,
    // 24 months
    monthlyReturns: [
      // 2020 - Crash and V-shaped recovery
      -0.002, -0.083, -0.125, 0.127, 0.045, 0.019, 0.056, 0.070, -0.039, -0.028, 0.108, 0.037,
      // 2021 - Bull market continues
      -0.011, 0.027, 0.042, 0.053, 0.006, 0.023, 0.023, 0.030, -0.048, 0.069, -0.008, 0.044,
    ],
  },
];

// Average historical S&P 500 annual return (for comparison)
export const averageAnnualReturn = 0.10; // 10% average
export const averageMonthlyReturn = Math.pow(1 + averageAnnualReturn, 1 / 12) - 1;
