import { Prisma } from "@/generated/prisma/index.js";

export const decimal = (
    value: Prisma.Decimal.Value
) => new Prisma.Decimal(value);

export const addMoney = (
    a: Prisma.Decimal.Value,
    b: Prisma.Decimal.Value
) => {
    return decimal(a).plus(decimal(b));
};

export const subtractMoney = (
    a: Prisma.Decimal.Value,
    b: Prisma.Decimal.Value
) => {
    return decimal(a).minus(decimal(b));
};

export const multiplyMoney = (
    a: Prisma.Decimal.Value,
    b: Prisma.Decimal.Value
) => {
    return decimal(a).times(decimal(b));
};

export const maxZero = (
    value: Prisma.Decimal.Value
) => {
    const amount = decimal(value);

    return amount.lessThan(0)
        ? decimal(0)
        : amount;
};