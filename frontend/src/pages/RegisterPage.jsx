import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Shell from "../components/Shell.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { registerUser } from "../services/api.js";

export default function RegisterPage() {
    const auth = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [formState, setFormState] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await registerUser({ ...formState, role: "admin" });
            auth.login(response);
            navigate("/matches", { replace: true });
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Shell title={t("register")}>
            <form className="simple-form auth-form" onSubmit={handleSubmit}>
                <label>
                    {t("name")}
                    <input
                        name="name"
                        onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                        required
                        value={formState.name}
                    />
                </label>
                <label>
                    {t("email")}
                    <input
                        name="email"
                        onChange={(event) => setFormState({ ...formState, email: event.target.value })}
                        required
                        type="email"
                        value={formState.email}
                    />
                </label>
                <label>
                    {t("password")}
                    <input
                        minLength="6"
                        name="password"
                        onChange={(event) => setFormState({ ...formState, password: event.target.value })}
                        required
                        type="password"
                        value={formState.password}
                    />
                </label>

                {error ? <p className="error-text">{error}</p> : null}

                <div className="action-row">
                    <button className="primary-button" disabled={loading} type="submit">
                        {t("register")}
                    </button>
                    <Link className="secondary-button link-button" to="/login">
                        {t("login")}
                    </Link>
                </div>
            </form>
        </Shell>
    );
}