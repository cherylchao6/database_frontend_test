interface Note {
  id: string;
  user: {
    id: string;
    name: string;
  };
  description: string;
  timestamp: string; // ISO date string
}

export default Note;
