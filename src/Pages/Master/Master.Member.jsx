import { Grid } from "@mui/material";

import DataTable from "../TableView";
import { useNavigate } from "react-router-dom";
import { Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
export default function MemberMaster() {

    const navigate = useNavigate()

    return (
        <>
            <Grid container spacing={2} sx={{ p: 4 }}>
                <Grid item md={12} xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate("/master/member/create")}
                        >
                            Tambah Anggota
                        </Button>
                    </Box>
                </Grid>
                <Grid item md={12} xs={12}>

                    <DataTable
                        columns={[
                            { key: 'name', label: 'Nama' },
                            { key: 'dateOfBirth', label: 'Tanggal Lahir' },
                            { key: 'address', label: 'Alamat' },
                            { key: 'phone', label: 'No. Telepon' },

                        ]}
                        title={"Daftar Anggota"}
                        endpoint="/members"
                        showDetail={true}
                        detailPath={"/detail/member"}
                    />
                </Grid>

            </Grid>
        </>
    )
}