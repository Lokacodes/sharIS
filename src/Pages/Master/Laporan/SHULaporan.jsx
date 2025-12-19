import { Typography, Paper, Grid, Divider } from "@mui/material";
import PropTypes from "prop-types";
import { InfoRow } from "../../../components/general/InfoRow";
import formatCurrency from "../../../utils/currencyFormatter";

export default function SHULaporan({ data }) {
    return (
        <Paper elevation={3} sx={{ borderRadius: 3, p: 4, mt: 3 }}>
            <Typography variant="h5" fontWeight={500} fontFamily="montserrat">
                Sisa Hasil Usaha (SHU)
            </Typography>

            <Grid container spacing={1} mt={2}>
                <InfoRow md={12} labelText="Pendapatan" valueText={formatCurrency(data.pendapatan)} />
                <InfoRow md={12} labelText="Biaya" valueText={formatCurrency(data.biaya)} />
                <Divider sx={{ my: 1 }} />
                <InfoRow md={12} labelText="SHU" valueText={formatCurrency(data.shu)} />
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" fontFamily="montserrat">
                Alokasi SHU
            </Typography>

            <Grid container spacing={1} mt={1}>
                {data.allocations.map((item) => (
                    <InfoRow
                        key={item.key}
                        md={12}
                        labelText={`${item.key} (${item.percent}%)`}
                        valueText={formatCurrency(item.amount)}
                    />
                ))}
            </Grid>
        </Paper>
    );
}

SHULaporan.propTypes = {
    data: PropTypes.shape({
        pendapatan: PropTypes.number.isRequired,
        biaya: PropTypes.number.isRequired,
        shu: PropTypes.number.isRequired,
        allocations: PropTypes.arrayOf(
            PropTypes.shape({
                key: PropTypes.string.isRequired,
                percent: PropTypes.number.isRequired,
                amount: PropTypes.number.isRequired,
            })
        ).isRequired,
    }).isRequired,
};
