"use client";
import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "http://localhost:4000/api/user";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });

    if (response.data.token) {
      const { token, userId, username, role, createdAt, email, phoneNumber } =
        response.data;
      try {
        // Store token in cookies for better security
        Cookies.set("token", token, {
          expires: 1,
          secure: true,
          sameSite: "Strict",
        });
      } catch (error) {
        console.error("Failed to set token in cookies:", error);
      }
      // Store user details in sessionStorage (or localStorage if needed)
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("phoneNumber", phoneNumber);
      sessionStorage.setItem("createdAt", createdAt);
      return { success: true, message: "Login successful!", role };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Server error, try again!",
    };
  }
};
// otp bsed login

export const sendLoginOTP = async (phoneNumber) => {
  try {
    const response = await axios.post(`${BASE_URL}/send-otp`, { phoneNumber });
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "⚠️ Failed to send OTP!",
    };
  }
};

// Verify OTP and login
export const verifyLoginOTP = async (phoneNumber, otp) => {
  try {
    const response = await axios.post(`${BASE_URL}/verify-otp`, {
      phoneNumber,
      otp,
    });

    if (response.data.token) {
      const { token, userId, username, role, createdAt, email, phoneNumber } =
        response.data;

      // Save JWT token in cookies
      Cookies.set("token", token, {
        expires: 1, // 1 day
        secure: true,
        sameSite: "Strict",
      });

      // Save user data in sessionStorage
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("phoneNumber", phoneNumber);
      sessionStorage.setItem("createdAt", createdAt);

      return {
        success: true,
        message: response.data.message,
        role,
      };
    } else {
      return {
        success: false,
        message: response.data.message,
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "❌ Invalid OTP or server error!",
    };
  }
};

// register user
export const registerUser = async (email, password, username, phone) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, {
      email,
      password,
      username,
      phone,
    });
    return { success: true, message: response.data.message };
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return { success: false, message: error.response.data.message };
    }
    return { success: false, message: "Server error. Please try again!" };
  }
};

// New function: request an OTP
export const sendOTP = async (phone) => {
  try {
    const response = await axios.post(`${BASE_URL}/send-otp`, { phone });
    return { success: true, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Server error. Please try again!",
    };
  }
};

// New function: login with OTP
export const loginWithOTP = async (phone, otp) => {
  try {
    const response = await axios.post(`${BASE_URL}/otp-login`, { phone, otp });

    if (response.data.token) {
      const { token, userId, username, role, createdAt, email } = response.data;
      try {
        Cookies.set("token", token, {
          expires: 1,
          secure: true,
          sameSite: "Strict",
        });
      } catch (error) {
        console.error("Failed to set token in cookies:", error);
      }
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("createdAt", createdAt);
      return { success: true, message: "Login successful!", role };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Server error, try again!",
    };
  }
};

export const logoutUser = () => {
  Cookies.remove("token");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  window.location.href = "/login";
};
