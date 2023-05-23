
import React from 'react';

export default function BVRTable(props) {
  let {mortgageData, rent, buyCosts, equityRent, equityBuy, riskFree, income, taxRate} = props;

  function renderTableRows() {
        let rows = [];
        const monthlyIncome = income/12;
        let balance = 0;
        for (let i = 0; i < mortgageData.length; i++) {
          let roeRent = equityRent*(riskFree/(100*12))
          let roeBuy = equityBuy*(riskFree/(100*12))
          balance += mortgageData[i]['balance'];
          rows.push(
            <tr>
              <td>{i+1}</td>
              <td>{rent}</td>
              <td>{Math.round(roeRent)}</td>
              <td>{Math.round(equityRent)}</td>
              <td>{Math.round(buyCosts)}</td>
              <td>{Math.round(mortgageData[i]['balance'])}</td>
              <td>{Math.round(roeBuy)}</td>
              <td>{Math.round(equityBuy + balance)}</td>
            </tr>
          );
          equityRent = equityRent*(1+riskFree/(100*12)) + monthlyIncome*(1-taxRate/100) - rent;
          equityBuy = equityBuy*(1+riskFree/(100*12)) + monthlyIncome*(1-taxRate/100) - buyCosts;
        }
        return rows;
      }
  return <div id="table">
    <table>
      <tr>
        <th>Month</th>
        <th>Rent</th>
        <th>ROE</th>
        <th>Equity Rent</th>
        <th>Buy Costs</th>
        <th>Balance</th>
        <th>ROE</th>
        <th>Equity Buy</th>
      </tr>
    {renderTableRows()}
    </table>
  </div>;
}