import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Header from "../src/components/Header/Header";

beforeEach(() => {
  localStorage.clear();
});

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
}

describe("Header", () => {
  it("renders the logo link", () => {
    renderWithRouter();
    expect(screen.getByText("Loan for Lawn")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    renderWithRouter();
    expect(screen.getByText("O nas")).toBeInTheDocument();
    expect(screen.getByText("Weź pożyczkę")).toBeInTheDocument();
    expect(screen.getByText("Kursy walut")).toBeInTheDocument();
    expect(screen.getByText("Kontakt")).toBeInTheDocument();
  });

  it("shows login/register when not authenticated", () => {
    renderWithRouter();
    expect(screen.getByText("Zaloguj się")).toBeInTheDocument();
    expect(screen.getByText("Zarejestruj się")).toBeInTheDocument();
  });

  it("shows dashboard link and logout when authenticated", () => {
    localStorage.setItem("token", "fake-token");
    localStorage.setItem("user", JSON.stringify({ username: "testuser" }));
    renderWithRouter();
    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("Wyloguj")).toBeInTheDocument();
  });
});
