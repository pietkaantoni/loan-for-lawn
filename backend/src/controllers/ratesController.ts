import { Request, Response } from "express";

const NBP_API = "https://api.nbp.pl/api/exchangerates/tables/A?format=json";

const POPULAR_CURRENCIES = [
  "EUR", "USD", "GBP", "CHF", "JPY",
  "CZK", "DKK", "NOK", "SEK", "XDR",
];

interface NbpRate {
  currency: string;
  code: string;
  mid: number;
}

interface NbpTable {
  table: string;
  no: string;
  effectiveDate: string;
  rates: NbpRate[];
}

interface CurrencyInfo {
  code: string;
  currency: string;
}

export async function getAvailableCurrencies(_req: Request, res: Response): Promise<void> {
  try {
    const response = await fetch(NBP_API);
    if (!response.ok) {
      res.status(502).json({ error: "Failed to fetch rates from NBP." });
      return;
    }

    const data = await response.json() as unknown;
    const tables = Array.isArray(data) ? (data as NbpTable[]) : [];
    if (tables.length === 0) {
      res.status(502).json({ error: "Failed to fetch rates from NBP." });
      return;
    }
    const table = tables[0];
    const allCurrencies: CurrencyInfo[] = table.rates.map((r) => ({
      code: r.code,
      currency: r.currency,
    }));

    const popular = allCurrencies.filter((c) =>
      POPULAR_CURRENCIES.includes(c.code)
    );
    const others = allCurrencies.filter(
      (c) => !POPULAR_CURRENCIES.includes(c.code)
    );

    res.json({ popular, others });
  } catch {
    res.status(502).json({ error: "Failed to fetch rates from NBP." });
  }
}

export async function getRates(req: Request, res: Response): Promise<void> {
  try {
    const currencies = req.query.currencies
      ? (req.query.currencies as string).split(",")
      : [];

    const response = await fetch(NBP_API);
    if (!response.ok) {
      res.status(502).json({ error: "Failed to fetch rates from NBP." });
      return;
    }

    const data = await response.json() as unknown;
    const tables = Array.isArray(data) ? (data as NbpTable[]) : [];
    if (tables.length === 0) {
      res.status(502).json({ error: "Failed to fetch rates from NBP." });
      return;
    }
    const table = tables[0];
    const tableDate = table.effectiveDate;

    let rates = table.rates;
    if (currencies.length > 0) {
      rates = table.rates.filter((r) => currencies.includes(r.code));
    }

    res.json({
      date: tableDate,
      base: "PLN",
      rates: rates.map((r) => ({
        currency: r.currency,
        code: r.code,
        rate: r.mid,
      })),
    });
  } catch {
    res.status(502).json({ error: "Failed to fetch rates from NBP." });
  }
}
