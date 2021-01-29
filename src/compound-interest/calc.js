var periods_per_year = {
  daily: 365,
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  annually: 1
}

var month_name = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"]

export default function calc_compound_interest_table(
  initial_amount = 0,
  interest_rate = 0.10,
  inflation_rate = 0.03,
  num_years = 50,
  recurring_investment = 0,
  recurring_investment_period = 'annually'
) {
  let compound_interest_data = []
  compound_interest_data.push({
    year: "-",
    period: "-",
    amount_invested: initial_amount,
    value: initial_amount,
    returns: 0,
    amount_invested_in_todays_dollars: initial_amount,
    value_in_todays_dollars: initial_amount,
    returns_in_todays_dollars: 0,
    end_of_year: true
  })

  let current_amount_invested = initial_amount
  let current_value = initial_amount
  let current_amount_invested_in_todays_dollars = initial_amount

  let inflation_multiplier = 1
  let ppy = periods_per_year[recurring_investment_period]

  for (let year = 1; year <= num_years; year++) {
    for (let period = 1; period <= ppy; period++) {
      // Apply interest rates/inflation before adding recurring investments
      current_value *= (1 + (interest_rate / ppy))
      inflation_multiplier *= (1 + (inflation_rate / ppy))

      // Deflate the money before adding recurring investment
      let deflated_current_value = current_value / inflation_multiplier

      current_amount_invested += recurring_investment
      current_value += recurring_investment

      let current_value_in_todays_dollars = deflated_current_value + recurring_investment
      current_amount_invested_in_todays_dollars += recurring_investment / inflation_multiplier

      compound_interest_data.push({
        year: year,
        period: recurring_investment_period === "monthly" ? month_name[period - 1] : period,
        amount_invested: current_amount_invested,
        value: current_value,
        returns: (current_value / current_amount_invested) - 1,
        amount_invested_in_todays_dollars: current_amount_invested_in_todays_dollars,
        value_in_todays_dollars: current_value_in_todays_dollars,
        returns_in_todays_dollars: (current_value_in_todays_dollars / current_amount_invested_in_todays_dollars) - 1,
        end_of_year: period === ppy
      })
    }
  }

  return compound_interest_data
}