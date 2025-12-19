// components/InfoRow.jsx
import { Grid, Typography } from "@mui/material";

export function InfoRow({ labelText, valueText, md = 6, marginTop = 0, paddingLeft = 0 }) {
    return (
        <Grid item xs={12} md={md} marginTop={marginTop}>
            <Grid container>
                <Grid item xs={4} md={6} paddingLeft={paddingLeft}>
                    <Typography variant="subtitle2" sx={{ fontFamily: "montserrat" }}>
                        {labelText}
                    </Typography>
                </Grid>
                <Grid item xs={4} md={1}>
                    <Typography variant="subtitle2">:</Typography>
                </Grid>
                <Grid item xs={4} md={5}>
                    <Typography
                        variant="subtitle2"
                        sx={{ fontFamily: "montserrat", textAlign: "right" }}
                    >
                        {valueText}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );
}
