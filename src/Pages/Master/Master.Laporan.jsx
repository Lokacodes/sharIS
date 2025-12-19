import { useEffect, useState } from "react";
import {
    Typography,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from "@mui/material";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../../utils/handleApiError";
import SHULaporan from "./Laporan/SHULaporan";
import NeracaLaporan from "./Laporan/NeracaLaporan";
import LabaRugiSection from "./Laporan/LabaRugi";

export default function LaporanMaster() {
    const currentYear = new Date().getFullYear();
    const [tahun, setTahun] = useState(currentYear);
    const [shu, setShu] = useState(null);
    const [neraca, setNeraca] = useState(null);
    const [data, setData] = useState([]);

    const { login, logout } = useAuth();
    const navigate = useNavigate();

    const fetchData2 = async () => {
        try {
            const res = await api.get("/shuConfig", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setData(res.data.data || []);
        } catch (err) {
            handleApiError(err, null, { logout, login });
        }
    };

    // Fetch SHU config list (once)
    useEffect(() => {
        fetchData2();
    }, []);

    // Fetch laporan when year changes
    useEffect(() => {
        async function fetchData() {
            try {
                const [shuRes, neracaRes] = await Promise.all([
                    api.get(`/shu?tahun=${tahun}`),
                    api.get(`/neraca?tahun=${tahun}`),
                ]);

                setShu(shuRes.data.data);
                setNeraca(neracaRes.data.data);
            } catch (e) {
                handleApiError(e, navigate, { login, logout });
            }
        }

        fetchData();
    }, [tahun]);


    return (
        <>
            <Typography variant="h4" fontWeight={500} fontFamily="montserrat">
                Laporan Tahunan
            </Typography>

            {/* Tahun + Navigasi SHU Config */}
            <Paper elevation={3} sx={{ borderRadius: 3, p: 3, mt: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <FormControl fullWidth>
                            <InputLabel>Tahun</InputLabel>
                            <Select
                                value={tahun}
                                label="Tahun"
                                onChange={(e) => setTahun(Number(e.target.value))}
                            >
                                {data.map((item) => (
                                    <MenuItem key={item.tahun} value={item.tahun}>
                                        {item.tahun}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => navigate("/master/shu-config")}
                        >
                            Kelola Alokasi SHU
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {shu && <SHULaporan data={shu} />}
            {shu && <LabaRugiSection data={shu} />}
            {neraca && <NeracaLaporan data={neraca} />}
        </>
    );
}
