export interface User {
  id: string;
  username: string;
  email: string;
  created_at?: string;
}

export interface Loan {
  id: string;
  user_id: string;
  amount: string;
  interest_rate: string;
  status: "active" | "paid";
  due_date: string;
  created_at: string;
}

export interface RateCurrency {
  code: string;
  currency: string;
}

export interface Rate {
  currency: string;
  code: string;
  rate: number;
}

export interface RatesResponse {
  date: string;
  base: string;
  rates: Rate[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
