
import { useEffect, useState } from "react";
import api from "../api/api";
import { handleApiError } from "../utils/handleApiError";

export const useLoanData = (memberId, { logout, login }) => {
    const [loan, setLoan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loanAmount, setLoanAmount] = useState(0);
    const [remainingLoan, setRemainingLoan] = useState(0);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!memberId) {
            setLoan(null)
            setLoanAmount(0)
            setRemainingLoan(0)
            setNotFound(false)
            return
        }
        (async () => {
            setLoading(true);
            setNotFound(false);
            try {
                const res = await api.get(`/loan/search/${memberId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const data = res.data.data;
                if (data) {
                    setLoan(data);
                    setLoanAmount(Number(data.amount));
                    const totalInstallments = (data.installment || []).reduce(
                        (sum, it) => sum + Number(it?.amount || 0),
                        0
                    );
                    setRemainingLoan(Number(data.amount) - totalInstallments);
                } else {
                    setLoan(null);
                    setLoanAmount(0);
                    setRemainingLoan(0);
                    setNotFound(true);
                }
            } catch (err) {
                handleApiError(err, null, { logout, login });
            } finally {
                setLoading(false);
            }
        })();
    }, [memberId, login, logout]);

    return { loan, loanAmount, remainingLoan, loading, notFound };
};
