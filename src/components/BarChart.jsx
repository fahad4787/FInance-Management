import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const themePrimary = '#0ea5e9';
const themeText = '#1e293b';
const themeMuted = '#64748b';
const themeGrid = 'rgba(15, 23, 42, 0.06)';

const BarChart = ({ data, labels, title = 'Bar Chart' }) => {
  const chartData = {
    labels: labels,
    datasets: data.map((dataset) => ({
      label: dataset.label,
      data: dataset.values,
      backgroundColor: dataset.color || themePrimary,
      borderColor: dataset.color || themePrimary,
      borderWidth: 1
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          color: themeText,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        borderColor: 'rgba(248, 250, 252, 0.15)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: themeGrid,
          drawBorder: false
        },
        ticks: {
          color: themeMuted,
          font: {
            size: 11
          },
          padding: 10
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: themeMuted,
          font: {
            size: 11
          },
          padding: 10
        }
      }
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg border-l-4 border-primary-500 h-[400px]">
      <div className="h-full">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
