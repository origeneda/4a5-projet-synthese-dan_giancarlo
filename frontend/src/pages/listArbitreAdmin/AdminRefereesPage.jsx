import { useEffect, useState } from "react";

import RefereeForm from "../../components/RefereeForm.jsx";
import Shell from "../../components/Shell.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  deleteReferee,
  getReferees,
  updateReferee,
} from "../../services/api.js";

export default function AdminRefereesPage() {
  const auth = useAuth();
  const { t } = useLanguage();
  const [referees, setReferees] = useState([]);
  const [editingReferee, setEditingReferee] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const response = await getReferees();
      setReferees(response.referees || []);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (referee) => {
    setError("");

    try {
      await deleteReferee(referee.id || referee._id, auth.token);
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleUpdate = async (payload) => {
    setLoading(true);
    setError("");

    try {
      await updateReferee(
        editingReferee.id || editingReferee._id,
        payload,
        auth.token,
      );
      setEditingReferee(null);
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell title={t("adminReferees")}>
      {error ? <p className="error-text">{error}</p> : null}

      <div className="stack-list">
        {referees.length ? (
          referees.map((referee) => (
            <article className="referee-card" key={referee.id || referee._id}>
              <div>
                <h3>{referee.name}</h3>
                <p>
                  <strong>{t("level")}:</strong> {referee.level || "-"}
                </p>
                <p>
                  <strong>{t("region")}:</strong> {referee.region || "-"}
                </p>
                <p>
                  <strong>{t("email")}:</strong> {referee.email}
                </p>
              </div>
              <div className="action-column">
                <button
                  className="secondary-button"
                  onClick={() => setEditingReferee(referee)}
                  type="button"
                >
                  {t("update")}
                </button>
                <button
                  className="danger-button"
                  onClick={() => handleDelete(referee)}
                  type="button"
                >
                  {t("remove")}
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className="muted-text">{t("noReferees")}</p>
        )}
      </div>

      {editingReferee ? (
        <section className="panel-block">
          <h2>{t("update")}</h2>
          <RefereeForm
            initialValues={editingReferee}
            loading={loading}
            onCancel={() => setEditingReferee(null)}
            onSubmit={handleUpdate}
            submitLabel={t("save")}
          />
        </section>
      ) : null}
    </Shell>
  );
}
