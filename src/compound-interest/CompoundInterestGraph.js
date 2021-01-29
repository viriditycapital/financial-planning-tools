import React from 'react';
import { Line } from 'react-chartjs-2';

const options = {
  title: {
    display: true,
    text: 'VALUE OVER TIME',
    fontSize: 18,
    fontFamily: 'Source Sans Pro'
  },
  scales: {
    xAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: 'Year',
          fontSize: 16,
          fontFamily: 'Anonymous Pro',
        },
        ticks: {
          fontFamily: 'Anonymous Pro',
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          fontFamily: 'Anonymous Pro',
          beginAtZero: true,
          callback: (value, index, values) => '$' + value,
        },
      },
    ],
  },
}

function CompoundInterestTable(props) {
  var datasets = [
    {
      label: 'Value',
      data: props.data.map(d => Math.round(d.value * 100) / 100),
      fill: false,
      backgroundColor: 'rgb(85, 107, 47)',
      borderColor: 'rgb(85, 107, 47, 0.69)',
    },
    {
      label: 'Amount Invested',
      data: props.data.map(d => Math.round(d.amount_invested * 100) / 100),
      fill: false,
      backgroundColor: 'rgb(127, 127, 127)',
      borderColor: 'rgba(127, 127, 127, 0.69)',
    }
  ]

  if (props.display_detail_inflation) {
    datasets.push(
      {
        label: 'Value (adj.)',
        data: props.data.map(d => Math.round(d.value_in_todays_dollars * 100) / 100),
        fill: false,
        backgroundColor: 'rgb(60, 179, 113)',
        borderColor: 'rgb(60, 179, 113, 0.69)',
        borderWidth: 2,
        pointRadius: 2,
        pointStyle: 'rectRot'
      },
      {
        label: 'Amount Invested (adj.)',
        data: props.data.map(d => Math.round(d.amount_invested_in_todays_dollars * 100) / 100),
        fill: false,
        backgroundColor: 'rgb(200, 200, 200)',
        borderColor: 'rgba(200, 200, 200, 0.69)',
        borderWidth: 2,
        pointRadius: 2,
        pointStyle: 'rectRot'
      }
    )
  }

  const data = {
    labels: props.data.map(d => d.year),
    datasets: datasets
  }

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
}

export default CompoundInterestTable