import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "refmatch-auth";

export function AuthProvider({ children }) {
    const [authState, setAuthState] = useState(() => {
        const storedValue = localStorage.getItem(STORAGE_KEY);
        return storedValue ? JSON.parse(storedValue) : null;
    });

    useEffect(() => {
        if (authState) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
            return;
        }

        localStorage.removeItem(STORAGE_KEY);
    }, [authState]);

    const login = (userData) => {
        setAuthState(userData);
    };

    const logout = () => {
        setAuthState(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user: authState,
                token: authState?.token || null,
                isLoggedIn: Boolean(authState?.token),
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}