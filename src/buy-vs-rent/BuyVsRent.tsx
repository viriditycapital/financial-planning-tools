import { useCallback, useEffect, useState } from 'react';
import BVRTable from './BVRTable';
import type { MortgagePayment } from '@/types';

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

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

  const getClosingCosts = useCallback(
    (condoType: boolean) => {
      const bankFees = 800;
      const flipTax = price * 0.01;
      const attorney = 2500;

      let total = bankFees + flipTax + attorney;

      if (condoType) {
        const mortgageAmount = price - down;
        const titleInsurance = 0.004 * price;
        const mortgageTitleInsurance = 0.001 * price;
        const mortgageTax = mortgageAmount > 500000 ? 0.01925 * mortgageAmount : 0.018 * mortgageAmount;
        const titleSearchFee = 895;
        const deedRecordingFee = 285;
        const mortgageRecordingFee = 250;
        const ownerPOARecording = 100;
        const titleCloser = 300;

        total +=
          titleInsurance +
          mortgageTitleInsurance +
          mortgageTax +
          titleSearchFee +
          deedRecordingFee +
          mortgageRecordingFee +
          ownerPOARecording +
          titleCloser;
      } else {
        const judgmentLienSearch = 450;
        const financingFee = 500;
        total += judgmentLienSearch + financingFee;
      }

      return total;
    },
    [price, down]
  );

  const [closing, setClosing] = useState(getClosingCosts(isCondo));

  const calculateMortgage = useCallback((): MortgagePayment[] => {
    const monthlyInterestRate = mortgageRate / (12 * 100);
    const totalPayments = mortgageLoanTerm * 12;

    let principal = price - down;
    const numerator = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments);
    const denominator = Math.pow(1 + monthlyInterestRate, totalPayments) - 1;

    const monthlyPayment = numerator / denominator;

    const payments: MortgagePayment[] = [];
    for (let i = 0; i < totalPayments; i++) {
      const interest = principal * monthlyInterestRate;
      const balance = monthlyPayment - interest;
      payments.push({ interest, balance });
      principal -= balance;
    }

    return payments;
  }, [price, down, mortgageRate, mortgageLoanTerm]);

  const [mortgage, setMortgage] = useState<MortgagePayment[]>(calculateMortgage());

  const monthlyMortgage = mortgage[0].interest + mortgage[0].balance;

  const getRentCost = useCallback(() => {
    return rent + rentersInsurance;
  }, [rent, rentersInsurance]);

  const getBuyCost = useCallback(() => {
    return monthlyMortgage + tax + cc;
  }, [monthlyMortgage, tax, cc]);

  const [rentCost, setRentCost] = useState(getRentCost());
  const [buyCost, setBuyCost] = useState(getBuyCost());

  useEffect(() => {
    setClosing(getClosingCosts(isCondo));
  }, [price, down, isCondo, getClosingCosts]);

  useEffect(() => {
    setRentCost(getRentCost());
  }, [rent, rentersInsurance, getRentCost]);

  useEffect(() => {
    setBuyCost(getBuyCost());
  }, [getBuyCost]);

  useEffect(() => {
    setMortgage(calculateMortgage());
  }, [calculateMortgage]);

  return (
    <div className="main-content">
      <h1 className="text-3xl font-bold mb-6">Buy vs. Rent Calculator</h1>

      {/* Your Situation */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Situation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="label">Total Equity ($)</label>
            <input
              type="number"
              className="input"
              value={equity}
              onChange={(e) => setEquity(parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="label">Annual Income ($)</label>
            <input
              type="number"
              className="input"
              value={income}
              onChange={(e) => setIncome(parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="label">Tax Rate (%)</label>
            <input
              type="number"
              className="input"
              value={taxRate}
              onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="label">Risk-Free Rate (%)</label>
            <input
              type="number"
              className="input"
              value={riskFree}
              onChange={(e) => setRiskFree(parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="label">Mortgage Rate (%)</label>
            <input
              type="number"
              className="input"
              value={mortgageRate}
              onChange={(e) => setMortgageRate(parseFloat(e.target.value) || 0)}
              step="0.1"
            />
          </div>
          <div>
            <label className="label">Mortgage Term (years)</label>
            <input
              type="number"
              className="input"
              value={mortgageLoanTerm}
              onChange={(e) => setMortgageLoanTerm(parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="label">Years to Live There</label>
            <input
              type="number"
              className="input"
              value={numYears}
              onChange={(e) => setNumYears(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Rent Column */}
        <div className="card border-l-4 border-l-blue-500">
          <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-400">Rent</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Monthly Rent ($)</label>
              <input
                type="number"
                className="input"
                value={rent}
                onChange={(e) => setRent(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="label">Renter's Insurance ($)</label>
              <input
                type="number"
                className="input"
                value={rentersInsurance}
                onChange={(e) => setRentersInsurance(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Monthly Cost:</span>
                <span className="text-blue-700 dark:text-blue-400">{usdFormatter.format(rentCost)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buy Column */}
        <div className="card border-l-4 border-l-green-500">
          <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">Buy</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Property Type</label>
              <select
                className="select"
                value={isCondo ? 'Condo' : 'Co-op'}
                onChange={(e) => setIsCondo(e.target.value === 'Condo')}
              >
                <option value="Condo">Condo</option>
                <option value="Co-op">Co-op</option>
              </select>
            </div>
            <div>
              <label className="label">Purchase Price ($)</label>
              <input
                type="number"
                className="input"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="label">Down Payment ($)</label>
              <input
                type="number"
                className="input"
                value={down}
                onChange={(e) => setDown(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="label">Closing Costs ($)</label>
              <input type="number" className="input bg-slate-100 dark:bg-slate-700" value={Math.round(closing)} disabled />
            </div>
            <div>
              <label className="label">Monthly Mortgage ($)</label>
              <input
                type="number"
                className="input bg-slate-100 dark:bg-slate-700"
                value={Math.round(monthlyMortgage)}
                disabled
              />
            </div>
            <div>
              <label className="label">Property Tax (monthly) ($)</label>
              <input
                type="number"
                className="input"
                value={tax}
                onChange={(e) => setTax(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="label">CC/Maintenance ($)</label>
              <input
                type="number"
                className="input"
                value={cc}
                onChange={(e) => setCC(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Monthly Cost:</span>
                <span className="text-green-700 dark:text-green-400">{usdFormatter.format(buyCost)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equity Comparison Table */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Monthly Equity Progression</h2>
        <BVRTable
          mortgageData={mortgage}
          rent={rentCost}
          buyCosts={buyCost}
          equityRent={equity}
          equityBuy={equity - down - closing}
          riskFree={riskFree}
          income={income}
          taxRate={taxRate}
        />
      </div>
    </div>
  );
}
