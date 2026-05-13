import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MatchForm from "../../components/forms/MatchForm.jsx";
import Shell from "../../Containers/Shell.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { assignReferee, createMatch, getReferees } from "../../services/api.js";

export default function AdminCreateMatchPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [referees, setReferees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getReferees()
      .then((response) => {
        setReferees(response.referees || []);
      })
      .catch((requestError) => {
        setError(requestError.message);
      });
  }, []);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError("");

    try {
      const response = await createMatch(
        {
          teamA: payload.teamA,
          teamB: payload.teamB,
          date: payload.date,
          location: payload.location,
        },
        auth.token,
      );

      if (payload.refereeId) {
        await assignReferee(
          response.match.id || response.match._id,
          payload.refereeId,
          auth.token,
        );
      }

      navigate("/matches", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell title={t("createMatch")}>
      {error ? <p className="error-text">{error}</p> : null}
      <MatchForm
        loading={loading}
        onSubmit={handleSubmit}
        referees={referees}
        submitLabel={t("createMatch")}
      />
    </Shell>
  );
}
