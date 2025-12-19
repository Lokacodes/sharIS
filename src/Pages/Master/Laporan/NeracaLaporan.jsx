import { Typography, Paper, Grid, Divider, Alert, Box } from "@mui/material";
import { InfoRow } from "../../../components/general/InfoRow";
import formatCurrency from "../../../utils/currencyFormatter";
import PropTypes from "prop-types";

export default function NeracaLaporan({ data }) {
    return (
        <Paper elevation={3} sx={{ borderRadius: 3, p: 4, mt: 3 }}>
            <Typography variant="h5" fontWeight={500} fontFamily="montserrat">
                Neraca
            </Typography>

            <Grid container spacing={2} mt={2}>
                <Grid item md={5.75} xs={12}>
                    <Typography fontWeight={600}>Aktiva</Typography>
                    <InfoRow md={12} labelText="Kas" valueText={formatCurrency(data.aktiva.kas)} />
                    <InfoRow md={12} labelText="Piutang" valueText={formatCurrency(data.aktiva.piutang)} />
                    <Divider sx={{ my: 2 }} />
                    <InfoRow md={12} labelText="Total Aktiva" valueText={formatCurrency(data.aktiva.totalAktiva)} />
                </Grid>

                <Grid
                    item
                    md={0.5}
                    xs={12}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Divider orientation="vertical" flexItem />
                </Grid>


                {/* PASIVA */}
                <Grid item md={5.75} xs={12}>
                    <Typography fontWeight={600}>Pasiva</Typography>
                    <InfoRow md={12} labelText="Hutang Lancar" valueText={formatCurrency(data.pasiva.hutangLancar)} sx={{ justifyContent: "space-between" }} />
                    <InfoRow md={12} labelText="Equity" valueText={formatCurrency(data.pasiva.equity)} sx={{ justifyContent: "space-between" }} />
                    <Divider sx={{ my: 2 }} />
                    <InfoRow md={12} labelText="Total Pasiva" valueText={formatCurrency(data.pasiva.totalPasiva)} sx={{ justifyContent: "space-between" }} />
                </Grid>
            </Grid>

            {!data.balanceCheck && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                    Neraca tidak balance. Periksa pencatatan modal, kas, dan pinjaman.
                </Alert>
            )}
        </Paper>
    );
}

NeracaLaporan.propTypes = {
    data: PropTypes.shape({
        aktiva: PropTypes.shape({
            kas: PropTypes.number,
            piutang: PropTypes.number,
            totalAktiva: PropTypes.number,
        }),
        pasiva: PropTypes.shape({
            hutangLancar: PropTypes.number,
            equity: PropTypes.number,
            totalPasiva: PropTypes.number,
        }),
        balanceCheck: PropTypes.bool,
    }),
};
