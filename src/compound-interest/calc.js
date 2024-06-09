var periods_per_year = {
  daily: 365,
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  quarter: 4,
  annually: 1,
};

var month_name = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function calc_compound_interest_table(
  initial_amount = 0,
  interest_rate = 0.1,
  inflation_rate = 0.03,
  num_years = 50,
  recurring_investments = [0],
  recurring_investment_periods = ["annually"]
) {
  let compound_interest_data = [];
  compound_interest_data.push({
    year: "-",
    period: "-",
    amount_invested: initial_amount,
    value: initial_amount,
    returns: 0,
    amount_invested_in_todays_dollars: initial_amount,
    value_in_todays_dollars: initial_amount,
    returns_in_todays_dollars: 0,
    end_of_year: true,
  });

  let current_amount_invested = initial_amount;
  let current_value = initial_amount;
  let current_amount_invested_in_todays_dollars = initial_amount;

  let inflation_multiplier = 1;
  let period = 0;

  for (let year = 1; year <= num_years; year++) {
    let recurring_investments_combined = [];

    for (let i = 0; i < recurring_investments.length; i++) {
      // Iterate over investments
      const recurring_investment = recurring_investments[i];
      const recurring_investment_period = recurring_investment_periods[i];
      const ppy = periods_per_year[recurring_investment_period];

      const increment_amount = 365 / ppy;
      let curr_period = 0;
      // Combine all recurring investments
      for (let period = 1; period <= ppy; period++) {
        recurring_investments_combined.push({
          period: Math.floor(curr_period),
          amount: recurring_investment,
        });
        curr_period += increment_amount;
      }
    }

    recurring_investments_combined.sort(function (a, b) {
      if (a.period < b.period) return -1;
      if (a.period > b.period) return 1;
      return 0;
    });

    const folded = [recurring_investments_combined[0]];

    for (let i = 1; i < recurring_investments_combined.length; i++) {
      if (
        folded[folded.length - 1].period ===
        recurring_investments_combined[i].period
      ) {
        folded[folded.length - 1].amount +=
          recurring_investments_combined[i].amount;
      } else {
        folded.push(recurring_investments_combined[i]);
      }
    }
    recurring_investments_combined = folded;

    let interest_rate_delta =
      (365 - period + recurring_investments_combined[0].period) / 365;
    for (let i = 0; i < recurring_investments_combined.length; i++) {
      if (i > 0) {
        interest_rate_delta =
          (recurring_investments_combined[i].period -
            recurring_investments_combined[i - 1].period) /
          365;
      }

      // Apply interest rates/inflation
      period = recurring_investments_combined[i].period;
      current_value *= 1 + interest_rate * interest_rate_delta;
      inflation_multiplier *= 1 + inflation_rate * interest_rate_delta;

      // Deflate the money
      let deflated_current_value = current_value / inflation_multiplier;

      // Add recurring investment
      let current_amount = recurring_investments_combined[i].amount;
      current_amount_invested += current_amount;
      current_value += current_amount;

      let current_value_in_todays_dollars =
        deflated_current_value + current_amount;
      current_amount_invested_in_todays_dollars +=
        current_amount / inflation_multiplier;

      compound_interest_data.push({
        year: year,
        period: period,
        amount_invested: current_amount_invested,
        value: current_value,
        returns: current_value / current_amount_invested - 1,
        amount_invested_in_todays_dollars:
          current_amount_invested_in_todays_dollars,
        value_in_todays_dollars: current_value_in_todays_dollars,
        returns_in_todays_dollars:
          current_value_in_todays_dollars /
            current_amount_invested_in_todays_dollars -
          1,
        end_of_year: i === recurring_investments_combined.length - 1, // Last period of the year
      });
    }
  }

  return compound_interest_data;
}
