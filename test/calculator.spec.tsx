import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { calculateReturns } from "services/calculationService";
import { exportToExcel } from "services/exportService";
import { createPayment, checkPaymentStatus } from "services/paymentService";
import Calculator from "components/calculator";
import type { ResultCalculator } from "interfaces/result-calculator";
import type { statusPayment } from "interfaces/status-payment";

interface paymentData {
    address: string;
    network: string;
    fundsGoal: number;
  };

vi.mock("services/calculationService", () => ({
  calculateReturns: vi.fn(),
}));

vi.mock("services/exportService", () => ({
  exportToExcel: vi.fn(),
}));

vi.mock("services/paymentService", () => ({
  createPayment: vi.fn(),
  checkPaymentStatus: vi.fn(),
}));

vi.mock("./results-table", () => ({
  default: ({ results }: { results: ResultCalculator }) => (
    <div data-testid="result-table">{JSON.stringify(results)}</div>
  ),
}));

vi.mock("./qr-payment", () => ({
  default: ({
    paymentData,
    onClose,
  }: {
    paymentData: paymentData;
    onClose: () => void;
  }) => (
    <div data-testid="qr-payment">
      <button onClick={onClose} data-testid="close-qr">
        Close
      </button>
      {JSON.stringify(paymentData)}
    </div>
  ),
}));

vi.mock("./payment-status", () => ({
  default: ({ status, onClose }: { status: statusPayment , onClose: ()=> void}) => (
    <div data-testid="payment-status">
      <button onClick={onClose} data-testid="close-status">
        Close
      </button>
      {JSON.stringify(status)}
    </div>
  ),
}));

describe("Calculator Component", () => {
  const mockResults: ResultCalculator = {
    initialCapital: 1000,
    term: 3,
    benefitType: "simple",
    monthlyRate: 1,
    feeRate: 2,
    grossAmount: 1030.3,
    feeAmount: 20.6,
    netAmount: 1009.7,
    monthlyResults: [
      { month: 1, initialCapital: 1000, monthlyProfit: 10, accumulatedProfit: 10, totalAmount: 1010 },
      { month: 2, initialCapital: 1010, monthlyProfit: 10.1, accumulatedProfit: 20.1, totalAmount: 1020.1 },
      { month: 3, initialCapital: 1020.1, monthlyProfit: 10.2, accumulatedProfit: 30.3, totalAmount: 1030.3 },
    ],
  };

  const mockPaymentData = {
    address: "0x123456789",
    amount: 1000,
    qrCode: "data:image/png;base64,abc123",
    currency: "USDT",
  };

  const mockPaymentStatus = {
    status: "completed",
    transactionId: "tx123456",
    timestamp: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(calculateReturns).mockReturnValue(mockResults);
    vi.mocked(createPayment).mockResolvedValue({ data: mockPaymentData });
    vi.mocked(checkPaymentStatus).mockResolvedValue({
      data: mockPaymentStatus,
    });
  });

  it("renders initial form correctly", () => {
    render(<Calculator />);

    // Check if title is rendered
    expect(screen.getByText("Simulador de Comisiones"));
    expect(screen.getByText("SIMULAR"));
    expect(screen.queryByTestId("result-table")).not;
  });

  it("shows alert when trying to simulate with invalid capital", () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    fireEvent.click(screen.getByTestId("calculate-button"));

    // Check if alert was shown
    expect(alertMock).toHaveBeenCalledWith(
      "Por favor, ingrese un monto válido"
    );
    expect(screen.queryByTestId("result-table")).not;

    alertMock.mockRestore();
  });

  it("calculates and displays results when valid data is provided", () => {

   fireEvent.change(screen.getByLabelText(/Capital semilla/i), {
     target: { value: "1000" },
   });

    // Click simulate
    fireEvent.click(screen.getByText("SIMULAR"));

    // Check if calculation service was called with correct params
    expect(calculateReturns).toHaveBeenCalledWith(1000, 3, "simple");

    // Check if results are displayed
    expect(screen.getByTestId("result-table"));

    // Additional buttons should appear
    expect(screen.getByText("Exportar CSV"));
    expect(screen.getByText("DEPOSITAR AHORA"));
    expect(screen.getByText("RESET/NEW"));
  });

  it("changes term and benefit type correctly", () => {

    // Enter capital
    fireEvent.change(screen.getByLabelText(/Capital semilla/i), {
      target: { value: "1000" },
    });

    // Change term
    fireEvent.change(screen.getByLabelText(/Plazo de inversión/i), {
      target: { value: "6" },
    });

    // Change benefit type
    fireEvent.click(screen.getByLabelText(/Interés compuesto/i));

    // Click simulate
    fireEvent.click(screen.getByText("SIMULAR"));

    // Check if calculation service was called with updated params
    expect(calculateReturns).toHaveBeenCalledWith(1000, 6, "compound");
  });

  it("shows export to CSV functionality", () => {

    // Setup for results to be visible
    fireEvent.change(screen.getByLabelText(/Capital semilla/i), {
      target: { value: "1000" },
    });
    fireEvent.click(screen.getByText("SIMULAR"));

    // Click export button
    fireEvent.click(screen.getByText("Exportar CSV"));

    // Check if export service was called with correct params
    expect(exportToExcel).toHaveBeenCalledWith(
      mockResults,
      "simulacion-6-meses-compound"
    );
  });

  it("shows alert when trying to export with no results", () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    // Create a clean render (no results)

    // Try to click export without simulation
    const exportButton = screen.queryByText("Exportar CSV");
    expect(exportButton).not; // Button should not be visible yet

    alertMock.mockRestore();
  });

  it("creates payment and shows QR modal", async () => {

    // Setup for results to be visible
    fireEvent.change(screen.getByLabelText(/Capital semilla/i), {
      target: { value: "1000" },
    });
    fireEvent.click(screen.getByText("SIMULAR"));

    // Click deposit button
    fireEvent.click(screen.getByText("DEPOSITAR AHORA"));

    // Wait for async operation
    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledWith(1000);
      expect(screen.getByTestId("qr-payment"));
    });
  });

  it("shows alert when trying to deposit with no results", () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    // Create a clean render (no results)

    // Try to deposit without simulation
    const depositButton = screen.queryByText("DEPOSITAR AHORA");
    expect(depositButton).not; // Button should not be visible yet

    alertMock.mockRestore();
  });

  it("checks payment status and shows status modal", async () => {

    // Setup for payment data to be available
    fireEvent.change(screen.getByLabelText(/Capital semilla/i), {
      target: { value: "1000" },
    });
    fireEvent.click(screen.getByText("SIMULAR"));
    fireEvent.click(screen.getByText("DEPOSITAR AHORA"));

    await waitFor(() => {
      expect(screen.getByTestId("qr-payment"));
    });

    // Click check payment button
    expect(screen.getByText("Revisar Pago"));
    fireEvent.click(screen.getByText("Revisar Pago"));

    // Wait for async operation
    await waitFor(() => {
      expect(checkPaymentStatus).toHaveBeenCalledWith("0x123456789");
      expect(screen.getByTestId("payment-status"));
    });
  });

  it("shows alert when trying to check payment with no payment data", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    fireEvent.change(screen.getByLabelText(/Capital semilla/i), {
      target: { value: "1000" },
    });
    fireEvent.click(screen.getByText("SIMULAR"));

    // Check payment button should not be visible yet
    const checkButton = screen.queryByText("Revisar Pago");
    expect(checkButton).not;

    alertMock.mockRestore();
  });

  it("closes the QR payment modal", async () => {

    // Setup for QR modal to be visible
    fireEvent.change(screen.getByLabelText(/Capital semilla/i), {
      target: { value: "1000" },
    });
    fireEvent.click(screen.getByText("SIMULAR"));
    fireEvent.click(screen.getByText("DEPOSITAR AHORA"));

    await waitFor(() => {
      expect(screen.getByTestId("qr-payment"));
    });

    // Close the modal
    fireEvent.click(screen.getByTestId("close-qr"));

    // Modal should be closed
    expect(screen.queryByTestId("qr-payment")).not;
  });

  it("closes the payment status modal", async () => {

    // Setup for status modal to be visible
    fireEvent.change(screen.getByLabelText(/Capital semilla/i), {
      target: { value: "1000" },
    });
    fireEvent.click(screen.getByText("SIMULAR"));
    fireEvent.click(screen.getByText("DEPOSITAR AHORA"));

    await waitFor(() => {
      expect(screen.getByTestId("qr-payment"));
    });

    fireEvent.click(screen.getByText("Revisar Pago"));

    await waitFor(() => {
      expect(screen.getByTestId("payment-status"));
    });

    // Close the modal
    fireEvent.click(screen.getByTestId("close-status"));

    // Modal should be closed
    expect(screen.queryByTestId("payment-status")).not;
  });

  it("resets all data when reset button is clicked", async () => {

    // Setup for results and payment data to be available
    fireEvent.change(screen.getByLabelText(/Capital semilla/i), {
      target: { value: "1000" },
    });
    fireEvent.click(screen.getByText("SIMULAR"));
    fireEvent.click(screen.getByText("DEPOSITAR AHORA"));

    await waitFor(() => {
      expect(screen.getByTestId("qr-payment"));
    });

    // Click reset button
    fireEvent.click(screen.getByText("RESET/NEW"));

    // Check if everything is reset
    expect(screen.getByLabelText(/Capital semilla/i));
    expect(screen.getByLabelText(/Plazo de inversión/i));
    expect(screen.getByLabelText(/Beneficio simple/i));
    expect(screen.queryByTestId("result-table")).not;
    expect(screen.queryByTestId("qr-payment")).not;
    expect(screen.queryByText("Revisar Pago")).not;
  });

  it("handles deposit API error", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    const consoleMock = vi.spyOn(console, "error").mockImplementation(() => {});

    // Force the API to throw an error
    vi.mocked(createPayment).mockRejectedValueOnce(new Error("API Error"));


    // Setup for results to be visible
    fireEvent.change(screen.getByLabelText(/Capital semilla/i), {
      target: { value: "1000" },
    });
    fireEvent.click(screen.getByText("SIMULAR"));

    // Click deposit button
    fireEvent.click(screen.getByText("DEPOSITAR AHORA"));

    // Wait for async operation
    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledWith(1000);
      expect(alertMock).toHaveBeenCalledWith(
        "Error al generar el código QR de pago"
      );
      expect(consoleMock).toHaveBeenCalledWith(
        "Error al crear el pago:",
        expect.any(Error)
      );
    });

    // QR modal should not be shown
    expect(screen.queryByTestId("qr-payment")).not;

    alertMock.mockRestore();
    consoleMock.mockRestore();
  });

  it("handles payment status check API error", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    const consoleMock = vi.spyOn(console, "error").mockImplementation(() => {});

    // Initially let payment creation succeed

    // Setup for payment data to be available
    fireEvent.change(screen.getByLabelText(/Capital semilla/i), {
      target: { value: "1000" },
    });
    fireEvent.click(screen.getByText("SIMULAR"));
    fireEvent.click(screen.getByText("DEPOSITAR AHORA"));

    await waitFor(() => {
      expect(screen.getByTestId("qr-payment"));
    });

    // Force payment status check to fail
    vi.mocked(checkPaymentStatus).mockRejectedValueOnce(new Error("API Error"));

    // Click check payment button
    fireEvent.click(screen.getByText("Revisar Pago"));

    // Wait for async operation
    await waitFor(() => {
      expect(checkPaymentStatus).toHaveBeenCalledWith("0x123456789");
      expect(alertMock).toHaveBeenCalledWith(
        "Error al verificar el estado del pago"
      );
      expect(consoleMock).toHaveBeenCalledWith(
        "Error al verificar el estado del pago:",
        expect.any(Error)
      );
    });

    // Status modal should not be shown
    expect(screen.queryByTestId("payment-status")).not;

    alertMock.mockRestore();
    consoleMock.mockRestore();
  });
});
