import React, { useEffect } from "react";
import QRCode from "react-qr-code";

interface QRPaymentProps {
  paymentData: {
    address: string;
    network: string;
    fundsGoal: number;
  };
  onClose: () => void;
}

const QRPayment: React.FC<QRPaymentProps> = ({ paymentData, onClose }) => {
  if (!paymentData) return null;



  return (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      data-testid="qr-payment"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl transform transition-all">
          <div className="sticky top-0 z-10 flex justify-between items-center bg-blue-600 text-white px-6 py-4">
            <h2 className="text-xl font-bold">Código QR de Pago</h2>
            <button
              data-testid="close-qr"
              onClick={onClose}
              className="text-white text-2xl hover:text-gray-200 transition-colors focus:outline-none"
              aria-label="Cerrar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-6">
              <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                <QRCode
                  value={paymentData.address}
                  size={200}
                  bgColor="#FFFFFF"
                  fgColor="#111827"
                  level="H"
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Dirección de pago:
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm break-all">
                    {paymentData.address}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="block text-sm text-gray-600">Red</span>
                    <span className="font-semibold text-gray-900">
                      {paymentData.network}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="block text-sm text-gray-600">Monto</span>
                    <span className="font-semibold text-gray-900">
                      ${paymentData.fundsGoal} USD
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Importante:</span> Envíe el
                  monto exacto a la dirección indicada usando la red BSC.
                  Verifique su transacción con el botón "Revisar Pago".
                </p>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 p-4 bg-gray-50 rounded-b-xl border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPayment;
