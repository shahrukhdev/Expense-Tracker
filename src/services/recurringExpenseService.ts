import api from "./api";

export const getRecurringExpenses = async (search?: string, page?: number, limit?: number) => {

    const response = await api.get("/recurring-expenses", {
        params: { search, page, limit }
    });

    return response.data;
};

export interface RecurringExpenseInterface {
    title: string,
    amount: number,
    categoryId?: string,
    frequency?: string,
    nextDueDate?: string,
};

export const createRecurringExpense = async (data: RecurringExpenseInterface) => {

  const payload = {
    ...data,
    nextDueDate: data.nextDueDate ? new Date(data.nextDueDate) : undefined,
  };

    const response = await api.post("/recurring-expenses", payload);

    return response.data;
};

export const updateRecurringExpense = async (recurringExpenseId: string, data: RecurringExpenseInterface) => {

    const payload = {
        ...data,
        nextDueDate: data.nextDueDate ? new Date(data.nextDueDate) : undefined,
    };

    const response = await api.put(`/recurring-expenses/${recurringExpenseId}`, payload);

    return response.data;
};

export const deleteRecurringExpense = async (recurringExpenseId: string) => {
  
    const response = await api.delete(`/recurring-expenses/${recurringExpenseId}`);

    return response.data;
};