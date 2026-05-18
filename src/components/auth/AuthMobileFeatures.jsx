import AuthFeatureSlider from './AuthFeatureSlider';

const AuthMobileFeatures = () => (
  <div className="lg:hidden w-full mb-4 min-w-0">
    <p className="text-xs font-semibold text-slate-600 mb-2">What you get with FinHub</p>
    <AuthFeatureSlider variant="light" showArrows={false} />
  </div>
);

export default AuthMobileFeatures;
