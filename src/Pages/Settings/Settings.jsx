import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import {
    Box,
    Paper,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemButton,
    Divider,
    Stack,
} from "@mui/material";

export default function Settings() {
    const navigate = useNavigate();

    const [state, setState] = useState({
        notifications: true,
        emailNotifications: false,
        darkMode: false,
        autoUpdates: true,
    });

    const handleToggle = (key) => {
        setState((s) => ({ ...s, [key]: !s[key] }));
    };

    const handleNavigate = (path) => {
        // small abstraction so you can replace with modal/dialog control
        navigate(path);
    };

    return (
        <Box
            sx={{
                p: { xs: 2, md: 4 },
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: "100%",
                    maxWidth: 920,
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 2,
                        py: 1.5,
                        borderBottom: (t) => `1px solid ${t.palette.divider}`,
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                        <Box>
                            <Typography variant="h6">Pengaturan</Typography>
                        </Box>
                    </Stack>
                </Box>

                <List disablePadding>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleNavigate("/settings/profile")}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: "secondary.main" }}>
                                    <AccountCircleIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Profil" secondary="Edit profil" />
                        </ListItemButton>
                    </ListItem>
                    <Divider component="li" />

                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleNavigate("/pengaturan/pinjaman")}>
                            <ListItemAvatar>
                                <Avatar>
                                    <MonetizationOnIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Pinjaman" secondary="Atur preferensi pinjaman" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleNavigate("/settings/user")}>
                            <ListItemAvatar>
                                <Avatar>
                                    <AccountCircleIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="User" secondary="Atur user" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Paper>
        </Box>
    );
}