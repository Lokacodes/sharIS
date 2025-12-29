import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import ErrorDialog from "../components/ErrorDialog";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
    const [error, setError] = useState(null);

    const showError = (message, title) => {
        setError({ message, title });
    };

    const closeError = () => {
        setError(null);
    };

    return (
        <ErrorContext.Provider value={{ showError }}>
            {children}

            <ErrorDialog
                open={!!error}
                title={error?.title}
                message={error?.message}
                onClose={closeError}
            />
        </ErrorContext.Provider>
    );
};

ErrorProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useError = () => useContext(ErrorContext);
