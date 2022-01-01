import axios from "axios";
import { API_HOST } from "../constants/api-routes";
import { LoginRequest, LoginResponse } from "../app/reducers/auth-slice";
import {
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    OtpRequest,
    OtpResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    STATUS,
} from "../app/reducers/forgot-pwd-slice";

export const forgotPasswordService = {
    async getOtp(req: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
        try {
            const response = (await axios.post(`${API_HOST}/auth/forgot-password`, req)) as any;
            return response.data;
        } catch (error: any) {
            return error?.response?.data;
        }
    },

    async sendOtp(req: OtpRequest): Promise<OtpResponse> {
        try {
            const response = (await axios.post(`${API_HOST}/auth/verify`, req)) as any;
            return response.data;
        } catch (error: any) {
            return error?.response?.data;
        }
    },

    async resetPassword(req: ResetPasswordRequest): Promise<ResetPasswordResponse> {
        try {
            const response = (await axios.post(`${API_HOST}/auth/reset-password`, req)) as any;
            return response.data;
        } catch (error: any) {
            return error?.response?.data;
        }
    },
};
