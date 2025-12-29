import { useState } from "react";
import {
    Typography,
    Paper,
    Grid,
    Button,
    TextField,
} from "@mui/material";
import {
    LocalizationProvider,
    DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../../utils/handleApiError";
import api from "../../api/api";

export default function Expense() {
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(dayjs());
    const [description, setDescription] = useState("");

    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    const isDataComplete =
        amount && date && description;

    const resetForm = () => {
        setAmount("");
        setDate(dayjs());
        setDescription("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post(
                "/cashbook",
                {
                    type: "OUT",
                    module: "EXPENSE",
                    amount: amount.toString(),
                    date: date.format("YYYY-MM-DD"),
                    description,
                    user: user.userId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            alert("Pengeluaran berhasil dicatat");
            resetForm();
        } catch (e) {
            handleApiError(e, navigate, { logout, login });
        }
    };

    return (
        <>
            <Typography
                variant="h4"
                fontWeight={500}
                fontFamily="montserrat"
            >
                Input Pengeluaran
            </Typography>

            <Paper elevation={3} sx={{ borderRadius: 3, p: 4, mt: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container spacing={2}>
                        {/* Jumlah */}
                        <Grid item xs={12}>
                            <TextField
                                label="Jumlah Pengeluaran (Rp)"
                                fullWidth
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                inputProps={{
                                    inputMode: "numeric",
                                    pattern: "[0-9]*",
                                }}
                            />
                        </Grid>

                        {/* Tanggal */}
                        <Grid item xs={12}>
                            <DatePicker
                                label="Tanggal Pengeluaran"
                                value={date}
                                onChange={(newValue) =>
                                    setDate(newValue || dayjs())
                                }
                                slotProps={{
                                    textField: { fullWidth: true },
                                }}
                            />
                        </Grid>

                        {/* Keterangan */}
                        <Grid item xs={12}>
                            <TextField
                                label="Keterangan"
                                fullWidth
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                placeholder="Contoh: Biaya listrik kantor"
                            />
                        </Grid>

                        {/* Submit */}
                        <Grid item xs={12} textAlign="right">
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleSubmit}
                                disabled={!isDataComplete}
                            >
                                Simpan Pengeluaran
                            </Button>
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            </Paper>
        </>
    );
}
