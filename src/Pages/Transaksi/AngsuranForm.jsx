import { useState, useMemo, useEffect } from "react";
import {
    Typography,
    Paper,
    Grid,
    Divider,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { handleApiError } from "../../utils/handleApiError";
import api from "../../api/api";
import { InfoRow } from "../../components/general/InfoRow";
import { MemberSearch } from "../../components/member/MemberSearch";
import { useLoanData } from "../../hooks/useLoanData";
import { useLocation } from "react-router-dom";
import calculateInstallmentBreakdown from "../../utils/calculateMonthlyInstallment";


export default function AngsuranForm() {
    const { state } = useLocation();

    const member = state?.member;

    useEffect(() => {
        if (member) {
            setSelectedMember(member);
            setisFromLoanDetail(true)
        }
    }, [member]);

    const navigate = useNavigate();
    const { user, login, logout } = useAuth();

    const [bulanBayar, setBulanBayar] = useState(1);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isFromLoanDetail, setisFromLoanDetail] = useState(false);


    const { loan, loanAmount, remainingLoan, notFound } = useLoanData(
        selectedMember?.id,
        { logout, login }
    );

    const angsuranBreakdown = loan ? calculateInstallmentBreakdown(loan.amount, loan.tenorOption.tenor, loan.tenorOption.servicePercentage) : null

    const angsuranPerBulan = useMemo(
        () => angsuranBreakdown ? angsuranBreakdown.totalPerMonth : 0,
        [angsuranBreakdown]
    );

    const totalAngsuran = useMemo(
        () => bulanBayar * angsuranPerBulan,
        [bulanBayar, angsuranPerBulan]
    );

    const resetForm = () => {
        setBulanBayar(1)
        setSelectedMember(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedMember || !loan) return;

        try {
            await api.post(
                "/installment/pay",
                {
                    loanId: loan.id,
                    memberId: selectedMember.id,
                    userId: user.userId,
                    amount: totalAngsuran.toString(),
                    monthMultiplier: bulanBayar
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );

            alert("Sukses buat angsuran")
            if (isFromLoanDetail) {
                navigate(`/detail/pinjaman/${loan.id}`)
            }
            resetForm()
        } catch (err) {
            handleApiError(err, null, { logout, login });
        }
    };

    return (
        <>
            <Typography variant="h4" fontWeight={500} fontFamily="montserrat">
                Form Angsuran
            </Typography>

            {notFound && (
                <Typography color="error" sx={{ mt: 2 }}>
                    Tidak ada data pinjaman untuk anggota ini.
                </Typography>
            )}


            <Paper elevation={3} sx={{ borderRadius: 3, p: 4, mt: 2, mb: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <MemberSearch
                            value={selectedMember}
                            onSelect={(member) => setSelectedMember(member)}
                        />

                        <Typography variant="h5" sx={{ mt: 2 }}>
                            Detail Pinjaman
                        </Typography>

                        <InfoRow
                            labelText="Jumlah Pinjaman (Rp)"
                            valueText={loanAmount?.toLocaleString("id-ID") || "0"}
                            md={12}
                        />
                        <InfoRow
                            labelText="Sisa Pinjaman"
                            valueText={remainingLoan?.toLocaleString("id-ID") || "0"}
                            md={12}
                        />
                        <InfoRow
                            labelText="Angsuran per-bulan"
                            valueText={angsuranPerBulan?.toLocaleString("id-ID") || "0"}
                            md={12}
                        />
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
                        <Typography variant="h5">Rincian Angsuran</Typography>

                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="bulan-bayar">Jumlah bayar (bulan)</InputLabel>
                            <Select
                                labelId="bulan-bayar"
                                value={bulanBayar}
                                label="Jumlah bayar (bulan)"
                                onChange={(e) => setBulanBayar(Number(e.target.value))}
                            >
                                {[...Array(12)].map((_, i) => (
                                    <MenuItem key={i + 1} value={i + 1}>
                                        {i + 1} Bulan
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <InfoRow
                            labelText="Nominal Angsuran"
                            valueText={totalAngsuran?.toLocaleString("id-ID") || "0"}
                            md={12}
                            marginTop={2}
                        />

                        <Grid item xs={12} marginTop={2} textAlign="end">
                            <Button
                                variant="contained"
                                color="success"
                                disabled={!selectedMember || !loan}
                                onClick={handleSubmit}
                            >
                                Ajukan Angsuran
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
}
