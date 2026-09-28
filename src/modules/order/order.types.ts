export type OrderQuery = {
    page?: string,
    limit?: string,
    search?: string,
    status?: string,
    customerId?: string,
    deliveryDate?: string
    period?: "current_month" | "previous_month" | "custom";
    date?: string;
    month?: string;
}