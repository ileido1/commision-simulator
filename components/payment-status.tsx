import type { statusPayment } from "interfaces/status-payment";
import React from "react";


interface PaymentStatusProps {
  status: statusPayment;
  onClose: () => void;
}


const PaymentStatus : React.FC<PaymentStatusProps> = ({ status, onClose }) => {
  if (!status) return null;

  const paymentReceived = status.amountCaptured > 0;

  return (
    <div
      data-testid="payment-status"
      className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity flex items-center justify-center z-50"
    >
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl transform transition-all">
        <div className="sticky top-0 z-10 flex justify-between items-center bg-blue-600 text-white px-6 py-4">
          <h3 className="text-xl font-bold">Estado del Pago</h3>
          <button
            data-testid="close-status"
            onClick={onClose}
            className="text-white text-2xl hover:text-gray-200 transition-colors focus:outline-none"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {paymentReceived ? (
            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-500 text-3xl">✓</span>
              </div>
              <h4 className="text-xl font-bold text-green-600 mb-2">
                ¡Pago Recibido!
              </h4>
              <p className="text-gray-600">
                Hemos recibido un monto de{" "}
                <span className="font-semibold" data-testid="payment-amount">
                  ${status.amountCaptured} {status.smartContractSymbol}
                </span>
                .
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-yellow-500 text-3xl">⏳</span>
              </div>
              <h4 className="text-xl font-bold text-yellow-600 mb-2">
                Esperando Pago
              </h4>
              <p className="text-gray-600">Aún no hemos recibido su pago.</p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h5 className="font-bold text-gray-700 mb-3">Detalles del Pago:</h5>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Dirección:</div>
              <div className="text-gray-800 font-medium truncate">
                {status.address}
              </div>

              <div className="text-gray-500">Red:</div>
              <div className="text-gray-800 font-medium">{status.network}</div>

              <div className="text-gray-500">Moneda:</div>
              <div className="text-gray-800 font-medium">
                {status.smartContractSymbol}
              </div>

              <div className="text-gray-500">Estado:</div>
              <div className="text-gray-800 font-medium">{status.status}</div>

              <div className="text-gray-500">Monto Capturado:</div>
              <div
                className={`font-medium ${
                  paymentReceived ? "text-green-600" : "text-gray-800"
                }`}
              >
                ${status.amountCaptured}
              </div>

              <div className="text-gray-500">Monto Objetivo:</div>
              <div className="text-gray-800 font-medium">
                ${status.fundsGoal}
              </div>

              <div className="text-gray-500">Balance Actual:</div>
              <div className="text-gray-800 font-medium">
                ${status.currentBalance}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
