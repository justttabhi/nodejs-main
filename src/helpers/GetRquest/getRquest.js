import axios from "axios";
import { API_URL } from "../config";



export const GetAllUsers = async (params) => {

    try {
        const res = await axios.get(`${API_URL}/api/read`, {
            headers: {
                'Content-Type': 'application/json',
               
            }
        });
        return res?.data;
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

export const GetUserById = async (id) => {

    try {
        const res = await axios.get(`${API_URL}/api/getUserById/${id}`, {
            
            headers: {
                'Content-Type': 'application/json',
                
            }
        });
        return res?.data;
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}
export const DeleteUser = async (id) => {

    try {
        const res = await axios.get(`${API_URL}/api/delete/${id}`, {
         
            headers: {
                'Content-Type': 'application/json',
               
            }
        });
        return res?.data;
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

