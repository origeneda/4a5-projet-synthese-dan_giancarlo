import { useLanguage } from "../../context/LanguageContext.jsx";

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString();
}

export default function MatchCard({
  match,
  showActions = false,
  onEdit,
  onDelete,
  onResult,
}) {
  const { t } = useLanguage();
  const refereeNames = (match.referees || [])
    .map((referee) => referee.name)
    .join(", ");

  return (
    <article className="match-card">
      <div className="team-row">
        <div className="team-circle">
          <span>{match.teamA}</span>
        </div>
        <div className="score-block">
          <strong>
            {match.scoreA} VS {match.scoreB}
          </strong>
        </div>
        <div className="team-circle">
          <span>{match.teamB}</span>
        </div>
      </div>

      <div className="match-meta">
        <p>
          <strong>{t("matchDate")}:</strong> {formatDate(match.date)}
        </p>
        <p>
          <strong>{t("location")}:</strong> {match.location || "-"}
        </p>
        <p>
          <strong>{t("referee")}:</strong> {refereeNames || "-"}
        </p>
      </div>

      {showActions ? (
        <div className="action-row">
          {onEdit ? (
            <button
              className="secondary-button"
              onClick={() => onEdit(match)}
              type="button"
            >
              {t("update")}
            </button>
          ) : null}
          {onDelete ? (
            <button
              className="danger-button"
              onClick={() => onDelete(match)}
              type="button"
            >
              {t("remove")}
            </button>
          ) : null}
          {onResult ? (
            <button
              className="primary-button"
              onClick={() => onResult(match)}
              type="button"
            >
              {t("result")}
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
