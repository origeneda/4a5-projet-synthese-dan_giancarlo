import { useState } from "react";
import { useNavigate } from "react-router-dom";

import RefereeForm from "../../components/forms/RefereeForm.jsx";
import Shell from "../../Containers/Shell.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { createReferee, registerUser } from "../../services/api.js";

export default function AdminCreateRefereePage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError("");

    try {
      await registerUser({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: "referee",
      });

      await createReferee(payload, auth.token);
      navigate("/referees", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell title={t("createReferee")}>
      {error ? <p className="error-text">{error}</p> : null}
      <RefereeForm
        loading={loading}
        onSubmit={handleSubmit}
        submitLabel={t("createReferee")}
      />
    </Shell>
  );
}
