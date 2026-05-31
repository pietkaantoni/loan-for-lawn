import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Home from "../src/pages/Home/Home";

describe("Home page", () => {
  it("renders the main heading", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText("Loan for Lawn")).toBeInTheDocument();
  });

  it("renders features section", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText("Dlaczego my?")).toBeInTheDocument();
    expect(screen.getByText("Niskie oprocentowanie")).toBeInTheDocument();
    expect(screen.getByText("Szybka decyzja")).toBeInTheDocument();
    expect(screen.getByText("W pełni online")).toBeInTheDocument();
    expect(screen.getByText("Bezpieczeństwo")).toBeInTheDocument();
  });

  it("renders CTA buttons", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText("Weź pożyczkę")).toBeInTheDocument();
    expect(screen.getByText("Załóż konto")).toBeInTheDocument();
  });
});
