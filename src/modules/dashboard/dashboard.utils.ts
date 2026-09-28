import { Prisma } from "@prisma/client";


export const calculatePercentageChange = (
    current: Prisma.Decimal,
    previous: Prisma.Decimal,
) => {

    if (previous.eq(0)) {

        if (current.eq(0)) {

            return {
                percentageChange: 0,
                direction: "NO_CHANGE" as const,
                comparisonAvailable: true,
            };
        }

        return {
            percentageChange: null,
            direction: "INCREASE" as const,
            comparisonAvailable: false,
        };
    }

    const percentage = current
        .sub(previous)
        .div(previous)
        .mul(100);

    return {

        percentageChange: Number(
            percentage.toDecimalPlaces(2).toString(),
        ),
        
        direction: current.gt(previous)
            ? ("INCREASE" as const)
            : current.lt(previous)
                ? ("DECREASE" as const)
                : ("NO_CHANGE" as const),
        comparisonAvailable: true,
    };
};