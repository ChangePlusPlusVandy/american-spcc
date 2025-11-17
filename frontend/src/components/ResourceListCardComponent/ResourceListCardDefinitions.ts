export interface ResourceListCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  onLearnMore?: () => void;
}
