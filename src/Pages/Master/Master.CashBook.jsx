import { Grid } from "@mui/material";
import DataTable from "../TableView";

export default function CashbookList() {
    return (
        <>
            <Grid container spacing={2} sx={{ p: 4 }}>
                <Grid item md={12} xs={12}>
                    <DataTable
                        title="Buku Kas"
                        endpoint="/cashbook"
                        columns={[
                            { key: "date", label: "Tanggal" },
                            { key: "type", label: "Tipe" },
                            { key: "module", label: "Modul" },
                            { key: "member.name", label: "Anggota" },
                            { key: "amount", label: "Jumlah" },
                            { key: "balance", label: "Saldo" },
                            { key: "description", label: "Keterangan" },
                        ]}
                        formatCell={(key, value) => {
                            if (key === "amount" || key === "balance") {
                                return `Rp ${Number(value).toLocaleString("id-ID")}`;
                            }

                            if (key === "type") {
                                return value === "IN" ? "Masuk" : "Keluar";
                            }

                            return value ?? "-";
                        }}
                        searchable
                        paginated
                    />
                </Grid>
            </Grid>
        </>
    );
}
