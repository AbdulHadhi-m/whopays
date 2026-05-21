export interface Player {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface SpinResult {
  id: string;
  participants: string[];
  winner: string;
  createdAt: string;
}

export interface SpinApiResponse {
  id?: string;
  selectedIndex: number;
  winner: string;
  success: boolean;
  error?: string;
}

export interface HistoryApiResponse {
  history: SpinResult[];
  success: boolean;
  error?: string;
}
