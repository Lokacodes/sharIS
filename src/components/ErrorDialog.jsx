import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { useError } from "../context/ErrorContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ErrorDialog() {
    const { error, closeError } = useError();
    const { logoutReason } = useAuth();
    const navigate = useNavigate();

    if (!error) return null;

    const handleClose = () => {
        closeError();

        // ✅ ONLY redirect if session expired
        if (logoutReason === "expired") {
            navigate("/login", { replace: true });
        }
    };

    return (
        <Dialog open>
            <DialogTitle>{error.title}</DialogTitle>
            <DialogContent>{error.message}</DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}
