import { useCallback, useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { AUTH_FEATURES } from '../../constants/authFeatures';

const SLIDE_MS = 5000;

const variantStyles = {
  dark: {
    card: 'rounded-xl bg-emerald-800 border border-emerald-700 p-5 sm:p-6',
    badge: 'text-[10px] font-bold uppercase tracking-wider text-emerald-300 px-2 py-0.5 rounded-full bg-emerald-700/80 border border-emerald-600',
    iconWrap: 'w-11 h-11 rounded-lg bg-emerald-700 text-emerald-50 border border-emerald-600',
    title: 'text-lg font-bold text-white',
    description: 'text-sm text-emerald-100/90 leading-relaxed',
    track: 'bg-emerald-700/60',
    progress: 'bg-emerald-300',
    dotActive: 'w-7 bg-emerald-300',
    dotIdle: 'w-1.5 bg-emerald-600/80 hover:bg-emerald-500',
    arrow: 'p-2 rounded-lg border border-emerald-700 bg-emerald-800 text-emerald-100 hover:bg-emerald-700 hover:text-white transition-colors',
    counter: 'text-xs text-emerald-400 tabular-nums'
  },
  light: {
    card: 'rounded-xl border border-slate-200 bg-white p-4 shadow-card',
    badge: 'text-[10px] font-bold uppercase tracking-wider text-primary-700 px-2 py-0.5 rounded-full bg-primary-50 border border-primary-200',
    iconWrap: 'w-10 h-10 rounded-lg bg-primary-100 text-primary-700 border border-primary-200',
    title: 'text-sm font-bold text-slate-800',
    description: 'text-xs text-slate-600 leading-relaxed',
    track: 'bg-slate-200',
    progress: 'bg-primary-500',
    dotActive: 'w-6 bg-primary-500',
    dotIdle: 'w-1.5 bg-slate-300 hover:bg-slate-400',
    arrow: 'p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-colors',
    counter: 'text-[11px] text-slate-500 tabular-nums'
  }
};

const AuthFeatureSlider = ({ variant = 'dark', showArrows = true, className = '' }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const styles = variantStyles[variant] ?? variantStyles.dark;
  const total = AUTH_FEATURES.length;
  const feature = AUTH_FEATURES[index];
  const Icon = feature.icon;

  const goTo = useCallback((next) => {
    setIndex((next + total) % total);
  }, [total]);

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(goNext, SLIDE_MS);
    return () => clearInterval(timer);
  }, [paused, goNext]);

  return (
    <div
      className={`min-w-0 ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <div key={feature.id} className={`${styles.card} auth-slide-in`}>
        <div className="flex items-start gap-3 sm:gap-4">
          <span className={`flex items-center justify-center shrink-0 ${styles.iconWrap}`}>
            <Icon className="w-5 h-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <span className={styles.badge}>{feature.stat}</span>
            <h3 className={`${styles.title} mt-2`}>{feature.title}</h3>
            <p className={`${styles.description} mt-1.5`}>{feature.description}</p>
          </div>
        </div>

        <div className={`mt-4 h-0.5 rounded-full overflow-hidden ${styles.track}`}>
          {!paused ? (
            <div key={`progress-${index}`} className={`h-full ${styles.progress} auth-slide-progress`} />
          ) : (
            <div
              className={`h-full ${styles.progress}`}
              style={{ transform: 'scaleX(1)', transformOrigin: 'left' }}
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-4">
        <span className={styles.counter}>
          {index + 1} / {total}
        </span>

        <div className="flex items-center gap-1.5 flex-1 justify-center">
          {AUTH_FEATURES.map((f, i) => (
            <button
              key={f.id}
              type="button"
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? styles.dotActive : styles.dotIdle
              }`}
              aria-label={`Show ${f.title}`}
              aria-current={i === index ? 'true' : undefined}
            />
          ))}
        </div>

        {showArrows ? (
          <div className="flex items-center gap-1 shrink-0">
            <button type="button" onClick={goPrev} className={styles.arrow} aria-label="Previous feature">
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button type="button" onClick={goNext} className={styles.arrow} aria-label="Next feature">
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <span className="w-[4.5rem] shrink-0" aria-hidden />
        )}
      </div>
    </div>
  );
};

export default AuthFeatureSlider;
