import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import '@/lib/chartjs'; // Register Chart.js components
import type { CompoundInterestDataPoint } from '@/types';

interface Props {
  data: CompoundInterestDataPoint[];
  display_detail_inflation: boolean;
}

export default function CompoundInterestGraph({ data, display_detail_inflation }: Props) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Theme-aware colors
  const colors = {
    value: isDark ? 'rgb(134, 239, 172)' : 'rgb(22, 163, 74)', // green-300 / green-600
    invested: isDark ? 'rgb(148, 163, 184)' : 'rgb(71, 85, 105)', // slate-400 / slate-600
    valueAdj: isDark ? 'rgb(74, 222, 128)' : 'rgb(34, 197, 94)', // green-400 / green-500
    investedAdj: isDark ? 'rgb(226, 232, 240)' : 'rgb(100, 116, 139)', // slate-200 / slate-500
    text: isDark ? 'rgb(203, 213, 225)' : 'rgb(51, 65, 85)', // slate-300 / slate-700
    grid: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(100, 116, 139, 0.2)', // slate-400 / slate-500
  };

  const datasets: ChartData<'line'>['datasets'] = [
    {
      label: 'Value',
      data: data.map((d) => Math.round(d.value * 100) / 100),
      fill: false,
      backgroundColor: colors.value,
      borderColor: colors.value,
      borderWidth: 2,
      pointRadius: 1,
    },
    {
      label: 'Amount Invested',
      data: data.map((d) => Math.round(d.amount_invested * 100) / 100),
      fill: false,
      backgroundColor: colors.invested,
      borderColor: colors.invested,
      borderWidth: 2,
      pointRadius: 1,
    },
  ];

  if (display_detail_inflation) {
    datasets.push(
      {
        label: 'Value (adj.)',
        data: data.map((d) => Math.round(d.value_in_todays_dollars * 100) / 100),
        fill: false,
        backgroundColor: colors.valueAdj,
        borderColor: colors.valueAdj,
        borderWidth: 2,
        pointRadius: 2,
        pointStyle: 'rectRot',
      },
      {
        label: 'Amount Invested (adj.)',
        data: data.map((d) => Math.round(d.amount_invested_in_todays_dollars * 100) / 100),
        fill: false,
        backgroundColor: colors.investedAdj,
        borderColor: colors.investedAdj,
        borderWidth: 2,
        pointRadius: 2,
        pointStyle: 'rectRot',
      }
    );
  }

  const chartData: ChartData<'line'> = {
    labels: data.map((d) => d.year),
    datasets,
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: true,
        text: 'VALUE OVER TIME',
        color: colors.text,
        font: {
          size: 18,
          family: 'Source Sans Pro',
        },
      },
      legend: {
        position: 'top',
        labels: {
          color: colors.text,
          font: {
            family: 'Source Sans Pro',
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
          color: colors.text,
          font: {
            size: 16,
            family: 'Anonymous Pro',
          },
        },
        ticks: {
          color: colors.text,
          font: {
            family: 'Anonymous Pro',
          },
        },
        grid: {
          color: colors.grid,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: colors.text,
          font: {
            family: 'Anonymous Pro',
          },
          callback: function (value) {
            return '$' + Number(value).toLocaleString();
          },
        },
        grid: {
          color: colors.grid,
        },
      },
    },
  };

  return (
    <div className="my-6 p-4 bg-white dark:bg-slate-800 rounded-lg">
      <Line data={chartData} options={options} />
    </div>
  );
}
