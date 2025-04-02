import axios from "axios";
import { describe, it, expect, vi } from "vitest";
import { createPayment, checkPaymentStatus } from "services/paymentService";

vi.mock("axios");

describe("Payment Service", () => {
  describe("createPayment", () => {
    it("should create a payment and return the data", async () => {
      const mockedData = { address: "abc123" };
      // Simulate the axios.post response
      (axios.post as vi.Mock).mockResolvedValue({ data: mockedData });

      const amount = 100;
      const result = await createPayment(amount);

      expect(result).toEqual(mockedData);
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/api/create-payment",
        { amount }
      );
    });

    it("should throw an error when axios.post fails", async () => {
      const error = new Error("Network error");
      (axios.post as vi.Mock).mockRejectedValue(error);

      await expect(createPayment(100)).rejects.toThrow("Network error");
    });
  });

  describe("checkPaymentStatus", () => {
    it("should return the payment status", async () => {
      const mockedData = { status: "success" };
      // Simulate the axios.get response
      (axios.get as vi.Mock).mockResolvedValue({ data: mockedData });

      const address = "abc123";
      const result = await checkPaymentStatus(address);

      expect(result).toEqual(mockedData);
      expect(axios.get).toHaveBeenCalledWith(
        `http://localhost:5000/api/check-payment/${address}`
      );
    });

    it("should throw an error when axios.get fails", async () => {
      const error = new Error("Network error");
      (axios.get as vi.Mock).mockRejectedValue(error);

      await expect(checkPaymentStatus("abc123")).rejects.toThrow(
        "Network error"
      );
    });
  });
});
