import { Typography, Card, CardContent, CardHeader, Divider, Button, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import { handleApiError } from "../../utils/handleApiError";
import { formatDate } from "../../utils/dateFormatter";
import { useNavigate } from "react-router-dom";
import DataTable from "../TableView";
const fontFamily = "montserrat";

export default function LoanDetail() {
    const { id } = useParams();
    const { login, logout, user } = useAuth();
    const [loan, setLoan] = useState(null);
    const [installment, setInstallment] = useState(null);
    const [member, setMember] = useState(null);
    const [userState, setUser] = useState(null);

    const [remainingLoan, setRemainingLoan] = useState(0)

    const navigate = useNavigate()

    const allow = (roles) => user && roles.includes(user.role);

    if (!user) return null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/loan/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const activeLoan = res.data.data
                setLoan(activeLoan);
                setInstallment(activeLoan.installment)
                setMember(activeLoan.member)
                setUser(activeLoan.user)

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

    const handleApprove = async () => {
        try {
            await api.post(
                `/loan/${loan.id}/approve`, {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            alert("Pinjaman Berhasil disetujui");

            setLoan(prev => ({
                ...prev,
                status: "DISETUJUI",
            }));
        } catch (err) {
            handleApiError(err, null, { logout, login });
        }
    };


    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card elevation={3} sx={{ fontFamily, borderRadius: 2 }}>
                        <CardHeader title="Detail Pinjaman" titleTypographyProps={{ sx: { fontFamily, fontWeight: "bold" } }} />
                        <Divider />
                        <CardContent sx={{ fontFamily }}>
                            {loan ? (
                                <TableContainer component={Paper} sx={{ mb: 2 }}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ fontFamily }}><b>Anggota</b></TableCell>
                                                <TableCell sx={{ fontFamily }}><span style={{ fontWeight: 500 }}>: {member.name}</span></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontFamily }}><b>Pengurus</b></TableCell>
                                                <TableCell sx={{ fontFamily }}><span style={{ fontWeight: 500 }}>: {userState.name}</span></TableCell>
                                            </TableRow>
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
                                            {loan.status === "DIAJUKAN" && allow(['SUPERADMIN', 'KETUA']) && (
                                                <TableRow>
                                                    <TableCell colSpan={2} sx={{ fontFamily }}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}>
                                                                <Button fullWidth variant="contained" color="success" onClick={() => handleApprove()} sx={{ fontFamily }}>
                                                                    Setujui
                                                                </Button>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Button fullWidth variant="contained" color="error" onClick={() => handleStatusChange("DITOLAK")} sx={{ fontFamily }}>
                                                                    Tolak
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {loan.status === "DISETUJUI" && allow(['SUPERADMIN', 'BENDAHARA']) && (
                                                <TableRow>
                                                    <TableCell colSpan={2} sx={{ fontFamily }}>
                                                        <Button
                                                            fullWidth
                                                            variant="contained"
                                                            color="primary"
                                                            sx={{ fontFamily }}
                                                            onClick={() => navigate(`/transaksi/angsuran/${loan.id}`, { state: { member } })}
                                                        >
                                                            Angsur
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )}
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

                <Grid item xs={12} md={6}>
                    <Card elevation={3} sx={{ fontFamily, borderRadius: 2 }}>
                        <CardHeader title="Daftar Angsuran" titleTypographyProps={{ sx: { fontFamily } }} />
                        <Divider />
                        <CardContent sx={{ fontFamily }}>
                            {installment && installment.length > 0 ? (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: "bold", fontFamily }}>#</TableCell>
                                                <TableCell sx={{ fontWeight: "bold", fontFamily }}>Tanggal</TableCell>
                                                <TableCell sx={{ fontWeight: "bold", fontFamily }}>Jumlah</TableCell>
                                            </TableRow>
                                            {installment.map((item, index) => (
                                                <TableRow key={item.id}>
                                                    <TableCell sx={{ fontFamily }}>{index + 1}</TableCell>
                                                    <TableCell sx={{ fontFamily }}>{formatDate(item.date)}</TableCell>
                                                    <TableCell sx={{ fontFamily }}>Rp {item.amount}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography sx={{ mt: 2, color: "gray", fontFamily }}>
                                    Belum ada angsuran.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}