import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import QRPayment from "components/qr-payment";


vi.mock("react-qr-code", () => ({
  default: ({ value }: { value: string }) => (
    <div data-testid="mock-qr-code" data-value={value}>
      QR Code Mock
    </div>
  ),
}));

describe("QRPayment Component", () => {
  const mockPaymentData = {
    address: "0x1234567890abcdef1234567890abcdef12345678",
    network: "BSC",
    fundsGoal: 100,
  };

  const mockOnClose = vi.fn();

  it("should not render when payment data is not provided", () => {
    // @ts-expect-error Testing null case intentionally
    render(<QRPayment paymentData={null} onClose={mockOnClose} />);
    const paymentModal = screen.queryByTestId("qr-payment");
    expect(paymentModal).not;
  });

  it("should render QR payment modal with correct data", () => {
    render(<QRPayment paymentData={mockPaymentData} onClose={mockOnClose} />);

    // Check if the modal is rendered
    const paymentModal = screen.getByTestId("qr-payment");
    expect(paymentModal);

    // Check modal title
    expect(screen.getByText("Código QR de Pago"));

    // Check if QR code is rendered with correct value
    const qrCode = screen.getByTestId("mock-qr-code");
    expect(qrCode);
    expect(qrCode.getAttribute("data-value")).toBe(mockPaymentData.address);

    // Verify payment address is displayed
    expect(screen.getByText(mockPaymentData.address));

    // Check network information
    expect(screen.getByText("Red"));
    expect(screen.getByText(mockPaymentData.network));

    // Check amount information
    expect(screen.getByText("Monto"));
    expect(screen.getByText("$100 USD"));

    // Check warning message
    expect(screen.getByText("Importante:"));
    expect(
      screen.getByText(
        /Envíe el monto exacto a la dirección indicada usando la red BSC/i
      )
    );
  });

  it("should call onClose when close button in header is clicked", () => {

    const closeButton = screen.getByTestId("close-qr");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });


  it("should display the correct payment details", () => {
    const customPaymentData = {
      address: "0xCustomAddress123456789",
      network: "Ethereum",
      fundsGoal: 250.75,
    };

    render(<QRPayment paymentData={customPaymentData} onClose={mockOnClose} />);

    expect(screen.getByText(customPaymentData.address));
    expect(screen.getByText(customPaymentData.network));
    expect(
      screen.getByText(`$${customPaymentData.fundsGoal} USD`)
    );
  });
});
