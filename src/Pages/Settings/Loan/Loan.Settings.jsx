import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { handleApiError } from "../../../utils/handleApiError";

import {
    Box,
    Button,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

export default function LoanSetting({ logout, login }) {
    const navigate = useNavigate();

    const [tenors, setTenors] = useState([]);
    const [loanOptions, setLoanOptions] = useState([]);

    const [newTenor, setNewTenor] = useState("");
    const [newPercentage, setNewPercentage] = useState("");
    const [newAmount, setNewAmount] = useState("");

    const [loading, setLoading] = useState(false);

    /* =========================
       FETCH TENORS
    ========================= */
    const fetchTenors = async () => {
        setLoading(true);
        try {
            const resp = await api.get("/tenorCmb");
            const list = resp?.data?.data || [];

            const normalized = list.map(t => ({
                id: t.id,
                months: t.months ?? t.tenor,
                servicePercentage: t.servicePercentage ?? 0,
            }));

            setTenors(normalized.sort((a, b) => a.months - b.months));
        } catch (error) {
            handleApiError(error, navigate, { logout, login });
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       FETCH LOAN OPTIONS
    ========================= */
    const fetchOptions = async () => {
        setLoading(true);
        try {
            const resp = await api.get("/loanCmb");
            const list = resp?.data?.data || [];

            const normalized = list.map(o => ({
                id: o.id,
                amount: Number(o.amount),
            }));

            setLoanOptions(normalized.sort((a, b) => a.amount - b.amount));
        } catch (error) {
            handleApiError(error, navigate, { logout, login });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenors();
        fetchOptions();
    }, []);

    /* =========================
       ADD TENOR
    ========================= */
    async function addTenor(e) {
        e.preventDefault();

        const tenorVal = Number(newTenor);
        const percentVal = Number(newPercentage);

        if (!tenorVal || tenorVal <= 0) {
            alert("Tenor tidak valid");
            return;
        }

        if (percentVal < 0) {
            alert("Persentase tidak valid");
            return;
        }

        if (tenors.some(t => t.months === tenorVal)) {
            alert("Tenor sudah ada");
            return;
        }

        try {
            const created = await api.post("/tenorCmb", {
                tenor: tenorVal,
                name: `${tenorVal} Bulan`,
                servicePercentage: percentVal,
            });

            const item = created?.data?.data;

            setTenors(s =>
                [...s, {
                    id: item.id,
                    months: item.months ?? item.tenor ?? tenorVal,
                    servicePercentage: item.servicePercentage ?? percentVal,
                }].sort((a, b) => a.months - b.months)
            );

            setNewTenor("");
            setNewPercentage("");
        } catch (err) {
            handleApiError(err, navigate, { logout, login });
        }
    }

    /* =========================
       UPDATE TENOR
    ========================= */
    async function updateTenor(id, months, percentage) {
        const tenorVal = Number(months);
        const percentVal = Number(percentage);

        if (!tenorVal || tenorVal <= 0) return;
        if (percentVal < 0) return;

        try {
            await api.patch(`/tenorCmb/${id}`, {
                tenor: tenorVal,
                servicePercentage: percentVal,
            });

            setTenors(s =>
                s
                    .map(t =>
                        t.id === id
                            ? { ...t, months: tenorVal, servicePercentage: percentVal }
                            : t
                    )
                    .sort((a, b) => a.months - b.months)
            );
        } catch (err) {
            handleApiError(err, navigate, { logout, login });
        }
    }

    /* =========================
       REMOVE TENOR
    ========================= */
    async function removeTenor(id) {
        if (!window.confirm("Hapus tenor ini?")) return;

        try {
            await api.delete(`/tenorCmb/${id}`);
            setTenors(s => s.filter(t => t.id !== id));
        } catch (err) {
            handleApiError(err, navigate, { logout, login });
        }
    }

    /* =========================
       ADD LOAN OPTION
    ========================= */
    async function addLoanOption(e) {
        e.preventDefault();

        const amount = Number(newAmount);

        if (!amount || amount <= 0) {
            alert("Jumlah tidak valid");
            return;
        }

        if (loanOptions.some(l => l.amount === amount)) {
            alert("Jumlah sudah ada");
            return;
        }

        try {
            const created = await api.post("/loanCmb", { amount });
            const item = created?.data?.data;

            setLoanOptions(s =>
                [...s, {
                    id: item.id,
                    amount: Number(item.amount ?? amount),
                }].sort((a, b) => a.amount - b.amount)
            );

            setNewAmount("");
        } catch (err) {
            handleApiError(err, navigate, { logout, login });
        }
    }

    /* =========================
       UPDATE LOAN OPTION
    ========================= */
    async function updateLoanOption(id, value) {
        const num = Number(value);
        if (!num || num <= 0) return;

        try {
            await api.patch(`/loanCmb/${id}`, { amount: num });

            setLoanOptions(s =>
                s
                    .map(o => (o.id === id ? { ...o, amount: num } : o))
                    .sort((a, b) => a.amount - b.amount)
            );
        } catch (err) {
            handleApiError(err, navigate, { logout, login });
        }
    }

    /* =========================
       REMOVE LOAN OPTION
    ========================= */
    async function removeLoanOption(id) {
        if (!window.confirm("Hapus opsi pinjaman ini?")) return;

        try {
            await api.delete(`/loanCmb/${id}`);
            setLoanOptions(s => s.filter(o => o.id !== id));
        } catch (err) {
            handleApiError(err, navigate, { logout, login });
        }
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Pengaturan Pinjaman
            </Typography>

            <Grid container spacing={2}>
                {/* ===== TENOR ===== */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Tenor & Jasa</Typography>

                        <Box component="form" onSubmit={addTenor} sx={{ mb: 1 }}>
                            <Stack direction="row" spacing={1}>
                                <TextField
                                    placeholder="Tenor (bulan)"
                                    value={newTenor}
                                    onChange={(e) =>
                                        setNewTenor(e.target.value.replace(/[^\d]/g, ""))
                                    }
                                    size="small"
                                    sx={{ width: 120 }}
                                />
                                <TextField
                                    placeholder="Jasa (%)"
                                    value={newPercentage}
                                    onChange={(e) =>
                                        setNewPercentage(e.target.value.replace(/[^\d]/g, ""))
                                    }
                                    size="small"
                                    sx={{ width: 120 }}
                                />
                                <Button type="submit" variant="contained">
                                    Tambah
                                </Button>
                            </Stack>
                        </Box>

                        {tenors.map(t => (
                            <Stack
                                key={t.id}
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 1 }}
                            >
                                <TextField
                                    size="small"
                                    type="number"
                                    value={t.months}
                                    onChange={(e) =>
                                        updateTenor(t.id, e.target.value, t.servicePercentage)
                                    }
                                    sx={{ width: 100 }}
                                />
                                <Typography>bulan</Typography>

                                <TextField
                                    size="small"
                                    type="number"
                                    value={t.servicePercentage}
                                    onChange={(e) =>
                                        updateTenor(t.id, t.months, e.target.value)
                                    }
                                    sx={{ width: 100 }}
                                />
                                <Typography>%</Typography>

                                <Box sx={{ flex: 1 }} />
                                <Button
                                    color="error"
                                    variant="contained"
                                    onClick={() => removeTenor(t.id)}
                                >
                                    Hapus
                                </Button>
                            </Stack>
                        ))}
                    </Paper>
                </Grid>

                {/* ===== LOAN OPTIONS ===== */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Opsi Jumlah Pinjaman</Typography>

                        <Box component="form" onSubmit={addLoanOption} sx={{ mb: 1 }}>
                            <Stack direction="row" spacing={1}>
                                <TextField
                                    placeholder="Jumlah Pinjam"
                                    value={newAmount}
                                    onChange={(e) =>
                                        setNewAmount(e.target.value.replace(/[^\d]/g, ""))
                                    }
                                    size="small"
                                    fullWidth
                                />
                                <Button type="submit" variant="contained">
                                    Tambah
                                </Button>
                            </Stack>
                        </Box>

                        {loanOptions.map(o => (
                            <Stack
                                key={o.id}
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 1 }}
                            >
                                <TextField
                                    size="small"
                                    type="number"
                                    value={o.amount}
                                    onChange={(e) =>
                                        updateLoanOption(o.id, e.target.value)
                                    }
                                    sx={{ width: 180 }}
                                />
                                <Box sx={{ flex: 1 }} />
                                <Button
                                    color="error"
                                    variant="contained"
                                    onClick={() => removeLoanOption(o.id)}
                                >
                                    Hapus
                                </Button>
                            </Stack>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
