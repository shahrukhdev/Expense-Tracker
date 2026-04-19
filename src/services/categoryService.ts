import api from "./api";

export const getCategories = async (search?: string, page?: number, limit?: number) => {

    const response = await api.get("/categories", {
        params: { search, page, limit }
    });

    return response.data;
};

export interface CategoryInterface {
    name: string,
    icon?: string,
    color?: string,
};

export const addCategory = async (data: CategoryInterface) => {

    const response = await api.post("/categories", data);

    return response.data;
};

export const updateCategory = async (categoryId: string, data: CategoryInterface) => {

    const response = await api.put(`/categories/${categoryId}`, data);

    return response.data;
};

export const deleteCategory = async (categoryId: string) => {
  
    const response = await api.delete(`/categories/${categoryId}`);

    return response.data;
};

