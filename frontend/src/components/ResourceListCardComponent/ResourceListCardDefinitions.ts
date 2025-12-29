export interface ResourceListCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  imageUrl?: string;
  onLearnMore?: () => void;
  onSaved?: (payload: {
    collectionName: string;
    imageUrl?: string;
    undo: () => void;
  }) => void;

  onCreateCollection?: (imageUrl?: string, resourceId?: string) => void;

}
