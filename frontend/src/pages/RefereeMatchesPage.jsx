import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import MatchCard from "../components/MatchCard.jsx";
import Shell from "../components/Shell.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getMatches } from "../services/api.js";

function isAssignedToReferee(match, email) {
    return (match.referees || []).some((referee) => referee.email === email);
}

export default function RefereeMatchesPage() {
    const auth = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [matches, setMatches] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        getMatches()
            .then((response) => {
                const filteredMatches = (response.matches || []).filter((match) =>
                    isAssignedToReferee(match, auth.user?.email),
                );
                setMatches(filteredMatches);
            })
            .catch((requestError) => {
                setError(requestError.message);
            });
    }, [auth.user?.email]);

    const visibleMatches = matches.filter((match) => {
        if (!selectedDate) {
            return true;
        }

        return String(match.date).slice(0, 10) === selectedDate;
    });

    return (
        <Shell title={t("myMatches")}>
            <div className="toolbar-row">
                <label>
                    {t("matchDate")}
                    <input onChange={(event) => setSelectedDate(event.target.value)} type="date" value={selectedDate} />
                </label>
                <Link className="secondary-button link-button" to="/my-profile">
                    {t("myProfile")}
                </Link>
            </div>

            {error ? <p className="error-text">{error}</p> : null}

            <div className="stack-list">
                {visibleMatches.length ? (
                    visibleMatches.map((match) => (
                        <MatchCard
                            key={match.id || match._id}
                            match={match}
                            onResult={() => navigate(`/submit-result/${match.id || match._id}`)}
                            showActions
                        />
                    ))
                ) : (
                    <p className="muted-text">{t("noMatches")}</p>
                )}
            </div>
        </Shell>
    );
}