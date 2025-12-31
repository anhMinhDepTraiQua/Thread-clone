// src/services/auth.js
import { httpRequest } from "@/utils/httpRequest";

const prefix = "/api/auth";

export const authService = {
  login: (body) => httpRequest.post(`${prefix}/login`, body),
  register: (body) => httpRequest.post(`${prefix}/register`, body),
  forgotPassword: (body) => httpRequest.post(`${prefix}/forgot-password`, body),
};
