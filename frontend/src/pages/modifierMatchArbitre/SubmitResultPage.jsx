import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Shell from "../../components/Shell.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getMatchById, updateMatch } from "../../services/api.js";

export default function SubmitResultPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { matchId } = useParams();
  const { t } = useLanguage();
  const [match, setMatch] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMatchById(matchId)
      .then((response) => {
        setMatch(response.match);
      })
      .catch((requestError) => {
        setError(requestError.message);
      });
  }, [matchId]);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError("");

    try {
      await updateMatch(
        matchId,
        {
          scoreA: payload.scoreA,
          scoreB: payload.scoreB,
          status: "termin\u00E9",
        },
        auth.token,
      );
      navigate("/my-matches", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell title={t("result")}>
      {error ? <p className="error-text">{error}</p> : null}
      {match ? (
        <form
          className="simple-form panel-block"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit({
              scoreA: match.scoreA,
              scoreB: match.scoreB,
            });
          }}
        >
          <div className="team-row">
            <div className="team-circle">
              <span>{match.teamA}</span>
            </div>
            <div className="score-block">
              <strong>VS</strong>
            </div>
            <div className="team-circle">
              <span>{match.teamB}</span>
            </div>
          </div>

          <div className="form-grid two-columns">
            <label>
              {t("scoreA")}
              <input
                min="0"
                onChange={(event) =>
                  setMatch((currentMatch) => ({
                    ...currentMatch,
                    scoreA: Number(event.target.value),
                  }))
                }
                type="number"
                value={match.scoreA ?? 0}
              />
            </label>
            <label>
              {t("scoreB")}
              <input
                min="0"
                onChange={(event) =>
                  setMatch((currentMatch) => ({
                    ...currentMatch,
                    scoreB: Number(event.target.value),
                  }))
                }
                type="number"
                value={match.scoreB ?? 0}
              />
            </label>
          </div>

          <div className="action-row">
            <button className="primary-button" disabled={loading} type="submit">
              {t("result")}
            </button>
          </div>
        </form>
      ) : null}
    </Shell>
  );
}
