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

export default function ModalForm() {
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(dayjs());
    const [description, setDescription] = useState("Modal awal koperasi");

    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    const isDataComplete = amount && date && description;

    const resetForm = () => {
        setAmount("");
        setDate(dayjs());
        setDescription("Modal awal koperasi");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post(
                "/cashbook",
                {
                    type: "IN",
                    module: "MODAL",
                    amount: amount.toString(),
                    date: date?.format("YYYY-MM-DD"),
                    description,
                    userId: user.userId,
                    member: 1
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            alert("Modal berhasil dicatat");
            resetForm();
        } catch (e) {
            handleApiError(e, navigate, { logout, login });
        }
    };

    return (
        <>
            <Typography variant="h4" fontWeight={500} fontFamily="montserrat">
                Input Modal Koperasi
            </Typography>

            <Paper elevation={3} sx={{ borderRadius: 3, p: 4, mt: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Jumlah Modal (Rp)"
                                fullWidth
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                inputProps={{
                                    inputMode: "numeric",
                                    pattern: "[0-9]*",
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <DatePicker
                                label="Tanggal Modal"
                                value={date}
                                onChange={(newValue) =>
                                    setDate(newValue || dayjs())
                                }
                                slotProps={{
                                    textField: { fullWidth: true },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Keterangan"
                                fullWidth
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                            />
                        </Grid>

                        <Grid item xs={12} textAlign="right">
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleSubmit}
                                disabled={!isDataComplete}
                            >
                                Simpan Modal
                            </Button>
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            </Paper>
        </>
    );
}
