import {
    Typography,
    Paper,
    Grid,
    Button,
    TextField,
    Container,
} from "@mui/material";
import { useState } from "react";
import {
    formatPhone,
    sanitizePhoneNumber,
} from "../../utils/phoneFormatter";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DataTable from "../TableView";
import api from "../../api/api";
import dayjs from "dayjs";

export default function MemberForm() {
    const [nama, setNama] = useState("");
    const [alamat, setAlamat] = useState("");
    const [tanggalLahir, setTanggalLahir] = useState(null);
    const [telepon, setTelepon] = useState("");
    const navigate = useNavigate();
    const isDataComplete = nama && alamat && tanggalLahir && telepon;

    const resetForm = () => {
        setNama("");
        setAlamat("");
        setTanggalLahir(null);
        setTelepon("");
    };

    const { user, login, logout } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const sanitizedPhone = sanitizePhoneNumber(telepon, {
            international: false,
        });

        try {
            const response = await api.post(
                "/members",
                {
                    name: nama,
                    dateOfBirth: tanggalLahir?.format("YYYY-MM-DD"),
                    address: alamat,
                    phone: sanitizedPhone,
                    userId: user.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response && response.status) {
                const savingResponse = await api.post(
                    "/saving",
                    {
                        memberId: response.data.data.id,
                        userId: user.userId,
                        amount: "50000",
                        date: dayjs().format("YYYY-MM-DD"),
                        savingType: "POKOK",
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (savingResponse) {
                    alert("Anggota berhasil ditambahkan");
                    resetForm();
                }
            }
        } catch (e) {
            handleApiError(e, navigate, { logout, login });
        }
    };

    return (
        <>
            <Typography variant="h4" fontWeight={500} fontFamily="montserrat">
                Anggota
            </Typography>
            <Paper elevation={3} sx={{ borderRadius: 3, p: 4, mt: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container spacing={2}>
                        <Grid item md={12} xs={12}>
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12}>
                                    <Typography
                                        variant="h6"
                                        color="initial"
                                        fontFamily={"montserrat"}
                                    >
                                        Form tambah anggota
                                    </Typography>
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <TextField
                                        id="nama-anggota"
                                        label="Nama"
                                        fullWidth
                                        value={nama}
                                        onChange={(e) => {
                                            setNama(e.target.value);
                                        }}
                                    />
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <TextField
                                        id="alamat-anggota"
                                        label="Alamat"
                                        fullWidth
                                        value={alamat}
                                        onChange={(e) => {
                                            setAlamat(e.target.value);
                                        }}
                                        inputProps={{ inputMode: "text" }}
                                    />
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <DatePicker
                                        label="Tanggal Lahir"
                                        value={tanggalLahir}
                                        onChange={(newValue) => {
                                            setTanggalLahir(newValue);
                                        }}
                                        slotProps={{
                                            textField: { fullWidth: true },
                                        }}
                                    />
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <TextField
                                        id="telepon-anggota"
                                        label="No. Telepon"
                                        fullWidth
                                        value={telepon}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setTelepon(formatPhone(value));
                                        }}
                                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                    />
                                </Grid>
                                <Grid item xs={12} textAlign="right">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleSubmit}
                                        disabled={!isDataComplete}
                                    >
                                        Simpan
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            </Paper>
        </>
    );
}