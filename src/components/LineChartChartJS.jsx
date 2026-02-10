import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { FiTrendingUp } from 'react-icons/fi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const themeText = '#1e293b';
const themeMuted = '#64748b';
const themeGrid = 'rgba(15, 23, 42, 0.06)';

const LineChartChartJS = ({ data, labels, title = 'Line Chart' }) => {
  const chartData = {
    labels: labels,
    datasets: data.map((dataset) => {
      const color = dataset.color || '#10b981';
      return {
        label: dataset.label,
        data: dataset.values,
        borderColor: color,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
          gradient.addColorStop(0, color + '40');
          gradient.addColorStop(1, color + '02');
          return gradient;
        },
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
      };
    })
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 8, right: 8, bottom: 4, left: 4 }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          color: themeText,
          font: { family: 'inherit', size: 12, weight: '600' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        padding: 14,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 13 },
        borderColor: 'rgba(248, 250, 252, 0.12)',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        boxPadding: 6
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: themeGrid,
          drawBorder: false,
          lineWidth: 1
        },
        ticks: {
          color: themeMuted,
          font: { size: 11 },
          padding: 12,
          maxTicksLimit: 6
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: themeMuted,
          font: { size: 11 },
          padding: 12,
          maxRotation: 45
        }
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-panel overflow-hidden border border-slate-200/80 ring-1 ring-slate-200/50 border-t-4 border-t-primary-500">
      <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/80 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 text-primary-600">
          <FiTrendingUp className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
      </div>
      <div className="p-5 h-[380px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LineChartChartJS;
