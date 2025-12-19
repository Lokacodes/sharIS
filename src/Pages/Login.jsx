import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, CircularProgress } from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
                email,
                password,
            });

            login(res.data.data.user, res.data.data.accessToken, res.data.data.refreshToken);
            console.log(`refresh ${res.data.data.refreshToken}`);
            console.log(`access ${res.data.data.accessToken}`);
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Login gagal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f4f6f8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Roboto, Montserrat",
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    width: "100%",
                    maxWidth: 400,
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, mb: 3, color: "#052831" }}
                >
                    SharIS Login
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            backgroundColor: "#052831",
                            "&:hover": { backgroundColor: "#073b47" },
                            height: 45,
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default LoginPage;
