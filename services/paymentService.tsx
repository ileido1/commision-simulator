import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

/**
 * Creates a payment request for the specified amount
 * @param {number} amount - The payment amount in USD
 * @returns {Promise} - The payment data response
 */
export const createPayment = async (amount : number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-payment`, {
      amount: amount,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

/**
 * Checks the status of a payment by its address
 * @param {string} address - The payment address to check
 * @returns {Promise} - The payment status response
 */
export const checkPaymentStatus = async (address : string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/check-payment/${address}`,
    );

    return response.data;
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw error;
  }
};
