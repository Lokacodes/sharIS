export default function calculateInstallmentBreakdown(principal, tenor, marginPercent) {
    // Ensure numeric types (frontend often sends numbers as strings)
    const p = Number(principal);
    const t = Number(tenor);
    const m = Number(marginPercent);

    if (isNaN(p) || isNaN(t) || isNaN(m)) {
        throw new Error("Inputs must be valid numbers.");
    }
    if (t <= 0) {
        throw new Error("Tenor must be greater than 0.");
    }

    const marginDecimal = m / 100;

    const totalMargin = p * marginDecimal;
    const totalPayment = p + totalMargin;

    const principalPerMonth = p / t;
    const marginPerMonth = totalMargin / t;
    const totalPerMonth = totalPayment / t;

    return {
        principalPerMonth: Math.round(principalPerMonth),
        marginPerMonth: Math.round(marginPerMonth),
        totalPerMonth: Math.round(totalPerMonth),
        totalMargin: Math.round(totalMargin),
        totalPayment: Math.round(totalPayment)
    };
}
