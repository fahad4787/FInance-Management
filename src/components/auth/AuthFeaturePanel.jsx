import Logo from '../Logo';
import AuthFeatureSlider from './AuthFeatureSlider';

const AuthFeaturePanel = () => (
  <aside className="hidden lg:flex lg:w-[48%] xl:w-[50%] flex-col bg-emerald-900 text-white border-r border-emerald-950">
    <div className="flex flex-col justify-center flex-1 p-10 xl:p-12 max-w-xl w-full">
      <div className="mb-10">
        <Logo variant="light" />
      </div>

      <div className="min-w-0">
        <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-3">
          Built for finance teams
        </p>
        <h2 className="text-3xl xl:text-[2rem] font-bold tracking-tight leading-tight text-white mb-4">
          Your complete finance operations hub
        </h2>
        <p className="text-emerald-100 text-sm xl:text-base leading-relaxed mb-8">
          A private workspace to organize finances, track activity, and make confident decisions — all in
          one place.
        </p>

        <AuthFeatureSlider variant="dark" showArrows />
      </div>
    </div>
  </aside>
);

export default AuthFeaturePanel;
