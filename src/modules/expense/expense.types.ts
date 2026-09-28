export type ExpenseQuery = {
    page?: string,
    limit?: string,
    expenseCategoryId?: string,
    orderNumber?: string
    startDate?: string
    endDate?: string
    period?: "current_month" | "previous_month" | "custom";
    date?: string;
    month?: string;
}