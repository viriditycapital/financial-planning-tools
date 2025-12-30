import type { CompoundInterestDataPoint } from '@/types';

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const pctFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

interface Props {
  data: CompoundInterestDataPoint[];
  display_detail_period: boolean;
  display_detail_inflation: boolean;
}

export default function CompoundInterestTable({
  data,
  display_detail_period,
  display_detail_inflation,
}: Props) {
  const lastDataPoint = data[data.length - 1];

  return (
    <div>
      {/* Key Stats */}
      <div className="card inline-block mb-6">
        <table className="font-mono">
          <tbody>
            <tr>
              <td className="pr-8 text-slate-600 dark:text-slate-400">Final Value</td>
              <td className="font-semibold text-green-700 dark:text-green-400">
                {usdFormatter.format(lastDataPoint.value)}
              </td>
            </tr>
            <tr>
              <td className="pr-8 text-slate-600 dark:text-slate-400">Total Returns</td>
              <td className="font-semibold">
                {pctFormatter.format(lastDataPoint.returns)}
              </td>
            </tr>
            {display_detail_inflation && (
              <>
                <tr>
                  <td className="pr-8 text-slate-600 dark:text-slate-400">Value (Today's $)</td>
                  <td className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {usdFormatter.format(lastDataPoint.value_in_todays_dollars)}
                  </td>
                </tr>
                <tr>
                  <td className="pr-8 text-slate-600 dark:text-slate-400">Returns (Today's $)</td>
                  <td className="font-semibold">
                    {pctFormatter.format(lastDataPoint.returns_in_todays_dollars)}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Year</th>
              {display_detail_period && <th>Period</th>}
              <th>Amount Invested</th>
              <th>Value</th>
              <th>Returns</th>
              {display_detail_inflation && (
                <>
                  <th>Invested (Today's $)</th>
                  <th>Value (Today's $)</th>
                  <th>Returns (Today's $)</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => {
              const shouldShow = display_detail_period || d.end_of_year;
              if (!shouldShow) return null;

              return (
                <tr key={i}>
                  <td>{d.year}</td>
                  {display_detail_period && <td>{d.period}</td>}
                  <td>{usdFormatter.format(d.amount_invested)}</td>
                  <td>{usdFormatter.format(d.value)}</td>
                  <td>{pctFormatter.format(d.returns)}</td>
                  {display_detail_inflation && (
                    <>
                      <td>{usdFormatter.format(d.amount_invested_in_todays_dollars)}</td>
                      <td>{usdFormatter.format(d.value_in_todays_dollars)}</td>
                      <td>{pctFormatter.format(d.returns_in_todays_dollars)}</td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
