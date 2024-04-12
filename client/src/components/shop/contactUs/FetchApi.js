import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

const fetchApi = async (data) => {
  try {
    console.log("data", data);
    const response = await axios.post(
      `${apiURL}/api/contactUs/send-email`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in API call:", error);
    throw error;
  }
};

export const sendEmail = async (emailData) => {
  return await fetchApi(emailData);
};
