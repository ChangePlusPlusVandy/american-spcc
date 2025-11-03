export interface SocialLoginButtonProps {
  provider: SocialProvider;
  onClick: () => void;
}

export enum SocialProvider {
  Google = "google",
  Facebook = "facebook",
}
