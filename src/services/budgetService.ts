import api from "./api";

export const getBudgets = async (search?: string, page?: number, limit?: number) => {

    const response = await api.get("/budgets", {
        params: { search, page, limit }
    });

    return response.data;
};

export interface BudgetInterface {
    title: string,
    amount: number,
    categoryId?: string,
    year?: string
};

export const createBudget = async (data: BudgetInterface) => {

    const response = await api.post("/budgets", data);

    return response.data
};

export const updateBudget = async (budgetId: string, data: BudgetInterface) => {

    const response = await api.put(`/budgets/${budgetId}`, data);

    return response.data;
};

export const deleteBudget = async (budgetId: string) => {

    const response = await api.delete(`/budgets/${budgetId}`);

    return response.data;
};