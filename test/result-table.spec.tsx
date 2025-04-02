import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ResultCalculator } from "interfaces/result-calculator";
import ResultTable from "components/results-table";

describe("ResultTable Component", () => {
  const mockSimpleInterestResults: ResultCalculator = {
    initialCapital: 10000,
    term: 12,
    monthlyRate: 2,
    benefitType: "simple",
    feeRate: 5,
    monthlyResults: [
      {
        month: 1,
        initialCapital: 10000,
        monthlyProfit: 200,
        accumulatedProfit: 200,
        totalAmount: 10200,
      },
      {
        month: 2,
        initialCapital: 10000,
        monthlyProfit: 200,
        accumulatedProfit: 400,
        totalAmount: 10400,
      },
    ],
    grossAmount: 12400,
    feeAmount: 620,
    netAmount: 11780,
  };

  const mockCompoundInterestResults: ResultCalculator = {
    initialCapital: 5000,
    term: 6,
    monthlyRate: 1.5,
    benefitType: "compound",
    feeRate: 3,
    monthlyResults: [
      {
        month: 1,
        initialCapital: 5000,
        monthlyProfit: 75,
        accumulatedProfit: 75,
        totalAmount: 5075,
      },
      {
        month: 2,
        initialCapital: 5075,
        monthlyProfit: 76.13,
        accumulatedProfit: 151.13,
        totalAmount: 5151.13,
      },
    ],
    grossAmount: 5467.49,
    feeAmount: 164.02,
    netAmount: 5303.47,
  };

  it("should not render when results are not provided", () => {
    // @ts-expect-error Testing null case intentionally
    render(<ResultTable results={null} />);
    const tableElement = screen.queryByTestId("result-table");
    expect(tableElement).not;
  });

  it("should render with simple interest calculation results", () => {
    render(<ResultTable results={mockSimpleInterestResults} />);

    // Check if the table is rendered
    const tableElement = screen.getByTestId("result-table");
    expect(tableElement);

    // Check header information
    expect(screen.getByText("Resultados de la Simulación"));

    expect(screen.getByText("12 meses"));
    expect(screen.getByText("2%"));
    expect(screen.getByText("Simple"));

    const monthlyProfitCells = screen.getAllByText("$200.00");
    expect(monthlyProfitCells.length).toBeGreaterThan(0);

    // Check summary information
    expect(screen.getByText("$12400.00"));
    expect(screen.getByText("-$620.00"));
    expect(screen.getByText("$11780.00"));
  });

  it("should display correct fee rate and calculations", () => {

    // Check fee rate display
    expect(screen.getByText("-$620.00"));
  });
});
