export declare function generateOtp(digits: number, expiration?: string | number | undefined, secret?: string): {
    otp: number;
    token: string;
};
export interface DecodedOtpPayload {
    otp: string;
    iat: number;
    exp: number;
}
export declare function verifyOtp(otp: number, token: string, secret?: string): boolean;
