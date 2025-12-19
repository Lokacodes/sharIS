
import { useEffect, useState } from "react";
import api from "../api/api";
import { handleApiError } from "../utils/handleApiError";

export const useSavingData = (memberId, { logout, login }) => {
    const [saving, setSaving] = useState(null);
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!memberId) return;
        (async () => {
            setLoading(true);
            setNotFound(false);
            try {
                const res = await api.get(`/saving/member/${memberId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const data = res.data.data;
                if (data) {
                    setSaving(data);
                } else {
                    setSaving(null);
                    setNotFound(true);
                }
            } catch (err) {
                handleApiError(err, null, { logout, login });
            } finally {
                setLoading(false);
            }
        })();
    }, [memberId, login, logout]);

    return { saving, loading, notFound };
};
