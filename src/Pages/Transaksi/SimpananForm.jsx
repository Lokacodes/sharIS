import { useState, useEffect } from "react";
import { Typography, Paper, Grid, Divider, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { LocalizationProvider, DatePicker, } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";
import { MemberSearch } from "../../components/member/MemberSearch";
import { InfoRow } from "../../components/general/InfoRow";
import { useSavingData } from "../../hooks/useSavingData";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../../utils/handleApiError";
import api from "../../api/api";



export default function SimpananForm() {
    const [jumlahSimpan, setJumlahSimpan] = useState("");
    const [tanggalSimpan, setTanggalSimpan] = useState(dayjs());
    const [selectedMember, setSelectedMember] = useState(null);
    const [jenisSimpanan, setjenisSimpanan] = useState(null);
    const [totalSimpananPokok, setTotalSimpananPokok] = useState(0)
    const [totalSimpananWajib, setTotalSimpananWajib] = useState(0)
    const [totalSimpananSukarela, setTotalSimpananSukarela] = useState(0)

    const resetForm = () => {
        setJumlahSimpan("");
        setTanggalSimpan(dayjs());
        setSelectedMember(null);
        setjenisSimpanan(null);
        setTotalSimpananPokok(0);
        setTotalSimpananWajib(0);
        setTotalSimpananSukarela(0);
    };
    const { user, login, logout } = useAuth()

    const navigate = useNavigate()

    const isDataComplete =
        selectedMember &&
        jumlahSimpan &&
        tanggalSimpan

    const { saving } = useSavingData(selectedMember?.id, { login, logout });

    useEffect(() => {
        if (saving) {
            const totalPokok = saving.simpanan_pokok?.reduce(
                (sum, item) => sum + Number(item.amount || 0),
                0
            ) || 0;

            const totalWajib = saving.simpanan_wajib?.reduce(
                (sum, item) => sum + Number(item.amount || 0),
                0
            ) || 0;

            const totalSukarela = saving.simpanan_sukarela?.reduce(
                (sum, item) => sum + Number(item.amount || 0),
                0
            ) || 0;

            setTotalSimpananPokok(totalPokok);
            setTotalSimpananWajib(totalWajib);
            setTotalSimpananSukarela(totalSukarela);
        }
    }, [saving])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post("/saving", {
                memberId: selectedMember?.id,
                userId: user.userId,
                amount: jumlahSimpan.toString(),
                date: tanggalSimpan?.format("YYYY-MM-DD"),
                savingType: jenisSimpanan
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })

            if (response) {
                alert("Simpanan berhasil disimpan")
                resetForm()
            }
        } catch (e) {
            handleApiError(e, navigate, { logout, login })
        }
    };

    return (
        <>
            <Typography variant="h4" fontWeight={500} fontFamily="montserrat">Form Simpanan</Typography>

            <Paper elevation={3} sx={{ borderRadius: 3, p: 4, mt: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12}>
                                    <MemberSearch
                                        value={selectedMember}
                                        onSelect={(member) => setSelectedMember(member)}
                                    />
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <FormControl fullWidth={true}>
                                        <InputLabel id="jenis-transaksi">Jenis Simpanan</InputLabel>
                                        <Select
                                            labelId="jenis-Simpanan-label"
                                            id="jenis-Simpanan-select"
                                            value={jenisSimpanan || ""}
                                            label="Jenis Simpanan"
                                            onChange={(e) => setjenisSimpanan(e.target.value)}
                                        >
                                            <MenuItem value={"SUKARELA"}>Sukarela</MenuItem>
                                            <MenuItem value={"WAJIB"}>Wajib</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item md={12} xs={12}>
                                    <TextField
                                        id="jumlah-simpan"
                                        label="Jumlah (Rp)"
                                        fullWidth
                                        value={jumlahSimpan}
                                        onChange={(e) => setJumlahSimpan(e.target.value)}
                                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                    />
                                </Grid>

                                <Grid item md={12} xs={12}>
                                    <DatePicker
                                        label="Tanggal Simpan"
                                        value={tanggalSimpan}
                                        onChange={(newValue) => {
                                            setTanggalSimpan(newValue || dayjs());
                                        }}
                                        slotProps={{
                                            textField: { fullWidth: true },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            xs="auto"
                            md={1}
                            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <Divider orientation="vertical" flexItem />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={12}>
                                    <Typography variant="h5" color="initial" fontWeight={500} fontFamily="montserrat">
                                        Rincian Simpanan
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <Grid container spacing={0.5}>
                                        <InfoRow md={12} labelText={"Saldo Simpanan"} />
                                        <InfoRow md={12} paddingLeft={2} labelText={"Pokok"} valueText={totalSimpananPokok} />
                                        <InfoRow md={12} paddingLeft={2} labelText={"Wajib"} valueText={totalSimpananWajib} />
                                        <InfoRow md={12} paddingLeft={2} labelText={"Sukarela"} valueText={totalSimpananSukarela} />
                                    </Grid>
                                </Grid>

                                <InfoRow md={12} labelText={"Total"} valueText={totalSimpananPokok + totalSimpananWajib + totalSimpananSukarela} />

                                <InfoRow md={12} labelText={"Total Baru"} valueText={Number(jumlahSimpan) + (totalSimpananPokok + totalSimpananWajib + totalSimpananSukarela)} />
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

