export interface ResourceGridCardProps {
  title: string;
  tags: string[];
  description: string;
  category: string;
  imageUrl?: string;
  onLearnMore: () => void;
}
