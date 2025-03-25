export interface User {
  id: number;
  name: string;
}

export interface Note {
  id: string;
  user: {
    id: string;
    name: string;
  };
  description: string;
  timestamp: string;
  attachedFile?: {
    name: string;
    url: string;
  } | null;
}
