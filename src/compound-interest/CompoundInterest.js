import React, { Component } from 'react';
import calc_compound_interest_table from './calc.js'
import CompoundInterestTable from './CompoundInterestTable'

class CompoundInterest extends Component {
  constructor(props) {
    super(props)

    this.calc = this.calc.bind(this);
    this.update_value = this.update_value.bind(this);
    this.toggle_value = this.toggle_value.bind(this);

    this.state = {
      initial_amount: 5000,
      interest_rate: 0.10,
      inflation_rate: 0.03,
      num_years: 10,
      recurring_investment: 1000,
      recurring_investment_period: 'annually',
      recurring_investment_period_used_for_calc: 'annually',
      display_detail_period: false,
      display_detail_inflation: false,
      data: undefined
    }
  }

  calc() {
    this.setState({
      data: calc_compound_interest_table(
        this.state.initial_amount,
        this.state.interest_rate,
        this.state.inflation_rate,
        this.state.num_years,
        this.state.recurring_investment,
        this.state.recurring_investment_period
      ),
      recurring_investment_period_used_for_calc: this.state.recurring_investment_period
    })
  }

  update_value(key, value) {
    this.setState({
      [key]: value
    })
  }

  toggle_value(key) {
    this.setState({
      [key]: !this.state[key]
    })
  }

  render() {
    return (
      <div className="main-content">
        <h1>Compound Interest</h1>

        <table className="input-table">
          <tr>
            <td>
              <label className="input-label">Initial Investment ($)</label> </td><td>
              <input type="number" defaultValue={this.state.initial_amount} className="number-input"
                onChange={e => this.update_value("initial_amount", Number(e.target.value))} />
            </td>
            <td>
              <label className="input-label">Number of Years</label> </td><td>
              <input type="number" defaultValue={this.state.num_years} className="number-input"
                onChange={e => this.update_value("num_years", Number(e.target.value))} />
            </td>
          </tr>
          <tr>
            <td>
              <label className="input-label">Recurring Investment ($)</label> </td><td>
              <input type="number" defaultValue={this.state.recurring_investment} className="number-input"
                onChange={e => this.update_value("recurring_investment", Number(e.target.value))} />
            </td>
            <td>
              <label className="input-label">Every</label> </td><td>
              <select defaultValue={this.state.recurring_investment_period} className="select-input"
                onChange={e => this.update_value('recurring_investment_period', e.target.value)}>
                <option value="daily">Day</option>
                <option value="weekly">Week</option>
                <option value="biweekly">Two Weeks</option>
                <option value="monthly">Month</option>
                <option value="annually">Year</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <label className="input-label">Interest Rate (%)</label> </td><td>
              <input type="number" defaultValue={this.state.interest_rate * 100} className="number-input percentage"
                onChange={e => this.update_value("interest_rate", Number(e.target.value) / 100)} />
            </td>
            <td>
              <label className="input-label">Inflation Rate (%)</label> </td><td>
              <input type="number" defaultValue={this.state.inflation_rate * 100} className="number-input percentage"
                onChange={e => this.update_value("inflation_rate", Number(e.target.value) / 100)} />
            </td>
          </tr>
        </table>

        <br />
        <span className="button action-button" onClick={this.calc}>Calculate</span>

        <span className={"button toggle-button" + (this.state.display_detail_period ? " selected" : "")}
          onClick={() => this.toggle_value("display_detail_period")}>
          {this.state.display_detail_period ? <>&#9724;</> : <>&#9723;</>} Break Down by Time</span>

        <span className={"button toggle-button" + (this.state.display_detail_inflation ? " selected" : "")}
          onClick={() => this.toggle_value("display_detail_inflation")}>
          {this.state.display_detail_inflation ? <>&#9724;</> : <>&#9723;</>} Compare Against Today's Dollars</span>

        {this.state.data &&
          <CompoundInterestTable
            data={this.state.data}
            recurring_investment_period={this.state.recurring_investment_period_used_for_calc}
            display_detail_period={this.state.display_detail_period}
            display_detail_inflation={this.state.display_detail_inflation} />
        }
      </div>
    );
  }
}

export default CompoundInterest