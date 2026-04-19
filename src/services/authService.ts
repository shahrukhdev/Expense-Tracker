import api from "./api";
// import axios from "axios";

// const API = axios.create({
//     baseURL: "http://localhost:8000/api/v1"
// });

export interface RegisterPayload {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}

export interface LoginPayload {
    email: string,
    password: string
}

export interface ForgotPasswordPayload {
    email: string
}

export interface ResetPasswordPayload {
    email: string,
    token: string,
    password: string,
    confirmPassword: string
}

export const registerUser = async (data: RegisterPayload) => {

    const response = await api.post("auth/register", data);

    return response.data;
};

export const loginUser = async (data: LoginPayload) => {

    const response = await api.post("/auth/login", data);
    
    return response.data;
};

export const forgotPassword = async (data: ForgotPasswordPayload) => {

    const response = await api.post("/auth/forgot-password", data);

    return response.data;
};

export const resetPassword = async (data: ResetPasswordPayload) => {

    const response = await api.post("/auth/reset-password", data);

    return response.data;
};