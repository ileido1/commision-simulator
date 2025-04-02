import type { BenefitType } from "./benefit-type";
import type { MonthlyResults } from "./monthly-results";

export interface ResultCalculator {
  initialCapital: number;
  term: number;
  benefitType: BenefitType;
  monthlyRate: number;
  feeRate: number;
  feeAmount: number;
  grossAmount: number;
  netAmount: number;
  monthlyResults: MonthlyResults[];
}

