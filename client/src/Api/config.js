import axios from "axios";
const BASE_URL = "http://localhost:3000";
axios.defaults.withCredentials = true;

export const registerCustomer = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/signup`, userData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const Logincustomer = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, userData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const LogoutCustomer = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/logout`,
      {},
      { withCredentials: true }
    );

    if (response.status === 200) {
      console.log("Customer logged out successfully.");
      localStorage.removeItem("customerToken");
      return response.data;
    }
  } catch (error) {
    console.error("Error logging out customer:", error);
  }
};

export const verifyCustomer = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/verifyusertoken`, {
      withCredentials: true,
    });
    console.log("Response from verifyCustomer:", response);
    return response.data;
  } catch (error) {
    console.error("Error during user verification:", error.message);
    if (error.response && error.response.status === 403) {
      try {
        await refreshToken();
        const retryResponse = await axios.get(`${BASE_URL}/verifyusertoken`, {
          withCredentials: true,
        });
        console.log("Retry Response from verifyCustomer:", retryResponse);
        return retryResponse.data;
      } catch (refreshError) {
        console.error("Error during token refresh:", refreshError.message);
        throw refreshError;
      }
    }
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/refresh`, {
      withCredentials: true,
    });
    console.log("Response from refreshToken:", response);
    return response.data;
  } catch (error) {
    console.error("Error during token refresh:", error.message);
    throw error;
  }
};

export const getCredits = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/credits`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching count of PetRecord:", error);
    throw error;
  }
};

export const generateImages = async (prompt, token) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const { data } = await axios.post(
      `${BASE_URL}/Image/generate-image`,
      { prompt },
      {
        withCredentials: true,
        headers: headers,
      }
    );

    if (data && data.image) {
      return data.image;
    } else {
      console.error("Error generating image:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error generating image:", error.message);
    return null;
  }
};

export const Payment = async (userData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/userpayment/payment`,
      userData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export const SendUserForgotPassword = async (data) => {
  try {
    const SendAdminForgotPassword = await axios.post(
      `${BASE_URL}/user/Customerforgotpassword`,
      data
    );
    return SendAdminForgotPassword.data;
  } catch (error) {
    console.log(error);
  }
};

export const ResetUserPassword = async (id, token, data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/ResetPassword/${id}/${token}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};
