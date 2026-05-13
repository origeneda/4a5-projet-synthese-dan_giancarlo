import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MatchCard from "../../components/matchCard/MatchCard.jsx";
import Shell from "../../Containers/Shell.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getMatches } from "../../services/api.js";

function sameDay(dateValue, selectedDate) {
  if (!selectedDate) {
    return true;
  }

  return String(dateValue).slice(0, 10) === selectedDate;
}

export default function HomePage() {
  const { t } = useLanguage();
  const [matches, setMatches] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getMatches()
      .then((response) => {
        setMatches(response.matches || []);
      })
      .catch((requestError) => {
        setError(requestError.message);
      });
  }, []);

  const filteredMatches = matches.filter((match) =>
    sameDay(match.date, selectedDate),
  );

  return (
    <Shell subtitle={t("publicInfo")} title={t("nextMatches")}>
      <div className="toolbar-row">
        <label>
          {t("matchDate")}
          <input
            onChange={(event) => setSelectedDate(event.target.value)}
            type="date"
            value={selectedDate}
          />
        </label>
        <div className="toolbar-actions">
          <Link className="primary-button link-button" to="/login">
            {t("login")}
          </Link>
        </div>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="stack-list">
        {filteredMatches.length ? (
          filteredMatches.map((match) => (
            <MatchCard key={match.id || match._id} match={match} />
          ))
        ) : (
          <p className="muted-text">{t("noMatches")}</p>
        )}
      </div>
    </Shell>
  );
}
