import api from "./api"

export const getUser = async () => {

    const response = await api.get("/user");

    return response.data;
};

export interface UserInterface {
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
};

export const updateUser = async (data: UserInterface) => {

    const response = await api.post("/update-user", data);

    return response.data;
};