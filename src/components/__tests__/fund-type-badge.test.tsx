import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FundTypeBadge } from "../fund-type-badge";

describe("FundTypeBadge", () => {
  it("renders the fund type text", () => {
    render(<FundTypeBadge type="FIC de tipo general" />);
    expect(screen.getByText("General")).toBeInTheDocument();
  });

  it("renders inmobiliario type", () => {
    render(<FundTypeBadge type="FIC inmobiliario" />);
    expect(screen.getByText("Inmobiliario")).toBeInTheDocument();
  });
});
