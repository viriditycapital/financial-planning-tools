import type { InvestmentPeriod, CompoundInterestDataPoint } from '@/types';

// Days of year for each period type
const periodDays: Record<Exclude<InvestmentPeriod, 'custom'>, number[]> = {
  daily: Array.from({ length: 365 }, (_, i) => i),
  weekly: Array.from({ length: 52 }, (_, i) => Math.floor(i * 7)),
  biweekly: Array.from({ length: 26 }, (_, i) => Math.floor(i * 14)),
  monthly: [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
  quarter: [0, 91, 182, 273], // Jan, Apr, Jul, Oct (standard quarters)
  'quarterly-rsu': [46, 135, 227, 319], // Feb 15, May 15, Aug 15, Nov 15 (RSU vest pattern)
  annually: [0],
};

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// Get the day of year for a given month (15th of the month)
function getDayOfYear(month: number): number {
  const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let day = 15; // 15th of the month
  for (let i = 0; i < month; i++) {
    day += daysInMonths[i];
  }
  return day;
}

// Get days for a period, including custom months
function getDaysForPeriod(period: InvestmentPeriod, customMonths?: number[]): number[] {
  if (period === 'custom' && customMonths && customMonths.length > 0) {
    return customMonths.map(getDayOfYear).sort((a, b) => a - b);
  }
  return periodDays[period as Exclude<InvestmentPeriod, 'custom'>] || [0];
}

export { monthNames };

export default function calcCompoundInterestTable(
  initialAmount = 0,
  interestRate = 0.1,
  inflationRate = 0.03,
  numYears = 50,
  recurringInvestments: number[] = [0],
  recurringInvestmentPeriods: InvestmentPeriod[] = ['annually'],
  customMonthsPerInvestment: (number[] | undefined)[] = []
): CompoundInterestDataPoint[] {
  const compoundInterestData: CompoundInterestDataPoint[] = [];

  // Initial data point
  compoundInterestData.push({
    year: '-',
    period: '-',
    amount_invested: initialAmount,
    value: initialAmount,
    returns: 0,
    amount_invested_in_todays_dollars: initialAmount,
    value_in_todays_dollars: initialAmount,
    returns_in_todays_dollars: 0,
    end_of_year: true,
  });

  let currentAmountInvested = initialAmount;
  let currentValue = initialAmount;
  let currentAmountInvestedInTodaysDollars = initialAmount;
  let inflationMultiplier = 1;
  let period = 0;

  for (let year = 1; year <= numYears; year++) {
    // Combine all recurring investments for this year
    const recurringInvestmentsCombined: { period: number; amount: number }[] = [];

    for (let i = 0; i < recurringInvestments.length; i++) {
      const recurringInvestment = recurringInvestments[i];
      const recurringInvestmentPeriod = recurringInvestmentPeriods[i];
      const customMonths = customMonthsPerInvestment[i];

      const days = getDaysForPeriod(recurringInvestmentPeriod, customMonths);

      for (const day of days) {
        recurringInvestmentsCombined.push({
          period: day,
          amount: recurringInvestment,
        });
      }
    }

    // Sort by period (day of year)
    recurringInvestmentsCombined.sort((a, b) => a.period - b.period);

    // Fold/combine investments that occur on the same day
    const folded: { period: number; amount: number }[] = [];
    for (const inv of recurringInvestmentsCombined) {
      if (folded.length > 0 && folded[folded.length - 1].period === inv.period) {
        folded[folded.length - 1].amount += inv.amount;
      } else {
        folded.push({ ...inv });
      }
    }

    // If no investments, still need to process year-end
    if (folded.length === 0) {
      folded.push({ period: 365, amount: 0 });
    }

    // Process each investment period
    for (let i = 0; i < folded.length; i++) {
      // Calculate time delta for interest accrual
      let interestRateDelta: number;
      if (i === 0) {
        interestRateDelta = (365 - period + folded[0].period) / 365;
      } else {
        interestRateDelta = (folded[i].period - folded[i - 1].period) / 365;
      }

      // Apply interest rates/inflation
      period = folded[i].period;
      currentValue *= 1 + interestRate * interestRateDelta;
      inflationMultiplier *= 1 + inflationRate * interestRateDelta;

      // Deflate the money
      const deflatedCurrentValue = currentValue / inflationMultiplier;

      // Add recurring investment
      const currentAmount = folded[i].amount;
      currentAmountInvested += currentAmount;
      currentValue += currentAmount;

      const currentValueInTodaysDollars = deflatedCurrentValue + currentAmount;
      currentAmountInvestedInTodaysDollars += currentAmount / inflationMultiplier;

      compoundInterestData.push({
        year: year,
        period: period,
        amount_invested: currentAmountInvested,
        value: currentValue,
        returns: currentValue / currentAmountInvested - 1,
        amount_invested_in_todays_dollars: currentAmountInvestedInTodaysDollars,
        value_in_todays_dollars: currentValueInTodaysDollars,
        returns_in_todays_dollars:
          currentValueInTodaysDollars / currentAmountInvestedInTodaysDollars - 1,
        end_of_year: i === folded.length - 1,
      });
    }
  }

  return compoundInterestData;
}
