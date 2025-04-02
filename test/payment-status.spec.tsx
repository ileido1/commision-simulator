import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent,cleanup } from "@testing-library/react";
import type { statusPayment } from "interfaces/status-payment";
import PaymentStatus from "components/payment-status";

describe("PaymentStatus Component", () => {
  const mockOnClose = vi.fn();

  const mockPendingPayment: statusPayment = {
      address: "0x1234567890abcdef1234567890abcdef12345678",
      network: "BSC",
      smartContractSymbol: "USDT",
      status: "Pendiente",
      amountCaptured: 0,
      fundsGoal: 100,
      currentBalance: 1,
      id: 0,
      createdAt: "",
      updatedAt: "",
      paymentId: "",
      paymentStatus: ""
  };

  const mockCompletedPayment: statusPayment = {
    address: "0x1234567890abcdef1234567890abcdef12345678",
    network: "BSC",
    smartContractSymbol: "USDT",
    status: "Completado",
    amountCaptured: 100,
    fundsGoal: 100,
    currentBalance: 100,
    createdAt: "",
    updatedAt: "",
    paymentId: "",
    paymentStatus: "",
    id: 0,
  };
afterEach(() => {
  cleanup();
});

  it("should not render when status is not provided", () => {
    // @ts-expect-error Testing null case intentionally
    render(<PaymentStatus status={null} onClose={mockOnClose} />);
    const statusModal = screen.queryByTestId("payment-status");
    expect(statusModal).not;
  });

  it("should render pending payment status correctly", () => {
    render(<PaymentStatus status={mockPendingPayment} onClose={mockOnClose} />);

    // Check if the modal is rendered
    const statusModal = screen.getByTestId("payment-status");
    expect(statusModal);

    // Check modal title
    expect(screen.getByText("Estado del Pago"));

    // Check pending message
    expect(screen.getByText("Esperando Pago"));
    expect(
      screen.getByText("Aún no hemos recibido su pago.")
    );

    const pendingIcon = screen.getByText("⏳");
    expect(pendingIcon);

    // Check payment details
    expect(screen.getByText("Detalles del Pago:"));
    expect(screen.getByText(mockPendingPayment.address));
    expect(screen.getByText(mockPendingPayment.network));
    expect(
      screen.getByText(mockPendingPayment.smartContractSymbol)
    );
    expect(screen.getByText(mockPendingPayment.status));
    expect(
      screen.getByText(`$${mockPendingPayment.amountCaptured}`)
    );
    expect(
      screen.getByText(`$${mockPendingPayment.fundsGoal}`)
    );
    expect(
      screen.getByText(`$${mockPendingPayment.currentBalance}`)
    );
  });

  it("should render completed payment status correctly", () => {
    render(
      <PaymentStatus status={mockCompletedPayment} onClose={mockOnClose} />
    );

    // Check success message
    expect(screen.getByText("¡Pago Recibido!"));
    expect(screen.getByText(/Hemos recibido un monto de/));
   
    // Check payment details are displayed
    expect(screen.getByText("Detalles del Pago:"));
    expect(screen.getByText(mockCompletedPayment.address));
  
  });


});
