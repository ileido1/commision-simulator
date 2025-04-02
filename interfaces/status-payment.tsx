export interface statusPayment {
    id: number;
    address: string;
    network: string;
    smartContractSymbol: string;
    status: string;
    amountCaptured: number;
    fundsGoal: number;
    currentBalance: number;
    createdAt: string;
    updatedAt: string;
    paymentId: string;
    paymentStatus: string;
}