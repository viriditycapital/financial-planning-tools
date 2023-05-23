
import React from 'react';

export default function BVRTable(props) {
  let {mortgageData, rent, buyCosts, equityRent, equityBuy, riskFree, income, taxRate} = props;

  function renderTableRows() {
        let rows = [];
        const monthlyIncome = income/12;
        for (let i = 0; i < mortgageData.length; i++) {
          rows.push(
            <tr>
              <td>{i+1}</td>
              <td>{rent}</td>
              <td>{Math.round(equityRent)}</td>
              <td>{Math.round(buyCosts)}</td>
              <td>{Math.round(mortgageData[i]['balance'])}</td>
              <td>{Math.round(equityBuy)}</td>
            </tr>
          );
          // TODO: there is a bug here where we don't account for spending into the rent equity
          equityRent = equityRent*(1+riskFree/(100*12)) + monthlyIncome*(1-taxRate/100) - rent;
          equityBuy = equityBuy*(1+riskFree/(100*12)) + monthlyIncome*(1-taxRate/100) - buyCosts + mortgageData[i]['balance'];
        }
        return rows;
      }
  return <div id="table">
    <table>
      <tr>
        <th>Month</th>
        <th>Rent Costs</th>
        <th>Equity Rent</th>
        <th>Buy Costs</th>
        <th>Balance Payment</th>
        <th>Equity Buy</th>
      </tr>
    {renderTableRows()}
    </table>
  </div>;
}