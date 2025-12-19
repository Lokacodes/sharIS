import { useState, useMemo } from "react";
import { Typography, Paper, Grid, Divider, Button } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MemberSearch } from "../../components/member/MemberSearch";
import api from "../../api/api";
import { handleApiError } from "../../utils/handleApiError";
import { InfoRow } from "../../components/general/InfoRow";
import { LoanOptionSelect } from "../../components/loan/loanOptionCmb";
import { TenorOptionSelect } from "../../components/loan/tenorOptionCmb";
import calculateInstallmentBreakdown from "../../utils/calculateMonthlyInstallment";

const LAMA_PINJAM = 10;

export default function PinjamanForm() {
    const [tanggalPinjam, setTanggalPinjam] = useState(dayjs());
    const [tenggatPelunasan, setTenggatPelunasan] = useState(dayjs().add(LAMA_PINJAM, "month"));
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedLoanAmount, setSelectedLoanAmount] = useState(null);
    const [selectedTenor, setSelectedTenor] = useState(null);

    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    const isDataComplete =
        selectedMember &&
        selectedLoanAmount &&
        selectedTenor &&
        tanggalPinjam &&
        tenggatPelunasan;

    const angsuranBreakdown = useMemo(() => {
        if (!selectedLoanAmount || !selectedTenor) return null;

        return calculateInstallmentBreakdown(
            selectedLoanAmount.amount,
            selectedTenor.tenor,
            selectedTenor.servicePercentage
        );
    }, [selectedLoanAmount, selectedTenor]);

    const angsuranPerBulan = useMemo(
        () => (angsuranBreakdown ? angsuranBreakdown.totalPerMonth : 0),
        [angsuranBreakdown]
    );

    const handleSubmit = async () => {
        try {
            const response = await api.post(
                "/loan",
                {
                    memberId: selectedMember.id,
                    userId: user.userId,
                    amount: selectedLoanAmount.amount.toString(),
                    Deadline: tenggatPelunasan.format("YYYY-MM-DD"),
                    LoanDate: tanggalPinjam.format("YYYY-MM-DD"),
                    TenorOption: selectedTenor.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response) {
                alert("Pinjaman sukses diajukan");
                navigate(`/detail/member/${selectedMember.id}`);
            }
        } catch (e) {
            handleApiError(e, navigate, { logout, login });
        }
    };

    return (
        <>
            <Typography variant="h4" fontWeight={500} fontFamily="montserrat">
                Form Peminjaman
            </Typography>

            <Paper elevation={3} sx={{ borderRadius: 3, p: 4, mt: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <MemberSearch
                                        value={selectedMember}
                                        onSelect={(member) => setSelectedMember(member)}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <LoanOptionSelect
                                        value={selectedLoanAmount}
                                        onSelect={(loanOption) =>
                                            setSelectedLoanAmount(loanOption)
                                        }
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TenorOptionSelect
                                        value={selectedTenor}
                                        onSelect={(tenorOption) => {
                                            setSelectedTenor(tenorOption);
                                            setTenggatPelunasan(
                                                tanggalPinjam.add(tenorOption.tenor, "month")
                                            );
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <DatePicker
                                        label="Tanggal Pinjam"
                                        value={tanggalPinjam}
                                        onChange={(newValue) => {
                                            const date = newValue || dayjs();
                                            setTanggalPinjam(date);
                                            setTenggatPelunasan(
                                                date.add(
                                                    selectedTenor?.tenor ?? LAMA_PINJAM,
                                                    "month"
                                                )
                                            );
                                        }}
                                        format="DD/MM/YY"
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
                                <Grid item xs={12}>
                                    <Typography variant="h5">Rincian Pinjaman</Typography>
                                </Grid>

                                <InfoRow
                                    md={12}
                                    labelText="Lama Pinjam"
                                    valueText={selectedTenor ? selectedTenor.name : "-"}
                                />

                                <InfoRow
                                    md={12}
                                    labelText="Tenggat Pelunasan"
                                    valueText={
                                        selectedTenor
                                            ? tanggalPinjam
                                                .add(selectedTenor.tenor, "month")
                                                .format("DD/MM/YY")
                                            : "-"
                                    }
                                />

                                <InfoRow
                                    md={12}
                                    labelText="Nominal Angsuran (Rp)"
                                    valueText={
                                        angsuranPerBulan?.toLocaleString("id-ID") || "0"
                                    }
                                />

                                <Grid item xs={12} textAlign="right">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        disabled={!isDataComplete}
                                        onClick={handleSubmit}
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
