import React, { useCallback, useEffect, useState } from 'react';
import './buyrent.css';
import BVRTable from './BVRTable';

export default function BuyVsRent() {
  // Your own parameters
  const [equity, setEquity] = useState(500000);
  const [riskFree, setRiskFree] = useState(5);
  const [numYears, setNumYears] = useState(3);
  const [income, setIncome] = useState(300000);
  const [taxRate, setTaxRate] = useState(40);

  // Rent
  const [rent, setRent] = useState(3500);
  const [rentersInsurance, setRentersInsurance] = useState(5);

  // Buy
  const [price, setPrice] = useState(1000000);
  const [down, setDown] = useState(200000);
  const [tax, setTax] = useState(1000);
  const [cc, setCC] = useState(1000);
  const [mortgageRate, setMortgageRate] = useState(6);
  const [mortgageLoanTerm, setMortgageLoanTerm] = useState(30);
  const [isCondo, setIsCondo] = useState(true);

  const getClosingCosts = useCallback((isCondo) => {
    const bankFees = 800;
    const flipTax = price * 0.01;
    const attorney = 2500;

    let total = bankFees + flipTax + attorney;

    if (isCondo) {
      const mortgageAmount = price - down;
      const titleInsurance = 0.004 * price;
      const mortgageTitleInsurance = 0.001 * price;
      const mortgageTax = (mortgageAmount > 500000) ? 0.01925 * mortgageAmount : 0.018 * mortgageAmount;
      const titleSearchFee = 895;
      const deedRecordingFee = 285;
      const mortgageRecordingFee = 250;
      const ownerPOARecording = 100;
      const titleCloser = 300;

      total += titleInsurance + mortgageTitleInsurance + mortgageTax + titleSearchFee + deedRecordingFee + mortgageRecordingFee + ownerPOARecording + titleCloser;
    } else {
      const judgmentLienSearch = 450;
      const financingFee = 500;
      total += judgmentLienSearch + financingFee;
    }

    return total;
  }, [price, down]);

  const [closing, setClosing] = useState(getClosingCosts(isCondo));

  const getEquityReturn = useCallback((isRent = true) => {
    if (isRent) {
      return (equity * riskFree / 100) / 12;
    } else {
      return ((equity - down) * riskFree / 100) / 12;
    }
  }, [equity, riskFree, down]);

  const calculateMortgage = useCallback(() => {
    const monthlyInterestRate = mortgageRate / (12 * 100);
    const totalPayments = mortgageLoanTerm * 12;

    let principal = price - down;
    const numerator = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments);
    const denominator = Math.pow(1 + monthlyInterestRate, totalPayments) - 1;

    const monthlyPayment = numerator / denominator;

    let payments = [];
    for (let i = 0; i < totalPayments; i++) {
      let interest = principal * monthlyInterestRate;
      let balance = monthlyPayment - interest;
      payments.push(
        {
          interest: interest,
          balance: balance,
        }
      );
      principal -= balance;
    }

    return payments;
  }, [price, down, mortgageRate, mortgageLoanTerm])

  const [mortgage, setMortgage] = useState(calculateMortgage())

  const monthlyMortgage = mortgage[0]['interest'] + mortgage[0]['balance'];

  const getRentCost = useCallback(() => {
    return rent + rentersInsurance;
  }, [rent, rentersInsurance]);

  const getBuyCost = useCallback(() => {
    return monthlyMortgage + tax + cc;
  }, [price, down, mortgageRate, mortgageLoanTerm, tax, cc]);

  const [rentCost, setRentCost] = useState(getRentCost())
  const [buyCost, setBuyCost] = useState(getBuyCost())

  useEffect(() => {
    setClosing(getClosingCosts(isCondo));
  }, [price, down, isCondo, getClosingCosts]);

  useEffect(() => {
    setRentCost(getRentCost());
  }, [rent, rentersInsurance, getRentCost]);

  useEffect(() => {
    setBuyCost(getBuyCost());
  }, [price, down, tax, cc, closing, numYears, isCondo, getBuyCost]);

  useEffect(() => {
    setMortgage(calculateMortgage());
  }, [price, down, mortgageRate, mortgageLoanTerm, calculateMortgage]);

  return (
    <div className="main-content">
      <h1>Buy vs. Rent</h1>
      <div className="situation">
        <h2>Your Situation</h2>
        <div className="row">
          <label className="input-label">Equity</label>
          <input type="number" className="number-input" value={equity}
            onChange={e => setEquity(parseInt(e.target.value))}
          />
        </div>
        <div className="row">
          <label className="input-label">Income</label>
          <input type="number" className="number-input" value={income}
            onChange={e => setIncome(parseInt(e.target.value))}
          />
        </div>
        <div className="row">
          <label className="input-label">Tax Rate</label>
          <input type="number" className="number-input" value={taxRate}
            onChange={e => setTaxRate(parseInt(e.target.value))}
          />
        </div>
        <div className="row">
          <label className="input-label">Risk-Free Rate (%)</label>
          <input type="number" className="number-input" value={riskFree}
            onChange={e => setRiskFree(parseInt(e.target.value))}
          />
        </div>
        <div className="row">
          <label className="input-label">Mortgage Rate (%)</label>
          <input type="number" className="number-input" value={mortgageRate}
            onChange={e => setMortgageRate(parseInt(e.target.value))}
          />
        </div>
        <div className="row">
          <label className="input-label">Mortgage Loan Term (years)</label>
          <input type="number" className="number-input" value={mortgageLoanTerm}
            onChange={e => setMortgageLoanTerm(parseInt(e.target.value))}
          />
        </div>
        <div className="row">
          <label className="input-label">Number of Years to Live</label>
          <input type="number" className="number-input" value={numYears}
            onChange={e => setNumYears(parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className="comparison">
        <h2>Comparison Monthly</h2>
        <div className="container">
          <div id="rent" className="col halfwidth">
            <div className="row">
              <label className="input-label">Rent</label>
              <input type="number" className="number-input" value={rent}
                onChange={e => setRent(parseInt(e.target.value))}
              />
            </div>
            <div className="row">
              <label className="input-label">Renter's Insurance</label>
              <input type="number" className="number-input" value={rentersInsurance}
                onChange={e => setRentersInsurance(parseInt(e.target.value))}
              />
            </div>
          </div>
          <div id="buy" className="col halfwidth">
            <div className="row">
              <label className="input-label">Condo or Co-op?</label>
              <select value={isCondo ? "Condo" : "Co-op"} className='number-input'
                onChange={e => setIsCondo(e.target.value === "Condo")}
              >
                <option value="Condo">Condo</option>
                <option value="Co-op">Co-op</option>
              </select>
            </div>
            <div className="row">
              <label className="input-label">Purchase Price</label>
              <input type="number" className="number-input" value={price}
                onChange={e => setPrice(parseInt(e.target.value))}
              />
            </div>
            <div className="row">
              <label className="input-label">Down Payment</label>
              <input type="number" className="number-input" value={down}
                onChange={e => setDown(parseInt(e.target.value))}
              />
            </div>
            <div className="row">
              <label className="input-label">Closing</label>
              <input type="number" className="number-input" value={Math.round(closing)} disabled />
            </div>
            <div className="row">
              <label className="input-label">Mortgage</label>
              <input type="number" className="number-input" value={Math.round(monthlyMortgage)} disabled
              />
            </div>
            <div className="row">
              <label className="input-label">Tax</label>
              <input type="number" className="number-input" value={tax}
                onChange={e => setTax(parseInt(e.target.value))}
              />
            </div>
            <div className="row">
              <label className="input-label">CC/Maintenance</label>
              <input type="number" className="number-input" value={cc}
                onChange={e => setCC(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col halfwidth'>
            <div className='row'>
              <label className="input-label">Total Cost</label>
              <input type="number" className="number-input" disabled value={Math.round(rentCost)} />
            </div>
          </div>
          <div className='col halfwidth'>
            <div className='row'>
              <label className="input-label">Total Cost</label>
              <input type="number" className="number-input" disabled value={Math.round(buyCost)} />
            </div>
          </div>
        </div>
      </div>
      <h2>Equity and Income with Rent vs. Buy</h2>
      <BVRTable mortgageData={mortgage} rent={rentCost} buyCosts={buyCost} equityRent={equity} equityBuy={equity - down - closing} riskFree={riskFree} income={income} taxRate={taxRate} />
    </div >
  )
};