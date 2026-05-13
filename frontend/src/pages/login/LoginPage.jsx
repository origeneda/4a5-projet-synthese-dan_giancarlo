import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Shell from "../../components/Shell.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { loginUser } from "../../services/api.js";

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginUser(formState);
      auth.login(response);
      const fallbackRoute =
        response.role === "admin" ? "/matches" : "/my-matches";
      navigate(location.state?.from || fallbackRoute, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell title={t("login")}>
      <form className="simple-form auth-form" onSubmit={handleSubmit}>
        <label>
          {t("email")}
          <input
            name="email"
            onChange={(event) =>
              setFormState({ ...formState, email: event.target.value })
            }
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
            onChange={(event) =>
              setFormState({ ...formState, password: event.target.value })
            }
            required
            type="password"
            value={formState.password}
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <div className="action-row">
          <button className="primary-button" disabled={loading} type="submit">
            {t("login")}
          </button>
        </div>
      </form>
    </Shell>
  );
}
