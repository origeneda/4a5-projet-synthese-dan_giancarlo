import { useEffect, useState } from "react";

import RefereeForm from "../../components/forms/RefereeForm.jsx";
import Shell from "../../Containers/Shell.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getReferees, updateReferee } from "../../services/api.js";

export default function RefereeProfilePage() {
  const auth = useAuth();
  const { t } = useLanguage();
  const [referee, setReferee] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadProfile = async () => {
    try {
      const response = await getReferees();
      const currentReferee = (response.referees || []).find(
        (item) => item.email === auth.user?.email,
      );

      setReferee(currentReferee || null);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [auth.user?.email]);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError("");

    try {
      await updateReferee(referee.id || referee._id, payload, auth.token);
      await loadProfile();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell subtitle={t("loginInfoLocked")} title={t("profileInfo")}>
      {error ? <p className="error-text">{error}</p> : null}
      {referee ? (
        <RefereeForm
          hidePassword
          initialValues={referee}
          loading={loading}
          onSubmit={handleSubmit}
          readOnlyEmail
          submitLabel={t("save")}
        />
      ) : (
        <p className="muted-text">{t("noReferees")}</p>
      )}
    </Shell>
  );
}
