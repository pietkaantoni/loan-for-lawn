import type { AuthResponse, User, Loan, RatesResponse, RateCurrency } from "../types";

const API_BASE = "/api";

function getToken(): string | null {
  return localStorage.getItem("token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error ?? "Request failed");
  }
  return response.json();
}

export async function register(username: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function getMe(): Promise<{ user: User }> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { ...authHeaders() },
  });
  return handleResponse<{ user: User }>(res);
}

export async function getLoans(): Promise<{ loans: Loan[] }> {
  const res = await fetch(`${API_BASE}/loans`, {
    headers: { ...authHeaders() },
  });
  return handleResponse<{ loans: Loan[] }>(res);
}

export async function createLoan(amount: number, interest_rate: number, due_date: string): Promise<{ loan: Loan }> {
  const res = await fetch(`${API_BASE}/loans`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ amount, interest_rate, due_date }),
  });
  return handleResponse<{ loan: Loan }>(res);
}

export async function repayLoan(id: string): Promise<{ loan: Loan; message: string }> {
  const res = await fetch(`${API_BASE}/loans/${id}/repay`, {
    method: "PATCH",
    headers: { ...authHeaders() },
  });
  return handleResponse<{ loan: Loan; message: string }>(res);
}

export async function getAvailableCurrencies(): Promise<{ popular: RateCurrency[]; others: RateCurrency[] }> {
  const res = await fetch(`${API_BASE}/rates/available`);
  return handleResponse<{ popular: RateCurrency[]; others: RateCurrency[] }>(res);
}

export async function getRates(currencies?: string[]): Promise<RatesResponse> {
  const params = currencies?.length ? `?currencies=${currencies.join(",")}` : "";
  const res = await fetch(`${API_BASE}/rates${params}`);
  return handleResponse<RatesResponse>(res);
}
