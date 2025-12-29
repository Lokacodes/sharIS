import { MoreVert } from '@mui/icons-material';
import { Paper, Grid, useMediaQuery, Divider } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useAuth } from '../context/AuthContext';
import { useDashboardData } from '../hooks/useDashboardData';
import formatCurrency from '../utils/currencyFormatter';



export default function HomePage() {
    const { login, logout } = useAuth();

    const { dashboard, loading } = useDashboardData({ login, logout });

    const isXsScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const { user } = useAuth();

    const allow = (roles) => user && roles.includes(user.role);

    if (!user) return null;
    return (
        <>
            <Typography variant="h4" fontWeight={500} fontFamily={'montserrat'} color="initial">Beranda</Typography>
            <Paper elevation={3} sx={{ borderRadius: 5, position: 'relative', overflow: 'hidden', p: { xs: 3, sm: 4, md: 4 }, mt: 2 }}>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={6}>
                        <Typography variant={isXsScreen ? "body2" : "h6"} fontWeight={400} fontFamily={'montserrat'} color="#4B4B4B">Selamat Datang di</Typography>
                        <Typography variant={isXsScreen ? "body1" : "h6"} fontFamily={'montserrat'} color="#4B4B4B">Koperasi Syariah</Typography>
                        <Typography variant={isXsScreen ? "body1" : "h6"} fontWeight={600} fontFamily={'montserrat'} color="initial">Khadijah Ar-Rochim Sejahtera</Typography>
                    </Grid>
                    {!isXsScreen && (
                        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <img src="hijab.jpg" alt="" style={{ height: '100%', objectFit: 'cover', position: 'absolute', }} />
                        </Grid>
                    )}
                </Grid>
            </Paper>
            <Grid container spacing={3} py={3} alignItems="center">
                <Grid item xs="12" md="12" lg="4">
                    <Paper elevation={3} sx={{ borderRadius: 5, p: 2, background: 'linear-gradient(to bottom left, #91C125, #3285A9)' }}>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item xs={6}>
                                <Typography variant="body1" color="#FFFFFF" fontFamily={'montserrat'}>ANGGOTA</Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <MoreVert fontSize='medium' sx={{ color: "#ffffff" }} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} p={4} justifyContent="center"
                            textAlign="center">
                            <Grid item>
                                <Typography variant="h1" fontWeight={700} color="#FFFFFF" fontFamily={'montserrat'}>{dashboard.memberCount}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6" color="#FFFFFF" fontFamily={'montserrat'}>Orang</Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs="12" md="12" lg="4">
                    <Paper elevation={3} sx={{ borderRadius: 5, p: 2 }}>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item xs={6}>
                                <Typography variant="body1" color="inherit" fontFamily={'montserrat'}>PIUTANG</Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <MoreVert fontSize='medium' sx={{ color: "inherit" }} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} direction={'column'} pt={2}>
                            <Grid item>
                                <Typography variant="body1" color="inherit" fontFamily={'montserrat'}>Belum Lunas</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h4" color="inherit" fontFamily={'montserrat'}>{formatCurrency(dashboard.loan.unpaid)}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" color="inherit" fontFamily={'montserrat'}>Lunas</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h4" color="inherit" fontFamily={'montserrat'}>{formatCurrency(dashboard.loan.paid)}</Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs="12" md="12" lg="4">
                    <Paper elevation={3} sx={{ borderRadius: 5, p: 2 }}>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item xs={6}>
                                <Typography variant="body1" color="inherit" fontFamily={'montserrat'}>SIMPANAN</Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <MoreVert fontSize='medium' sx={{ color: "inherit" }} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} direction={'column'} pt={2}>
                            <Grid item>
                                <Grid container spacing={7}>
                                    <Grid item xs={4}>
                                        <Typography variant="body1" color="inherit" fontFamily={'montserrat'} >Pokok</Typography>
                                    </Grid>
                                    <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Typography variant="body1" fontFamily={'montserrat'} color="inherit">{formatCurrency(dashboard.saving.pokok)}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Divider />
                            </Grid>
                            <Grid item>
                                <Grid container spacing={7}>
                                    <Grid item xs={4}>
                                        <Typography variant="body1" color="inherit" fontFamily={'montserrat'} >Wajib</Typography>
                                    </Grid>
                                    <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Typography variant="body1" fontFamily={'montserrat'} color="inherit">{formatCurrency(dashboard.saving.wajib)}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Divider />
                            </Grid>
                            <Grid item>
                                <Grid container spacing={7}>
                                    <Grid item xs={4}>
                                        <Typography variant="body1" color="inherit" fontFamily={'montserrat'} >Sukarela</Typography>
                                    </Grid>
                                    <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Typography variant="body1" fontFamily={'montserrat'} color="inherit">{formatCurrency(dashboard.saving.sukarela)}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Divider />
                            </Grid>
                            <Grid item>
                                <Grid container spacing={7}>
                                    <Grid item xs={4}>
                                        <Typography variant="body1" color="inherit" fontFamily={'montserrat'} >Jumlah</Typography>
                                    </Grid>
                                    <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Typography variant="body1" fontFamily={'montserrat'} color="inherit">{formatCurrency(dashboard.saving.total)}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Divider />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}
