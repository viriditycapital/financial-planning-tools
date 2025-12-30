import type { MortgagePayment } from '@/types';

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

interface Props {
  mortgageData: MortgagePayment[];
  rent: number;
  buyCosts: number;
  equityRent: number;
  equityBuy: number;
  riskFree: number;
  income: number;
  taxRate: number;
}

export default function BVRTable({
  mortgageData,
  rent,
  buyCosts,
  equityRent: initialEquityRent,
  equityBuy: initialEquityBuy,
  riskFree,
  income,
  taxRate,
}: Props) {
  const monthlyIncome = income / 12;
  let equityRent = initialEquityRent;
  let equityBuy = initialEquityBuy;
  let balance = 0;

  const rows = mortgageData.map((payment, i) => {
    const roeRent = (equityRent * riskFree) / (100 * 12);
    const roeBuy = (equityBuy * riskFree) / (100 * 12);
    balance += payment.balance;

    const row = {
      month: i + 1,
      rent,
      roeRent: Math.round(roeRent),
      equityRent: Math.round(equityRent),
      buyCosts,
      principalPaid: Math.round(payment.balance),
      roeBuy: Math.round(roeBuy),
      equityBuy: Math.round(equityBuy + balance),
    };

    // Update for next iteration
    equityRent = equityRent * (1 + riskFree / (100 * 12)) + monthlyIncome * (1 - taxRate / 100) - rent;
    equityBuy = equityBuy * (1 + riskFree / (100 * 12)) + monthlyIncome * (1 - taxRate / 100) - buyCosts;

    return row;
  });

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Month</th>
            <th colSpan={3} className="text-center bg-blue-50 dark:bg-blue-900/30">Rent</th>
            <th colSpan={4} className="text-center bg-green-50 dark:bg-green-900/30">Buy</th>
          </tr>
          <tr>
            <th></th>
            <th className="bg-blue-50 dark:bg-blue-900/30">Cost</th>
            <th className="bg-blue-50 dark:bg-blue-900/30">ROE</th>
            <th className="bg-blue-50 dark:bg-blue-900/30">Equity</th>
            <th className="bg-green-50 dark:bg-green-900/30">Cost</th>
            <th className="bg-green-50 dark:bg-green-900/30">Principal</th>
            <th className="bg-green-50 dark:bg-green-900/30">ROE</th>
            <th className="bg-green-50 dark:bg-green-900/30">Equity</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.month}>
              <td>{row.month}</td>
              <td>{usdFormatter.format(row.rent)}</td>
              <td>{usdFormatter.format(row.roeRent)}</td>
              <td className="font-semibold">{usdFormatter.format(row.equityRent)}</td>
              <td>{usdFormatter.format(row.buyCosts)}</td>
              <td>{usdFormatter.format(row.principalPaid)}</td>
              <td>{usdFormatter.format(row.roeBuy)}</td>
              <td className="font-semibold">{usdFormatter.format(row.equityBuy)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
