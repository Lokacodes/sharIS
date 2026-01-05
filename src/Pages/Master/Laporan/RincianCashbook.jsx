import { Grid } from "@mui/material";
import DataTable from "../../TableView";
import { useSearchParams } from "react-router-dom";

export default function CashBookWithFilter() {
    const [searchParams] = useSearchParams();

    const modul = searchParams.get("modul");
    const tahun = searchParams.get("tahun");

    const getTitle = () => {
        switch (modul) {
            case 'INCOME': return 'PENDAPATAN';
            case 'EXPENSE': return 'PENGELUARAN';
            default: modul
        }
    }
    return (
        <Grid container spacing={2} sx={{ p: 4 }}>
            <Grid item md={12} xs={12}>
                <DataTable
                    title={getTitle()}
                    endpoint={`/cashbook/search?module=${modul}&year=${tahun}`}
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
