import { useEffect, useState } from "react";
import api from "../api/api";
import { handleApiError } from "../utils/handleApiError";

export const useDashboardData = ({ login, logout }) => {
    const [dashboard, setDashboard] = useState({
        memberCount: 0,
        loan: {
            paid: 0,
            unpaid: 0,
        },
        saving: {
            pokok: 0,
            wajib: 0,
            sukarela: 0,
            total: 0
        }
    });

    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setNotFound(false);

            try {
                const token = localStorage.getItem("token");

                const [savingRes, loanRes, memberRes] = await Promise.all([
                    api.get("/saving/sum", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    api.get("/loan/sum", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    api.get("/members/count", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                ]);

                const savingData = savingRes.data?.data;
                const loanData = loanRes.data?.data;
                const memberData = memberRes.data?.data;

                if (savingData && loanData && memberData !== undefined) {
                    setDashboard({
                        memberCount: Number(memberData) || 0,
                        loan: {
                            paid: Number(loanData.paidLoan) || 0,
                            unpaid: Number(loanData.unpaidLoan) || 0,
                        },
                        saving: {
                            pokok: Number(savingData.simpananPokok) || 0,
                            wajib: Number(savingData.simpananWajib) || 0,
                            sukarela: Number(savingData.simpananSukarela) || 0,
                            total: Number(savingData.simpananPokok) + Number(savingData.simpananWajib) + Number(savingData.simpananSukarela)
                        }
                    });
                } else {
                    setNotFound(true);
                }

            } catch (err) {
                handleApiError(err, null, { logout, login });
            } finally {
                setLoading(false);
            }
        })();
    }, [login, logout]);

    return { dashboard, loading, notFound };
};
