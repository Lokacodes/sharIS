import { useState, useMemo } from "react";
import {
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/api";
import { handleApiError } from "../../../../utils/handleApiError";
import { useAuth } from "../../../../context/AuthContext";

export default function SHUConfigCreate() {
    const navigate = useNavigate();
    const { login, logout } = useAuth();

    const [tahun, setTahun] = useState(new Date().getFullYear());
    const [items, setItems] = useState([{ key: "", percent: "" }]);
    const [loading, setLoading] = useState(false);

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
        if (!isValidTotal || loading) return;

        setLoading(true);

        try {
            await api.post(
                "/shuConfig",
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

            alert("Berhasil membuat alokasi SHU");
            navigate("/master/shu-config");
        } catch (err) {
            handleApiError(err, navigate, { login, logout });
        }
    };

    return (
        <>
            <Typography variant="h4" fontFamily="montserrat" fontWeight={500}>
                Buat Alokasi SHU
            </Typography>

            <Paper elevation={3} sx={{ borderRadius: 3, p: 4, mt: 2 }}>
                <TextField
                    label="Tahun"
                    type="number"
                    value={tahun}
                    onChange={(e) => setTahun(Number(e.target.value))}
                    fullWidth
                    sx={{ mb: 3 }}
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
                                required
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
                                required
                            />
                        </Grid>

                        <Grid item xs={2} display="flex" alignItems="center">
                            <Button
                                color="error"
                                onClick={() => removeItem(index)}
                                disabled={items.length === 1 || loading}
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
                        Simpan
                    </Button>
                </Grid>
            </Paper>
        </>
    );
}
