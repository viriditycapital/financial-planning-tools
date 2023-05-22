import React, { useCallback, useEffect, useState } from 'react';
import './buyrent.css';

export default function BuyVsRent() {
  // Your own parameters
  const [equity, setEquity] = useState(500000);
  const [riskFree, setRiskFree] = useState(5);
  const [numYears, setNumYears] = useState(3);

  // Rent
  const [rent, setRent] = useState(3500);
  const [rentersInsurance, setRentersInsurance] = useState(5);

  // Buy
  const [price, setPrice] = useState(1000000);
  const [down, setDown] = useState(200000);
  const [tax, setTax] = useState(1000);
  const [cc, setCC] = useState(1000);
  const [mortgageRate, setMortgageRate] = useState(6);
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

  const getRentCost = useCallback(() => {
    return rent + rentersInsurance - getEquityReturn(true);
  }, [rent, rentersInsurance, getEquityReturn]);

  const getBuyCost = useCallback(() => {
    return tax + cc + (closing/12) - getEquityReturn(false);
  }, [tax, cc, closing, getEquityReturn]);

  const [rentCost, setRentCost] = useState(getRentCost())
  const [buyCost, setBuyCost] = useState(getBuyCost())

  useEffect(() => {
    setClosing(getClosingCosts(isCondo));
  }, [price, down, isCondo, getClosingCosts]);

  useEffect(() => {
    setRentCost(getRentCost());
  }, [rent, rentersInsurance, equity, riskFree, getRentCost]);

  useEffect(() => {
    setBuyCost(getBuyCost());
  }, [price, down, tax, cc, closing, numYears, equity, riskFree, isCondo, getBuyCost]);

  return (
    <div className="main-content">
      <h1>Buy vs. Rent</h1>
      <div className="situation">
        <h2>Your Situation</h2>
        <div className="row">
          <label className="input-label">Equity</label>
          <input type="number" className="number-input" value={equity}
            onChange={e => setEquity(e.target.value)}
          />
        </div>
        <div className="row">
          <label className="input-label">Risk-Free Rate (%)</label>
          <input type="number" className="number-input" value={riskFree}
            onChange={e => setRiskFree(e.target.value)}
          />
        </div>
        <div className="row">
          <label className="input-label">Mortgage Rate (%)</label>
          <input type="number" className="number-input" value={mortgageRate}
            onChange={e => setMortgageRate(e.target.value)}
          />
        </div>
        <div className="row">
          <label className="input-label">Number of Years to Live</label>
          <input type="number" className="number-input" value={numYears}
            onChange={e => setNumYears(e.target.value)}
          />
        </div>
      </div>
      <div className="comparison">
        <h2>Comparison</h2>
        <div className="row">
          <div id="rent" className="col halfwidth">
            <div className="row">
              <label className="input-label">Rent</label>
              <input type="number" className="number-input" value={rent}
                onChange={e => setRent(e.target.value)}
              />
            </div>
            <div className="row">
              <label className="input-label">Renter's Insurance</label>
              <input type="number" className="number-input" value={rentersInsurance}
                onChange={e => setRentersInsurance(e.target.value)}
              />
            </div>
            <div className="row">
              <label className="input-label">Equity Return</label>
              <input type="number" className='number-input' disabled value={(equity * riskFree / (100 * 12)).toFixed(2)} />
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
                onChange={e => setPrice(e.target.value)}
              />
            </div>
            <div className="row">
              <label className="input-label">Down Payment</label>
              <input type="number" className="number-input" value={down}
                onChange={e => setDown(e.target.value)}
              />
            </div>
            <div className="row">
              <label className="input-label">Tax</label>
              <input type="number" className="number-input" value={tax}
                onChange={e => setTax(e.target.value)}
              />
            </div>
            <div className="row">
              <label className="input-label">CC/Maintenance</label>
              <input type="number" className="number-input" value={cc}
                onChange={e => setCC(e.target.value)}
              />
            </div>
            <div className="row">
              <label className="input-label">Closing</label>
              <input type="number" className="number-input" value={(closing / (12 * numYears)).toFixed(2)} disabled />
            </div>
            <div className="row">
              <label className="input-label">Equity Return</label>
              <input type="number" className="number-input" disabled value={((equity - down) * riskFree / (100 * 12)).toFixed(2)} />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col halfwidth'>
            <div className='row'>
              <label className="input-label">Total Cost</label>
              <input type="number" className="number-input" disabled value={(rentCost).toFixed(2)} />
            </div>
          </div>
          <div className='col halfwidth'>
            <div className='row'>
              <label className="input-label">Total Cost</label>
              <input type="number" className="number-input" disabled value={(buyCost).toFixed(2)} />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2>Equity Built</h2>
        Graph here of equity built over time, and table
      </div>
    </div >
  )
};