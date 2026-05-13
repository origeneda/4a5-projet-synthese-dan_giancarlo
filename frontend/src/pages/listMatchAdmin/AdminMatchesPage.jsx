import { useEffect, useState } from "react";

import MatchCard from "../../components/matchCard/MatchCard.jsx";
import MatchForm from "../../components/forms/MatchForm.jsx";
import Shell from "../../Containers/Shell.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  assignReferee,
  deleteMatch,
  getMatches,
  getReferees,
  updateMatch,
} from "../../services/api.js";

export default function AdminMatchesPage() {
  const auth = useAuth();
  const { t } = useLanguage();
  const [matches, setMatches] = useState([]);
  const [referees, setReferees] = useState([]);
  const [editingMatch, setEditingMatch] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [matchResponse, refereeResponse] = await Promise.all([
        getMatches(),
        getReferees(),
      ]);
      setMatches(matchResponse.matches || []);
      setReferees(refereeResponse.referees || []);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (match) => {
    setError("");
    try {
      await deleteMatch(match.id || match._id, auth.token);
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleUpdate = async (payload) => {
    setLoading(true);
    setError("");

    try {
      await updateMatch(
        editingMatch.id || editingMatch._id,
        payload,
        auth.token,
      );
      if (payload.refereeId) {
        await assignReferee(
          editingMatch.id || editingMatch._id,
          payload.refereeId,
          auth.token,
        );
      }
      setEditingMatch(null);
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell title={t("adminMatches")}>
      {error ? <p className="error-text">{error}</p> : null}
      <div className="stack-list">
        {matches.length ? (
          matches.map((match) => (
            <MatchCard
              key={match.id || match._id}
              match={match}
              onDelete={handleDelete}
              onEdit={setEditingMatch}
              showActions
            />
          ))
        ) : (
          <p className="muted-text">{t("noMatches")}</p>
        )}
      </div>

      {editingMatch ? (
        <section className="panel-block">
          <h2>{t("update")}</h2>
          <MatchForm
            includeScores
            initialValues={editingMatch}
            loading={loading}
            onCancel={() => setEditingMatch(null)}
            onSubmit={handleUpdate}
            referees={referees}
            submitLabel={t("save")}
          />
        </section>
      ) : null}
    </Shell>
  );
}
