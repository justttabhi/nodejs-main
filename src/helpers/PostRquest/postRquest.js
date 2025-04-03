import axios from "axios";
import { API_URL } from "../config";

export const AddUser = async (data) => {
    try {

        const res = await axios.post(`${API_URL}/api/create`, data, {
            headers: {
                "Content-Type": "multipart/form-data",

            }
        });


        return res.data;
    } catch (error) {

        console.error("Error:", error.response ? error.response.data : error.message);
      
    }
};

export const UpdateUser = async (data) => {
    try {

        const res = await axios.post(`${API_URL}/api/update`, data, {
            headers: {
                "Content-Type": "multipart/form-data",

            }
        });


        return res.data;
    } catch (error) {

        console.error("Error:", error.response ? error.response.data : error.message);
      
    }
};