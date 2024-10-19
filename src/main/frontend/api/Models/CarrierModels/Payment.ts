export type PaymentInfo = {
    paymentId?: number;
    total: number;
    tax: number;
    packagingFee: number;
    serviceFee: number;
    discount: number;
    status?: number;
    mode: number;
    subTotal: number;
    deliveryFee: number;
    pendingAmount: number;
    razorpayTransactionId?: string;
    razorpayReceipt?: string;
    razorpayOrderId?: string;
    razorpayPaymentNotes?: string;
    razorpaySignature?: string;
    promoId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
}

export const GetPaymentMode = (paymentMode: string) => {
    switch (paymentMode) {
        case "Pay Now": return 1;
        case "Defer": return 2;
        case "COD": return 3;
    }
    return null;
}