import { FiExternalLink, FiGrid } from 'react-icons/fi';
import { PORTFOLIO_SITES } from '../constants/portfolioSites';
import {
  chartCardClass,
  chartCardHeaderClass,
  chartCardTitleClass,
  chartCardSubtitleClass,
  chartCardIconWrapClass
} from '../constants/chartCardStyles';

const PortfolioLinks = () => (
  <div className={`${chartCardClass} border-t-4 border-t-primary-500`}>
    <div className={chartCardHeaderClass}>
      <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
        <div className={`${chartCardIconWrapClass} bg-primary-100 text-primary-600`}>
          <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h3 className={chartCardTitleClass}>Portfolio</h3>
          <p className={chartCardSubtitleClass}>Quick links to your Fixelcloud products</p>
        </div>
      </div>
    </div>

    <div className="p-3 sm:p-4 md:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2.5 sm:gap-3">
        {PORTFOLIO_SITES.map((site) => (
          <a
            key={site.id}
            href={site.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-3 shadow-sm ring-1 ring-slate-100/80 hover:border-primary-300 hover:bg-primary-50/40 hover:ring-primary-200/50 transition-colors min-w-0"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 shrink-0 overflow-hidden">
              <img
                src={site.logo}
                alt=""
                className="w-7 h-7 object-contain"
                loading="lazy"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-800 truncate">{site.name}</span>
                <FiExternalLink
                  className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  aria-hidden
                />
              </span>
              <span className="block text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
                {site.description}
              </span>
            </span>
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default PortfolioLinks;
