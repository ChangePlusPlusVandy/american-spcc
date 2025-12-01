export interface FilterState {
    category: string;
    completedOnly: boolean;
  }
  
  export function defaultFilters(): FilterState {
    return { category: "", completedOnly: false };
  }
  