import { calculateReturns } from "services/calculationService";
import { describe, it, expect } from "vitest";

describe("calculateReturns Service", () => {
  describe("Simple Interest", () => {
    it("Correctly calculates results with capital <= 1000", () => {
      const capital = 1000;
      const term = 3;
      const benefitType = "simple" as const;
      const result = calculateReturns(capital, term, benefitType);

      expect(result.monthlyRate).toBe(1);
      expect(result.feeRate).toBe(2);
      expect(result.monthlyResults.length).toBe(term);
      result.monthlyResults.forEach((res, index) => {
        const month = index + 1;
        const expectedProfit = capital * 0.01; // 10
        const expectedAccumulated = expectedProfit * month;
        const expectedTotal = capital + expectedAccumulated;
        expect(res.month).toBe(month);
        expect(res.initialCapital).toBe(capital);
        expect(res.monthlyProfit).toBeCloseTo(expectedProfit);
        expect(res.accumulatedProfit).toBeCloseTo(expectedAccumulated);
        expect(res.totalAmount).toBeCloseTo(expectedTotal);
      });

      const finalAmount = result.monthlyResults[term - 1].totalAmount; // 1030
      const feeAmount = finalAmount * 0.02; // 20.6
      const netAmount = finalAmount - feeAmount; // 1009.4

      expect(result.grossAmount).toBeCloseTo(finalAmount);
      expect(result.feeAmount).toBeCloseTo(feeAmount);
      expect(result.netAmount).toBeCloseTo(netAmount);
    });
  });

  describe("Compound Interest", () => {
    it("Correctly calculates results compound with capital <= 1000", () => {
      const capital = 1000;
      const term = 3;
      const benefitType = "compound" as const;
      const result = calculateReturns(capital, term, benefitType);

      expect(result.monthlyRate).toBe(1);
      expect(result.feeRate).toBe(2);
      expect(result.monthlyResults.length).toBe(term);

      // Mes 1
      const m1 = result.monthlyResults[0];
      expect(m1.month).toBe(1);
      expect(m1.initialCapital).toBe(capital);
      expect(m1.monthlyProfit).toBeCloseTo(1000 * 0.01);
      expect(m1.accumulatedProfit).toBeCloseTo(10);
      expect(m1.totalAmount).toBeCloseTo(1010);

      // Mes 2
      const m2 = result.monthlyResults[1];
      expect(m2.month).toBe(2);
      expect(m2.initialCapital).toBeCloseTo(m1.totalAmount);
      expect(m2.monthlyProfit).toBeCloseTo(1010 * 0.01);
      expect(m2.accumulatedProfit).toBeCloseTo(1010 * 0.01 + 10);
      expect(m2.totalAmount).toBeCloseTo(1010 + 1010 * 0.01);

      // Mes 3
      const m3 = result.monthlyResults[2];
      expect(m3.month).toBe(3);
      expect(m3.initialCapital).toBeCloseTo(m2.totalAmount);
      expect(m3.monthlyProfit).toBeCloseTo(m2.totalAmount * 0.01);
      expect(m3.totalAmount).toBeCloseTo(m2.totalAmount + m3.monthlyProfit);

      // Valores finales
      const finalAmount = result.monthlyResults[term - 1].totalAmount; // Aproximadamente 1030.301
      const feeAmount = finalAmount * 0.02; // Aproximadamente 20.60602
      const netAmount = finalAmount - feeAmount; // Aproximadamente 1009.695

      expect(result.grossAmount).toBeCloseTo(finalAmount);
      expect(result.feeAmount).toBeCloseTo(feeAmount);
      expect(result.netAmount).toBeCloseTo(netAmount);
    });
  });

  describe("validation of monthlyRate by term", () => {
    it("use 1% for 3 months", () => {
      const { monthlyRate } = calculateReturns(5000, 3, "simple");
      expect(monthlyRate).toBe(1);
    });

    it("use 2% for 6 ", () => {
      const { monthlyRate } = calculateReturns(5000, 6, "simple");
      expect(monthlyRate).toBe(2);
    });

    it("use 3% for 9 ", () => {
      const { monthlyRate } = calculateReturns(5000, 9, "simple");
      expect(monthlyRate).toBe(3);
    });

    it("use 4% for 12 ", () => {
      const { monthlyRate } = calculateReturns(5000, 12, "simple");
      expect(monthlyRate).toBe(4);
    });
  });

  describe("validate feeRate by capital", () => {
    it("use feeRate  2% for capital <= 1000", () => {
      const { feeRate } = calculateReturns(1000, 3, "simple");
      expect(feeRate).toBe(2);
    });

    it("use feeRate  1% for capital <= 10000", () => {
      const { feeRate } = calculateReturns(5000, 3, "simple");
      expect(feeRate).toBe(1);
    });

    it("use feeRate  0.5% for capital <= 35000", () => {
      const { feeRate } = calculateReturns(20000, 3, "simple");
      expect(feeRate).toBe(0.5);
    });

    it("use feeRate 0.25% for capital > 35000", () => {
      const { feeRate } = calculateReturns(40000, 3, "simple");
      expect(feeRate).toBe(0.25);
    });
  });
});
