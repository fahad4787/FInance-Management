import { useMemo } from 'react';
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
import { FiLayers } from 'react-icons/fi';
import { formatMoney } from '../utils/format';
import { buildProjectInwardCostChartRows } from '../utils/projectInwardCostChart';
import { useDateFilter } from '../hooks/useDateFilter';
import DateFilterControls from './DateFilterControls';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MAX_BARS = 14;

const themeText = '#1e293b';
const themeMuted = '#64748b';
const themeGrid = 'rgba(15, 23, 42, 0.06)';

const ProjectInwardCostBar = ({ projects = [], transactions = [] }) => {
  const chartDateFilter = useDateFilter({ defaultMode: 'month' });
  const { effectiveDateFrom, effectiveDateTo, dateMode } = chartDateFilter;

  const { chartData, tooltipRowDetails, truncated } = useMemo(() => {
    const from = effectiveDateFrom || null;
    const to = effectiveDateTo || null;
    const rows = buildProjectInwardCostChartRows(projects, transactions, from, to);
    const slice = rows.slice(0, MAX_BARS);
    const labels = slice.map((r) => r.label);
    const inward = slice.map((r) => Number(r.inward.toFixed(2)));
    const totalCost = slice.map((r) => Number(r.costTotal.toFixed(2)));
    const tooltipRowDetails = slice.map((r) => ({
      brokerage: r.brokerage,
      tax: r.tax,
      projectCost: r.projectCost
    }));

    return {
      chartData: {
        labels,
        datasets: [
          {
            label: 'Total cost',
            data: totalCost,
            backgroundColor: '#dc2626',
            borderColor: '#b91c1c',
            borderWidth: 0,
            stack: 'main',
            borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 8, bottomRight: 8 },
            borderSkipped: false
          },
          {
            label: 'Inward',
            data: inward,
            backgroundColor: '#22c55e',
            borderColor: '#16a34a',
            borderWidth: 0,
            stack: 'main',
            borderRadius: { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 },
            borderSkipped: false
          }
        ]
      },
      tooltipRowDetails,
      truncated: rows.length > MAX_BARS
    };
  }, [projects, transactions, effectiveDateFrom, effectiveDateTo]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      layout: {
        padding: { top: 8, right: 8, bottom: 4, left: 4 }
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 16,
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
          boxPadding: 6,
          itemSort: (a, b) => b.datasetIndex - a.datasetIndex,
          callbacks: {
            label: (ctx) => {
              const v = ctx.parsed?.y;
              if (v == null || !Number.isFinite(v)) return `${ctx.dataset.label}: —`;
              return `${ctx.dataset.label}: ${formatMoney(v)}`;
            },
            afterBody: (items) => {
              const idx = items[0]?.dataIndex;
              if (idx == null || !tooltipRowDetails[idx]) return [];
              const r = tooltipRowDetails[idx];
              const lines = [];
              if (r.brokerage > 0) lines.push(`Brokerage: ${formatMoney(r.brokerage)}`);
              if (r.tax > 0) lines.push(`Tax: ${formatMoney(r.tax)}`);
              if (r.projectCost > 0) lines.push(`Project cost: ${formatMoney(r.projectCost)}`);
              return lines;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: {
            color: themeMuted,
            font: { size: 10 },
            padding: 8,
            maxRotation: 55,
            minRotation: 0
          }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: {
            color: themeGrid,
            drawBorder: false,
            lineWidth: 1
          },
          ticks: {
            color: themeMuted,
            font: { size: 11 },
            padding: 10,
            maxTicksLimit: 7,
            callback: (value) => (Number.isFinite(value) ? `$${value}` : value)
          }
        }
      }
    }),
    [tooltipRowDetails]
  );

  const hasData =
    chartData.labels.length > 0 &&
    chartData.datasets.some((d) => d.data.some((n) => n > 0));

  return (
    <div className="bg-white rounded-2xl shadow-panel border border-slate-200/80 ring-1 ring-slate-200/50 border-t-4 border-t-emerald-600 overflow-hidden">
      <div className="px-4 md:px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/80">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
              <FiLayers className="w-5 h-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Inward vs total cost</h3>
              <p className="text-sm text-slate-500 mt-0.5 leading-snug">
                Total cost: brokerage, tax, project cost. Net inward: filtered by date (after 2% withholding).
              </p>
            </div>
          </div>
          <div className="shrink-0 w-full lg:w-auto lg:max-w-[min(100%,42rem)] lg:ml-auto">
            <DateFilterControls {...chartDateFilter} className="justify-end" />
          </div>
        </div>
      </div>
      <div className="px-4 md:px-6 py-4 md:py-5 bg-slate-100/60">
        {truncated ? (
          <p className="text-[11px] text-slate-500 mb-2">
            Showing the {MAX_BARS} largest projects by combined total.
          </p>
        ) : null}
        {hasData ? (
          <div className="h-[min(420px,55vh)] min-h-[260px] w-full">
            <Bar data={chartData} options={options} />
          </div>
        ) : (
          <p className="text-sm text-slate-500 py-10 text-center">
            {dateMode !== 'all' && (effectiveDateFrom || effectiveDateTo)
              ? 'No data for this period. Try another range or clear the date filter.'
              : 'No approved transactions or cost data yet.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectInwardCostBar;
