import type { BenefitType } from "interfaces/benefit-type";
import type { MonthlyResults } from "interfaces/monthly-results";
import type { ResultCalculator } from "interfaces/result-calculator";


export function calculateReturns (
  capital: number,
  term: number,
  benefitType: BenefitType
): ResultCalculator  {
  let monthlyRate;
  switch (term) {
    case 3:
      monthlyRate = 0.01; // 1%
      break;
    case 6:
      monthlyRate = 0.02; // 2%
      break;
    case 9:
      monthlyRate = 0.03; // 3%
      break;
    case 12:
      monthlyRate = 0.04; // 4%
      break;
    default:
      monthlyRate = 0.01;
  }

  // Calculte the fee rate based on the capital
  let feeRate;
  if (capital <= 1000) {
    feeRate = 0.02; // 2%
  } else if (capital <= 10000) {
    feeRate = 0.01; // 1%
  } else if (capital <= 35000) {
    feeRate = 0.005; // 0.5%
  } else {
    feeRate = 0.0025; // 0.25%
  }

  let currentCapital = capital;
  const monthlyResults: MonthlyResults[] = [];

  // Calculate monthly profits
  // and accumulate the total amount
  for (let month = 1; month <= term; month++) {
    let monthlyProfit;

    if (benefitType === "simple") {
      // simple interest
      // Calculate the monthly profit based on the initial capital
      // and the monthly rate
      // and accumulate the total amount
      monthlyProfit = capital * monthlyRate;
      const accumulatedProfit = monthlyProfit * month;
      const totalAmount = capital + accumulatedProfit;

      monthlyResults.push({
        month,
        initialCapital: capital,
        monthlyProfit,
        accumulatedProfit,
        totalAmount,
      });
    } else {
      // compound interest
      // Calculate the monthly profit based on the current capital
      // and the monthly rate
      // and accumulate the total amount
      monthlyProfit = currentCapital * monthlyRate;
      currentCapital += monthlyProfit;

      monthlyResults.push({
        month,
        initialCapital:
          month === 1 ? capital : monthlyResults[month - 2].totalAmount,
        monthlyProfit,
        accumulatedProfit: currentCapital - capital,
        totalAmount: currentCapital,
      });
    }
  }

  const finalAmount = monthlyResults[term - 1].totalAmount;
  const feeAmount = finalAmount * feeRate;
  const netAmount = finalAmount - feeAmount;

   return {
     initialCapital: capital,
     term,
     benefitType,
     monthlyRate: monthlyRate * 100,
     feeRate: feeRate * 100,
     feeAmount,
     grossAmount: finalAmount,
     netAmount,
     monthlyResults,
   };
};
