import type { ResultCalculator } from "interfaces/result-calculator";

interface ResultTableProps {
  results: ResultCalculator;
}

const ResultTable: React.FC<ResultTableProps> = ({ results }) => {
  if (!results) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <h2 className="text-2xl font-bold text-center py-4 bg-blue-800 text-white">
        Resultados de la Simulación
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-blue-50">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <span className="block text-sm text-gray-500 mb-1">
            Capital Inicial:
          </span>
          <span className="text-lg font-semibold text-blue-800">
            ${results.initialCapital.toFixed(2)}
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <span className="block text-sm text-gray-500 mb-1">Plazo:</span>
          <span className="text-lg font-semibold text-blue-800">
            {results.term} meses
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <span className="block text-sm text-gray-500 mb-1">
            Tasa Mensual:
          </span>
          <span className="text-lg font-semibold text-blue-800">
            {results.monthlyRate}%
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <span className="block text-sm text-gray-500 mb-1">
            Tipo de Beneficio:
          </span>
          <span className="text-lg font-semibold text-blue-800">
            {results.benefitType === "simple" ? "Simple" : "Interés Compuesto"}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Mes
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Capital Inicial
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Beneficio Mensual
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Beneficio Acumulado
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Monto Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.monthlyResults.map((result, index) => (
              <tr
                key={result.month}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.month}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${result.initialCapital.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${result.monthlyProfit.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${result.accumulatedProfit.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                  ${result.totalAmount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 p-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <span className="block text-sm text-gray-500 mb-1">
              Monto Bruto Final:
            </span>
            <span className="text-lg font-semibold text-gray-800">
              ${results.grossAmount.toFixed(2)}
            </span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <span className="block text-sm text-gray-500 mb-1">
              Fee ({results.feeRate}%):
            </span>
            <span className="text-lg font-semibold text-red-600">
              -${results.feeAmount.toFixed(2)}
            </span>
          </div>
          <div className="bg-blue-700 p-4 rounded-lg shadow-sm">
            <span className="block text-sm text-blue-200 mb-1">
              Monto Neto a Recibir:
            </span>
            <span className="text-lg font-bold text-white">
              ${results.netAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultTable;
