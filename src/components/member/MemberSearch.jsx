import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import api from "../../api/api";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import PropTypes from 'prop-types';



export function MemberSearch({
    onSelect = () => null,
    value = null,
}) {
    const navigate = useNavigate()
    const { login, logout } = useAuth()
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (event) => {
        const query = event.target.value;
        if (!query) return setOptions([]);

        setLoading(true);
        try {
            const response = await api.get(`/members/search?name=${query}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setOptions(response.data.data);
        } catch (error) {
            handleApiError(error, navigate, { logout, login });
        } finally {
            setLoading(false);
        }
    };
    return (
        <Autocomplete
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            options={options}
            value={value || null}
            getOptionLabel={(option) => option.name}
            onInputChange={handleSearch}
            onChange={(e, value) => onSelect(value)}
            loading={loading}
            renderOption={(props, option) => (
                <li {...props} key={option.id}>
                    {option.name}
                </li>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Cari Anggota"
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
}

MemberSearch.propTypes = {
    onSelect: PropTypes.func,
    value: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.oneOf([null])
    ]),
};
