import { useEffect, useState } from "react";
import {
    Typography,
    Paper,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/api";
import { handleApiError } from "../../../../utils/handleApiError";
import { useAuth } from "../../../../context/AuthContext";

export default function SHUConfigList() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const { logout, login } = useAuth();

    const fetchData = async () => {
        try {
            const res = await api.get("/shuConfig", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setData(res.data.data || []);
        } catch (err) {
            handleApiError(err, null, { logout, login });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Typography variant="h4" fontFamily="montserrat" fontWeight={500}>
                Konfigurasi SHU
            </Typography>

            <Paper elevation={3} sx={{ borderRadius: 3, p: 3, mt: 2 }}>
                <Grid container justifyContent="flex-end" mb={2}>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/master/shu-config/create")}
                    >
                        Tambah Tahun SHU
                    </Button>
                </Grid>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tahun</TableCell>
                            <TableCell>Jumlah Pembagian</TableCell>
                            <TableCell align="right">Aksi</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.tahun}</TableCell>
                                <TableCell>{row.items.length}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() =>
                                            navigate(`/master/shu-config/${row.tahun}`)
                                        }
                                    >
                                        Detail
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </>
    );
}
