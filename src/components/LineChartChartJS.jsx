import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChartChartJS = ({ data, labels, title = 'Line Chart' }) => {
  const chartData = {
    labels: labels,
    datasets: data.map((dataset) => ({
      label: dataset.label,
      data: dataset.values,
      borderColor: dataset.color,
      backgroundColor: dataset.color + '20',
      borderWidth: 2.5,
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: dataset.color,
      pointBorderColor: '#fff',
      pointBorderWidth: 2
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
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
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LineChartChartJS;
