export interface SinglePayment {
    address: string;
    network: string;
    fundsGoal: number;
    smartContractAddress: string;
    accounts: string[];
    timeStart: number;
    timeEnd: number;
    timeDelta: number;
}
    