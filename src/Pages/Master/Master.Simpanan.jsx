import { Paper, Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { MemberSearch } from "../../components/member/MemberSearch";
import { useState, useEffect } from "react";
import { useSavingData } from "../../hooks/useSavingData";
import { useAuth } from "../../context/AuthContext";
import { InfoRow } from "../../components/general/InfoRow";
import DataTable from "../TableView";

export default function SimpananMaster() {
    const [selectedMember, setSelectedMember] = useState(null);
    const [totalSimpananPokok, setTotalSimpananPokok] = useState(0)
    const [totalSimpananWajib, setTotalSimpananWajib] = useState(0)
    const [totalSimpananSukarela, setTotalSimpananSukarela] = useState(0)
    const [savingType, setSavingType] = useState("Sukarela");


    const { user, login, logout } = useAuth()

    const { saving } = useSavingData(selectedMember?.id, { login, logout });

    useEffect(() => {
        if (saving) {
            const totalPokok = saving.simpanan_pokok?.reduce(
                (sum, item) => sum + Number(item.amount || 0),
                0
            ) || 0;

            const totalWajib = saving.simpanan_wajib?.reduce(
                (sum, item) => sum + Number(item.amount || 0),
                0
            ) || 0;

            const totalSukarela = saving.simpanan_sukarela?.reduce(
                (sum, item) => sum + Number(item.amount || 0),
                0
            ) || 0;

            setTotalSimpananPokok(totalPokok);
            setTotalSimpananWajib(totalWajib);
            setTotalSimpananSukarela(totalSukarela);
        }
    }, [saving])

    return (
        <>
            <Typography variant="h4" fontWeight={500} fontFamily={"montserrat"}>
                Simpanan
            </Typography>
            <Grid container spacing={2}>
                <Grid item md={4} xs={12}>
                    <Paper elevation={3} sx={{ borderRadius: 3, p: 4, mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12}>
                                <MemberSearch
                                    value={selectedMember}
                                    onSelect={(member) => setSelectedMember(member)}
                                />
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <Grid container spacing={1}>
                                    <InfoRow md={12} labelText={"Saldo Simpanan"} />
                                    <InfoRow md={12} paddingLeft={2} labelText={"Pokok"} valueText={totalSimpananPokok} />
                                    <InfoRow md={12} paddingLeft={2} labelText={"Wajib"} valueText={totalSimpananWajib} />
                                    <InfoRow md={12} paddingLeft={2} labelText={"Sukarela"} valueText={totalSimpananSukarela} />
                                    <InfoRow md={12} labelText={"Total"} valueText={totalSimpananPokok + totalSimpananWajib + totalSimpananSukarela} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item md={8} xs={12}>
                    {selectedMember &&
                        <Paper elevation={3} sx={{ borderRadius: 3, p: 4, mt: 2 }}>
                            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                <Grid item xs={12} md={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="saving-type-label">Jenis Simpanan</InputLabel>
                                        <Select
                                            labelId="saving-type-label"
                                            id="saving-type-select"
                                            value={savingType}
                                            label="Jenis Simpanan"
                                            onChange={(e) => setSavingType(e.target.value)}
                                        >
                                            <MenuItem value="Pokok">Pokok</MenuItem>
                                            <MenuItem value="Wajib">Wajib</MenuItem>
                                            <MenuItem value="Sukarela">Sukarela</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <DataTable
                                searchable={false}
                                columns={[
                                    {
                                        key: 'user.name',
                                        label: 'Nama Pengguna',
                                        valueGetter: (row) => row.user?.name || '-',
                                    },
                                    {
                                        key: 'amount',
                                        label: 'Jumlah',
                                        valueGetter: (row) =>
                                            row.amount ? Number(row.amount).toLocaleString('id-ID') : '-',
                                    },
                                    {
                                        key: 'date',
                                        label: 'Tanggal',
                                        valueGetter: (row) => row.date,
                                    },
                                ]}
                                title={`Daftar Simpanan ${savingType}`}
                                endpoint={`/saving/member/${selectedMember.id}?type=${savingType.toLowerCase()}`}
                            />

                        </Paper>}
                </Grid>
            </Grid>
        </>)
}