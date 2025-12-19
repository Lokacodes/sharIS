import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Card, CardContent, CardHeader, Divider, Button, Grid, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { handleApiError } from "../../utils/handleApiError";
import { formatDate } from "../../utils/dateFormatter";
import { useNavigate } from "react-router-dom";


const fontFamily = "montserrat";

export default function MemberDetail() {
    const { id } = useParams();
    const { login, logout } = useAuth();
    const [member, setMember] = useState(null);
    const [loan, setLoan] = useState(null);
    const [remainingLoan, setRemainingLoan] = useState(0)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/members/pinjaman/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setMember(res.data.data);
                const loans = Array.isArray(res.data.data.loan) ? res.data.data.loan : [];
                const priority = ["disetujui", "diajukan", "ditolak"];
                let activeLoan = null;
                for (const status of priority) {
                    activeLoan = loans.find(l => String(l.status || "").toLowerCase() === status);
                    if (activeLoan) break;
                }
                // fallback: first non-LUNAS loan
                if (!activeLoan) {
                    activeLoan = loans.find(l => String(l.status || "").toLowerCase() !== "lunas") || null;
                }
                setLoan(activeLoan);

                const totalInstallments = (Array.isArray(activeLoan?.installment) ? activeLoan.installment : []).reduce(
                    (sum, it) => sum + Number(it?.amount || 0),
                    0
                );

                const remainingLoan = activeLoan ? (Number(activeLoan.amount || 0) - totalInstallments) : 0;

                setRemainingLoan(remainingLoan);
            } catch (err) {
                handleApiError(err, null, { logout, login });
            }
        };
        fetchData();
    }, [id, login, logout]);

    const handleStatusChange = async (status) => {
        try {
            await api.patch(`/loan/${loan.id}`, { status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            alert(`Pinjaman ${status.toLowerCase()}`);
            setLoan({ ...loan, status });
        } catch (err) {
            handleApiError(err, null, { logout, login });
        }
    };

    if (!member) return <p>Loading...</p>;

    return (
        <Box maxWidth={900} mx="auto" mt={4} sx={{ fontFamily }}>
            <Typography variant="h4" fontWeight={600} mb={3} align="center" sx={{ fontFamily }}>
                Detail Anggota
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card elevation={3} sx={{ fontFamily, borderRadius: 2 }}>
                        <CardHeader
                            title="Informasi Anggota"
                            titleTypographyProps={{ sx: { fontFamily, fontWeight: "bold" } }}
                        />
                        <Divider />
                        <CardContent sx={{ fontFamily }}>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{ fontFamily }}><b>Nama</b></TableCell>
                                            <TableCell sx={{ fontFamily }}><span style={{ fontWeight: 500 }}>: {member.name}</span></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontFamily }}><b>No. HP</b></TableCell>
                                            <TableCell sx={{ fontFamily }}><span style={{ fontWeight: 500 }}>: {member.phone}</span></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontFamily }}><b>Alamat</b></TableCell>
                                            <TableCell sx={{ fontFamily }}><span style={{ fontWeight: 500 }}>: {member.address}</span></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontFamily }}><b>Tanggal Lahir</b></TableCell>
                                            <TableCell sx={{ fontFamily }}><span style={{ fontWeight: 500 }}>: {formatDate(member.dateOfBirth)}</span></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card elevation={3} sx={{ fontFamily, borderRadius: 2 }}>
                        <CardHeader title="Pinjaman Aktif" titleTypographyProps={{ sx: { fontFamily, fontWeight: "bold" } }} />
                        <Divider />
                        <CardContent sx={{ fontFamily }}>
                            {loan ? (
                                <TableContainer component={Paper} sx={{ mb: 2 }}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ fontFamily }}><b>Jumlah</b></TableCell>
                                                <TableCell sx={{ fontFamily }}><span style={{ fontWeight: 500 }}>: Rp {loan.amount}</span></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontFamily }}><b>Sisa Pinjaman</b></TableCell>
                                                <TableCell sx={{ fontFamily }}><span style={{ fontWeight: 500 }}>: Rp {remainingLoan}</span></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontFamily }}><b>Tanggal Pinjam</b></TableCell>
                                                <TableCell sx={{ fontFamily }}><span style={{ fontWeight: 500 }}>: {formatDate(loan.LoanDate)}</span></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontFamily }}><b>Tenggat</b></TableCell>
                                                <TableCell sx={{ fontFamily }}><span style={{ fontWeight: 500 }}>: {formatDate(loan.Deadline)}</span></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontFamily }}><b>Status</b></TableCell>
                                                <TableCell sx={{ fontFamily }}>
                                                    <span style={{ color: "#1976d2", fontFamily, fontWeight: 500 }}>: {loan.status}</span>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={2} sx={{ fontFamily }}>
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        color="primary"
                                                        sx={{ fontFamily }}
                                                        onClick={() => navigate(`/detail/pinjaman/${loan.id}`, { state: { member } })}
                                                    >
                                                        Detail Pinjaman
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography sx={{ mt: 2, color: "gray", fontFamily }}>
                                    Belum ada pinjaman aktif
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
