import { Paper, Grid } from "@mui/material";
import DataTable from "../TableView";
export default function PinjamanMaster() {
    return (
        <>
            <Grid container spacing={2} sx={{ p: 4 }}>
                <Grid item md={12} xs={12}>
                    <DataTable
                        title={"Daftar Pinjaman"}
                        columns={[
                            {
                                key: 'member.name',
                                label: 'Anggota'
                            },
                            {
                                key: 'user.name',
                                label: 'Pegawai'
                            },
                            {
                                key: 'amount',
                                label: 'Jumlah (Rp)'
                            },
                            {
                                key: 'LoanDate',
                                label: 'Tanggal Pinjam'
                            },
                            {
                                key: 'Deadline',
                                label: 'Tenggat Pelunasan'
                            },
                            {
                                key: 'status',
                                label: 'Status'
                            },
                        ]}
                        endpoint="/loan"
                        showDetail={true}
                        detailPath={"/detail/pinjaman"}
                    />
                </Grid>
            </Grid>
        </>
    )
}