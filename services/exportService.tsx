import { utils, writeFile } from "xlsx";
import type { ResultCalculator } from "interfaces/result-calculator";

export const exportToExcel = (data: ResultCalculator, filename: string) => {
  const monthlyData = data.monthlyResults.map((result) => ({
    Mes: result.month,
    "Capital Inicial": `$${result.initialCapital.toFixed(2)}`,
    "Beneficio Mensual": `$${result.monthlyProfit.toFixed(2)}`,
    "Beneficio Acumulado": `$${result.accumulatedProfit.toFixed(2)}`,
    "Monto Total": `$${result.totalAmount.toFixed(2)}`,
  }));

  const summaryData = [
    {
      Concepto: "Capital Inicial",
      Valor: `$${data.initialCapital.toFixed(2)}`,
    },
    { Concepto: "Tasa Mensual", Valor: `${data.monthlyRate}%` },
    { Concepto: "Plazo (meses)", Valor: data.term },
    {
      Concepto: "Tipo de Beneficio",
      Valor: data.benefitType === "simple" ? "Simple" : "Compuesto",
    },
    { Concepto: "Monto Bruto Final", Valor: `$${data.grossAmount.toFixed(2)}` },
    { Concepto: "Tasa de Fee", Valor: `${data.feeRate}%` },
    { Concepto: "Monto del Fee", Valor: `$${data.feeAmount.toFixed(2)}` },
    {
      Concepto: "Monto Neto a Recibir",
      Valor: `$${data.netAmount.toFixed(2)}`,
    },
  ];

  const wb = utils.book_new();

  const wsMonthly = utils.json_to_sheet(monthlyData);
  utils.book_append_sheet(wb, wsMonthly, "Resultados Mensuales");

  const wsSummary = utils.json_to_sheet(summaryData);
  utils.book_append_sheet(wb, wsSummary, "Resumen");

  const monthlyColWidths = [
    { wch: 8 }, // Mes
    { wch: 15 }, // Capital Inicial
    { wch: 15 }, // Beneficio Mensual
    { wch: 18 }, // Beneficio Acumulado
    { wch: 15 }, // Monto Total
  ];
  wsMonthly["!cols"] = monthlyColWidths;

  const summaryColWidths = [
    { wch: 20 }, // Concepto
    { wch: 15 }, // Valor
  ];
  wsSummary["!cols"] = summaryColWidths;

  // Guardar el archivo
  writeFile(wb, `${filename}.xlsx`);
};

