import api from "./api";

export const getIncomes = async (search?: string, page?: number, limit?: number) => {

    const response = await api.get("/incomes", {
        params: { search, page, limit }
    });

    return response.data;
};

export interface IncomeInterface {
    title: string,
    source?: string,
    amount: number,
    date?: string,
    description?: string,
};

export const createIncome = async (data: IncomeInterface) => {

  const payload = {
    ...data,
    date: data.date ? new Date(data.date) : undefined,
  };

    const response = await api.post("/incomes", payload);

    return response.data;
};

export const updateIncome = async (incomeId: string, data: IncomeInterface) => {

    const payload = {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
    };

    const response = await api.put(`/incomes/${incomeId}`, payload);

    return response.data;
};

export const deleteIncome = async (incomeId: string) => {
  
    const response = await api.delete(`/incomes/${incomeId}`);

    return response.data;
};