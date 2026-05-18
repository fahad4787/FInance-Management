import AuthFeatureSlider from './AuthFeatureSlider';

const AuthMobileFeatures = () => (
  <div className="w-full min-w-0">
    <p className="text-xs font-semibold text-emerald-300/95 mb-2 text-center uppercase tracking-wider">
      Why FinHub
    </p>
    <AuthFeatureSlider variant="dark" showArrows={false} />
  </div>
);

export default AuthMobileFeatures;
