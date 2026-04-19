import api from "../services/api";

export const getExpenses = async (search ?: string, page ?: number, limit ?: number) => {

    const response = await api.get("/expenses", {
        params: { search, page, limit }
    });

    return response.data;
};

export interface ExpenseInterface {
    title: string,
    amount: number,
    categoryId?: string,
    description?: string,
    date?: string,
    paymentMethod?: string
};

export const createExpense = async (data: ExpenseInterface) => {

  const payload = {
    ...data,
    date: data.date ? new Date(data.date) : undefined,
  };

    const response = await api.post("/expenses", payload);

    return response.data;
};

export const updateExpense = async (expenseId: string, data: ExpenseInterface) => {

    const payload = {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
    };

    const response = await api.put(`/expenses/${expenseId}`, payload);

    return response.data;
};

export const deleteExpense = async (expenseId: string) => {
  
    const response = await api.delete(`/expenses/${expenseId}`);

    return response.data;
};