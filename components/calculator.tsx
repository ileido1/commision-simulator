import type { BenefitType } from "interfaces/benefit-type";
import type { ResultCalculator } from "interfaces/result-calculator";
import React, { useState } from "react";
import { calculateReturns } from "services/calculationService";
import ResultTable from "./results-table";
import { exportToExcel } from "services/exportService";
import QRPayment from "./qr-payment";
import PaymentStatus from "./payment-status";
import type { statusPayment } from "interfaces/status-payment";
import { checkPaymentStatus, createPayment } from "services/paymentService";
import type { SinglePayment } from "interfaces/single-payment";

const Calculator = () => {
  const [capital, setCapital] = useState("");
  const [term, setTerm] = useState("3");
  const [benefitType, setBenefitType] = useState<BenefitType>("simple");
  const [results, setResults] = useState<ResultCalculator>();
  const [paymentData, setPaymentData] = useState<SinglePayment>();
  const [paymentStatus, setPaymentStatus] = useState < statusPayment>();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 const [showModal, setShowModal] = useState(false);
  const handleSimulation = () => {
    if (!capital || isNaN(parseFloat(capital)) || parseFloat(capital) <= 0) {
      alert("Por favor, ingrese un monto válido");
      return;
    }

    const calculatedResults = calculateReturns(
      parseFloat(capital),
      parseInt(term),
      benefitType
    );
    setResults(calculatedResults);
  };



   const handleDeposit = async () => {
      try {
        if (!results) {
          alert("Primero debe realizar una simulación");
          return;
        }
  
        setIsLoading(true);
        const response = await createPayment(parseFloat(capital));
        const payment = response.data || response;
        setPaymentData(payment);
        setShowModal(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al crear el pago:", error);
        alert("Error al generar el código QR de pago");
        setIsLoading(false);
      }
    };

  const handleCheckPayment = async () => {
    try {
      if (!paymentData) {
        alert("Primero debe generar un código de pago");
        return;
      }
        const status = await checkPaymentStatus(paymentData.address);
        setPaymentStatus(status.data);
      setShowStatusModal(true);
    } catch (error) {
      console.error("Error al verificar el estado del pago:", error);
      alert("Error al verificar el estado del pago");
    }
  };

  const handleExportCSV = () => {
    if (!results) {
      alert("Primero debe realizar una simulación");
      return;
    }
    exportToExcel(results, `simulacion-${term}-meses-${benefitType}`);
  };

  const handleReset = () => {
    setCapital("");
    setTerm("3");
    setBenefitType("simple");
    setResults(undefined);
    setPaymentData(undefined);
    setPaymentStatus(undefined);
    setShowStatusModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 py-8 bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-blue-800 mb-8">
        Simulador de Comisiones
      </h1>

      <div className="w-full bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="form-group">
            <label htmlFor="capital" className="block text-sm font-medium text-gray-700 mb-2">
              Capital semilla (USD):
            </label>
            <input
              type="number"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              placeholder="Ingrese su capital"
              id="capital"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div className="form-group">
            <label htmlFor="investing" className="block text-sm font-medium text-gray-700 mb-2">
              Plazo de inversión:
            </label>
            <select
            id="investing"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-colors"
            >
              <option value="3">3 meses (1% mensual)</option>
              <option value="6">6 meses (2% mensual)</option>
              <option value="9">9 meses (3% mensual)</option>
              <option value="12">12 meses (4% mensual)</option>
            </select>
          </div>
        </div>

        <div className="form-group mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de beneficio:
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="simple"
                checked={benefitType === "simple"}
                onChange={() => setBenefitType("simple")}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Beneficio simple</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="compound"
                checked={benefitType === "compound"}
                onChange={() => setBenefitType("compound")}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Interés compuesto</span>
            </label>
          </div>
        </div>

        <button
          data-testid="calculate-button"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleSimulation}
          disabled={isLoading}
        >
          SIMULAR
        </button>
      </div>

      {results && (
        <div className="w-full">
          <ResultTable results={results} />

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={handleExportCSV}
              disabled={isLoading}
            >
              Exportar CSV
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={handleDeposit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                "DEPOSITAR AHORA"
              )}
            </button>
            {paymentData && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isLoading}
                onClick={handleCheckPayment}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verificando...
                  </>
                ) : (
                  "Revisar Pago"
                )}
              </button>
            )}
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={handleReset}
              disabled={isLoading}
            >
              RESET/NEW
            </button>
          </div>
        </div>
      )}

      {paymentData && showModal && (
        <QRPayment
          paymentData={paymentData}
          onClose={() => setShowModal(false)}
        />
      )}

      {showStatusModal && paymentStatus && (
        <PaymentStatus
          status={paymentStatus}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </div>
  );
};

export default Calculator;
