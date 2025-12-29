import Typography from '@mui/material/Typography'
import { Grid, Paper, IconButton } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { Assessment, CreditCard, AccountBalanceOutlined, AttachMoneyOutlined, AssessmentOutlined } from '@mui/icons-material';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


export default function Master() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const allow = (roles) => user && roles.includes(user.role);

    if (!user) return null;
    return (
        <>
            <Typography variant="h4" fontWeight={500} fontFamily={'montserrat'} color="initial">Master</Typography>
            <Grid container spacing={2}>
                {allow(['SUPERADMIN', 'SEKRETARIS']) && <Grid item>
                    <IconButton aria-label="" onClick={() => navigate('/master/member')}>
                        <Paper elevation={3} sx={{ borderRadius: 5 }}>
                            <Grid container spacing={1} direction={"column"} textAlign={"center"} p={4} width={"150px"}>
                                <Grid item>
                                    <PeopleIcon fontSize='large'></PeopleIcon>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" color="initial">Anggota</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </IconButton>
                </Grid>}
                {allow(['SUPERADMIN', 'BENDAHARA']) && <Grid item>
                    <IconButton aria-label="" onClick={() => navigate('/master/simpanan')}>
                        <Paper elevation={3} sx={{ borderRadius: 5 }}>
                            <Grid container spacing={1} direction={"column"} textAlign={"center"} p={4} width={"150px"}>
                                <Grid item>
                                    <LocalAtmIcon fontSize='large'></LocalAtmIcon>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" color="initial">Simpanan</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </IconButton>

                </Grid>}
                {allow(['SUPERADMIN', 'BENDAHARA']) && <Grid item>
                    <IconButton aria-label="" onClick={() => navigate('/master/pinjaman')}>
                        <Paper elevation={3} sx={{ borderRadius: 5 }}>
                            <Grid container spacing={1} direction={"column"} textAlign={"center"} p={4} width={"150px"}>
                                <Grid item>
                                    <CreditCard fontSize='large'></CreditCard>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" color="initial">Piutang</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </IconButton>

                </Grid>}

                {allow(['SUPERADMIN', 'BENDAHARA']) && <Grid item>
                    <IconButton aria-label="" onClick={() => navigate('/master/modal')}>
                        <Paper elevation={3} sx={{ borderRadius: 5 }}>
                            <Grid container spacing={1} direction={"column"} textAlign={"center"} p={4} width={"150px"}>
                                <Grid item>
                                    <AccountBalanceOutlined fontSize='large'></AccountBalanceOutlined>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" color="initial">Modal</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </IconButton>
                </Grid>}

                {allow(['SUPERADMIN', 'BENDAHARA']) && <Grid item>
                    <IconButton aria-label="" onClick={() => navigate('/master/kas')}>
                        <Paper elevation={3} sx={{ borderRadius: 5 }}>
                            <Grid container spacing={1} direction={"column"} textAlign={"center"} p={4} width={"150px"}>
                                <Grid item>
                                    <AttachMoneyOutlined fontSize='large' ></AttachMoneyOutlined>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" color="initial">Kas</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </IconButton>
                </Grid>}

                {allow(['SUPERADMIN', 'BENDAHARA']) && <Grid item>
                    <IconButton aria-label="" onClick={() => navigate('/master/pengeluaran')}>
                        <Paper elevation={3} sx={{ borderRadius: 5 }}>
                            <Grid container spacing={1} direction={"column"} textAlign={"center"} p={4} width={"150px"}>
                                <Grid item>
                                    <ProductionQuantityLimitsIcon fontSize='large'></ProductionQuantityLimitsIcon>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" color="initial">Pengeluaran</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </IconButton>
                </Grid>}
            </Grid>
        </>
    );
}
