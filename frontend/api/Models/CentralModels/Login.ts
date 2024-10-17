export type LoginRequestModel = {
    loginName?: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
    userId?: number;
    token?: string;
    firstName?: string;
    lastName?: string;
    isGuest?: boolean;
    isTermsAndConditions?: boolean;
    source?: string;
    dob?: string;
};
