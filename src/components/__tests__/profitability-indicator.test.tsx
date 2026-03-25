import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProfitabilityIndicator } from "../profitability-indicator";

describe("ProfitabilityIndicator", () => {
  it("renders positive value with up arrow and green styling", () => {
    render(<ProfitabilityIndicator value={8.42} />);
    expect(screen.getByText("8.42%")).toBeInTheDocument();
    expect(screen.getByText("north_east")).toBeInTheDocument();
  });

  it("renders negative value with down arrow and red styling", () => {
    render(<ProfitabilityIndicator value={-2.15} />);
    expect(screen.getByText("2.15%")).toBeInTheDocument();
    expect(screen.getByText("south_west")).toBeInTheDocument();
  });

  it("renders zero without arrow", () => {
    render(<ProfitabilityIndicator value={0} />);
    expect(screen.getByText("0.00%")).toBeInTheDocument();
  });
});
