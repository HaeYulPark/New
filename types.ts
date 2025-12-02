export interface QuestItem {
  id: string;
  title: string;
  content: string;
  difficulty: number;
  completed: boolean;
}

export interface GeneratedQuest {
  title: string;
  content: string;
  difficulty: string; // The API might return "Easy", "Medium", "Hard" or numbers
}
