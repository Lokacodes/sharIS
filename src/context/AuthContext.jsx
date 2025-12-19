import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"))

    const login = (userData, tokenData, refreshTokenData) => {
        console.log(userData);
        setUser(userData);
        setToken(tokenData);
        setRefreshToken(refreshTokenData)
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", tokenData);
        localStorage.setItem("refreshToken", refreshTokenData)
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setRefreshToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
    };


    return (
        <AuthContext.Provider value={{ user, token, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
