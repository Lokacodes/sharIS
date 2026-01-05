import { Paper, Grid, Typography, Divider } from "@mui/material";
import formatCurrency from "../../../utils/currencyFormatter";
import { useNavigate } from "react-router-dom";

export default function LabaRugiSection({ data }) {
    if (!data) return null;

    const navigate = new useNavigate()

    return (
        <Paper elevation={3} sx={{ borderRadius: 3, p: 4, mt: 3 }}>
            <Typography
                variant="h5"
                fontWeight={600}
                fontFamily="montserrat"
                gutterBottom
            >
                Laporan Laba Rugi
            </Typography>

            <Typography variant="body2" color="text.secondary" gutterBottom>
                Periode Tahun {data.tahun}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Typography>Pendapatan</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                    <Typography>{formatCurrency(data.pendapatan)}</Typography>
                </Grid>
                <Grid item xs={6}>
                </Grid>
                <Grid item xs={6} textAlign="right">
                    <button onClick={() => navigate(`/master/laporan/rincian?modul=INCOME&tahun=${data.tahun}`)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#1976d2", textDecoration: "underline" }}>
                        (Rincian Pendapatan)
                    </button>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Biaya</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                    <Typography color="error">
                        {formatCurrency(data.biaya)}
                    </Typography>
                </Grid>

                <Grid item xs={6}>
                </Grid>
                <Grid item xs={6} textAlign="right">
                    <button onClick={() => navigate(`/master/laporan/rincian?modul=EXPENSE&tahun=${data.tahun}`)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#1976d2", textDecoration: "underline" }}>
                        (Rincian Biaya)
                    </button>
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={6}>
                    <Typography fontWeight={600}>Laba Bersih</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                    <Typography fontWeight={600} color="success.main">
                        {formatCurrency(data.shu)}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
}
