import { useEffect, useMemo, useState } from "react";
import {
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../api/api";
import { handleApiError } from "../../../../utils/handleApiError";
import { useAuth } from "../../../../context/AuthContext";
import { useError } from "../../../../context/ErrorContext";

export default function SHUConfigDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { logout, login } = useAuth();
    const { showError } = useError();

    const [tahun, setTahun] = useState("");
    const [config, setConfig] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchDetail = async () => {
            setLoading(true);

            try {
                const res = await api.get(`/shuConfig?tahun=${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!isMounted) return;

                const data = res.data?.data?.[0];

                if (!data) return;

                setTahun(data.tahun);
                setItems(
                    data.items.map((i) => ({
                        key: i.key,
                        percent: i.percent.toString(),
                    }))
                );
                setConfig(data);
            } catch (err) {
                const result = await handleApiError(err, { login, logout });

                if (result && !result.silent) {
                    showError(result.message, result.title);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchDetail();

        return () => {
            isMounted = false;
        };
    }, [id, login, logout, showError]);

    const totalPercent = useMemo(
        () =>
            items.reduce(
                (sum, i) => sum + (parseFloat(i.percent) || 0),
                0
            ),
        [items]
    );

    const isValidTotal = totalPercent === 100;

    const updateItem = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };

    const addItem = () => {
        setItems([...items, { key: "", percent: "" }]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!isValidTotal || !config || loading) return;

        setLoading(true);

        try {
            await api.patch(
                `/shuConfig/${config.id}`,
                {
                    tahun,
                    items: items.map((i) => ({
                        key: i.key,
                        percent: i.percent,
                    })),
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            // ✅ success flow
            navigate("/master/shu-config");
        } catch (err) {
            const result = await handleApiError(err, { login, logout });

            if (result && !result.silent) {
                showError(result.message, result.title);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Typography variant="h4" fontFamily="montserrat" fontWeight={500}>
                Detail Konfigurasi SHU
            </Typography>

            <Paper elevation={3} sx={{ borderRadius: 3, p: 4, mt: 2 }}>
                <TextField
                    label="Tahun"
                    type="number"
                    value={tahun}
                    onChange={(e) => setTahun(Number(e.target.value))}
                    fullWidth
                    sx={{ mb: 3 }}
                    disabled={loading}
                />

                <Divider sx={{ mb: 3 }} />

                {items.map((item, index) => (
                    <Grid container spacing={2} key={index} mb={1}>
                        <Grid item xs={6}>
                            <TextField
                                label="Nama Pembagian"
                                value={item.key}
                                onChange={(e) =>
                                    updateItem(index, "key", e.target.value)
                                }
                                fullWidth
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Persentase (%)"
                                type="number"
                                value={item.percent}
                                onChange={(e) =>
                                    updateItem(index, "percent", e.target.value)
                                }
                                fullWidth
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={2} display="flex" alignItems="center">
                            <Button
                                color="error"
                                onClick={() => removeItem(index)}
                                disabled={loading}
                            >
                                Hapus
                            </Button>
                        </Grid>
                    </Grid>
                ))}

                <Button onClick={addItem} sx={{ mt: 2 }} disabled={loading}>
                    + Tambah Pembagian
                </Button>

                <Typography
                    sx={{ mt: 2 }}
                    color={isValidTotal ? "success.main" : "error"}
                >
                    Total Persentase: {totalPercent}%
                </Typography>

                <Grid container justifyContent="flex-end" mt={3}>
                    <Button
                        variant="contained"
                        disabled={!isValidTotal || loading}
                        onClick={handleSubmit}
                    >
                        Simpan Perubahan
                    </Button>
                </Grid>
            </Paper>
        </>
    );
}
