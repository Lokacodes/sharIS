import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Home, Storage, SyncAlt, Timeline, Logout, Settings, SettingsAccessibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useAuth } from '../context/AuthContext';
import { Outlet } from 'react-router-dom';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 10,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    backgroundColor: '#052831',
    '& .MuiDrawer-paper': {
      backgroundColor: '#052831',
    },
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { user } = useAuth();

  const allow = (roles) => user && roles.includes(user.role);

  if (!user) return null;

  const menus = [
    { text: 'Beranda', icon: <Home />, path: '/', roles: ['SUPERADMIN', 'BENDAHARA', 'PENGURUS', 'KETUA', 'SEKRETARIS'] },
    { text: 'Master Data', icon: <Storage />, path: 'master', roles: ['SUPERADMIN', 'BENDAHARA', 'SEKRETARIS'] },
    { text: 'Transaksi', icon: <SyncAlt />, roles: ['SUPERADMIN', 'BENDAHARA', 'KETUA'] },
    { text: 'Laporan', icon: <Timeline />, path: 'master/laporan', roles: ['SUPERADMIN', 'SEKRETARIS', 'KETUA'] },
    { text: 'Pengaturan', icon: <Settings />, path: 'pengaturan', roles: ['SUPERADMIN'] },
  ];


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout()
    setLogoutDialogOpen(false);
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" fontFamily={"montserrat"} fontWeight={600} noWrap component="div">
            SharIS
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menus
            .filter(menu => allow(menu.roles))
            .map((menu, index) => (
              <React.Fragment key={menu.text}>
                <ListItem
                  disablePadding
                  sx={{ display: 'block' }}
                  onClick={() => menu.path && navigate(menu.path)}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {menu.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography fontFamily="montserrat">{menu.text}</Typography>}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
                {menu.text === 'Transaksi' && open && allow(['SUPERADMIN', 'BENDAHARA',]) && (
                  <List component="div" disablePadding sx={{ pl: 4 }}>
                    <ListItem disablePadding onClick={() => navigate("transaksi/simpanan")}>
                      <ListItemButton sx={{ minHeight: 40 }}>
                        <ListItemText primary={<Typography fontSize={14}>Simpanan</Typography>} />
                      </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding onClick={() => navigate("transaksi/pinjaman")}>
                      <ListItemButton sx={{ minHeight: 40 }}>
                        <ListItemText primary={<Typography fontSize={14}>Pinjaman</Typography>} />
                      </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding onClick={() => navigate("transaksi/angsuran")}>
                      <ListItemButton sx={{ minHeight: 40 }}>
                        <ListItemText primary={<Typography fontSize={14}>Angsuran</Typography>} />
                      </ListItemButton>
                    </ListItem>
                  </List>
                )}

                {menu.text === 'Transaksi' && open && allow(['KETUA']) && (
                  <List component="div" disablePadding sx={{ pl: 4 }}>
                    <ListItem
                      disablePadding
                      onClick={() => navigate("transaksi/pengajuan-pinjaman")}
                    >
                      <ListItemButton sx={{ minHeight: 40 }}>
                        <ListItemText
                          primary={
                            <Typography fontSize={14}>
                              Ajuan Pinjaman
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                )}

              </React.Fragment>
            ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <List sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <Divider />
          <ListItem disablePadding sx={{ display: 'block' }} onClick={handleLogoutClick}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Logout />
              </ListItemIcon>
              <ListItemText primary={
                <Typography fontFamily={'montserrat'}>
                  Logout
                </Typography>
              } sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
        <Dialog
          open={logoutDialogOpen}
          onClose={handleLogoutCancel}
        >
          <DialogTitle>Konfirmasi Logout</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Apakah Anda yakin ingin logout?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLogoutCancel}>Batal</Button>
            <Button onClick={handleLogoutConfirm} color="error">Logout</Button>
          </DialogActions>
        </Dialog>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
        <Outlet />
      </Box>
    </Box>
  );
}
