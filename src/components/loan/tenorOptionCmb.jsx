import { useState } from "react";
import PropTypes from "prop-types";
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import api from "../../api/api";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function TenorOptionSelect({ value, onSelect }) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, logout } = useAuth();
    const [open, setOpen] = useState(false);

    const fetchOptions = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/tenorCmb`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setOptions(response.data.data || []);
        } catch (error) {
            handleApiError(error, navigate, { logout, login });
        } finally {
            setLoading(false);
        }
    };

    const selectedValue = value && typeof value === "object" ? value.id : value;

    return (
        <FormControl fullWidth>
            <InputLabel>Tenor PInjaman</InputLabel>
            <Select
                open={open}
                label="Tenor PInjaman"
                value={selectedValue || ""}
                onOpen={() => {
                    setOpen(true);
                    fetchOptions();
                }}
                onClose={() => setOpen(false)}
                onChange={(e) => {
                    const selectedId = e.target.value;
                    const selected = options.find((o) => o.id == selectedId) || null;
                    onSelect(selected);
                }}
                endAdornment={
                    loading ? <CircularProgress size={20} /> : null
                }
            >
                {options.length === 0 && !loading && (
                    <MenuItem disabled>No loan options available</MenuItem>
                )}

                {options.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                        {opt.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

TenorOptionSelect.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
        PropTypes.number,
    ]),
    onSelect: PropTypes.func.isRequired,
};
