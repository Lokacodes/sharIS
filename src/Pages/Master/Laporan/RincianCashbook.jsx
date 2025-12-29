import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import DataTable from "../../TableView";

export default function CashBookWithFilter() {
    const { module } = useParams(); // INCOME | EXPENSE | MODAL | etc

    const getTitle = () => {
        switch (module) {
            case 'INCOME': return 'PENDAPATAN';
            case 'EXPENSE': return 'PENGELUARAN';
            default: module
        }
    }
    return (
        <Grid container spacing={2} sx={{ p: 4 }}>
            <Grid item md={12} xs={12}>
                <DataTable
                    title={getTitle()}
                    endpoint={`/cashbook/search?module=${module}`}
                    columns={[
                        { key: "date", label: "Tanggal" },
                        { key: "member.name", label: "Anggota" },
                        { key: "user.name", label: "Pengurus" },
                        { key: "amount", label: "Jumlah" },
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
    );
}
