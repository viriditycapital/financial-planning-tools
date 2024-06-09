import React from "react";

var usd_formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

var pct_formatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function CompoundInterestTable(props) {
  return (
    <div>
      <table className="key-stats">
        <tbody>
          <tr>
            <td>Final Value</td>
            <td>
              {usd_formatter.format(props.data[props.data.length - 1].value)}
            </td>
          </tr>
          <tr>
            <td>Returns</td>
            <td>
              {pct_formatter.format(props.data[props.data.length - 1].returns)}
            </td>
          </tr>
        </tbody>
      </table>

      <br />

      <table className="data-table">
        <thead>
          <tr>
            <td>Year</td>
            {props.display_detail_period && <td>Period</td>}
            <td>Amount Invested</td>
            <td>Value</td>
            <td>Returns</td>
            {props.display_detail_inflation && (
              <>
                <td>Amount Invested (in today's $)</td>
                <td>Value (in today's $)</td>
                <td>Returns (in today's $)</td>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {props.data.map(
            (d, i) =>
              ((!props.display_detail_period && d.end_of_year) ||
                props.display_detail_period) && (
                <tr key={i}>
                  <td>{d.year}</td>
                  {props.display_detail_period && <td>{d.period}</td>}
                  <td>{usd_formatter.format(d.amount_invested)}</td>
                  <td>{usd_formatter.format(d.value)}</td>
                  <td>{pct_formatter.format(d.returns)}</td>
                  {props.display_detail_inflation && (
                    <>
                      <td>
                        {usd_formatter.format(
                          d.amount_invested_in_todays_dollars
                        )}
                      </td>
                      <td>{usd_formatter.format(d.value_in_todays_dollars)}</td>
                      <td>
                        {pct_formatter.format(d.returns_in_todays_dollars)}
                      </td>
                    </>
                  )}
                </tr>
              )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CompoundInterestTable;
