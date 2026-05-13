import { useEffect, useState } from "react";

import { useLanguage } from "../../context/LanguageContext.jsx";

const defaultState = {
  teamA: "",
  teamB: "",
  date: "",
  location: "",
  status: "\u00E0 venir",
  scoreA: 0,
  scoreB: 0,
  refereeId: "",
};

function toDateValue(value) {
  if (!value) {
    return "";
  }

  return String(value).slice(0, 10);
}

export default function MatchForm({
  initialValues,
  referees,
  submitLabel,
  onSubmit,
  onCancel,
  loading,
  includeScores = false,
}) {
  const { t } = useLanguage();
  const [formState, setFormState] = useState(defaultState);

  useEffect(() => {
    if (!initialValues) {
      setFormState(defaultState);
      return;
    }

    setFormState({
      teamA: initialValues.teamA || "",
      teamB: initialValues.teamB || "",
      date: toDateValue(initialValues.date),
      location: initialValues.location || "",
      status: initialValues.status || "\u00E0 venir",
      scoreA: initialValues.scoreA ?? 0,
      scoreB: initialValues.scoreB ?? 0,
      refereeId: "",
    });
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      teamA: formState.teamA,
      teamB: formState.teamB,
      date: formState.date,
      location: formState.location,
      status: formState.status,
      scoreA: Number(formState.scoreA),
      scoreB: Number(formState.scoreB),
      refereeId: formState.refereeId,
    });
  };

  return (
    <form className="simple-form" onSubmit={handleSubmit}>
      <div className="form-grid two-columns">
        <label>
          {t("teamA")}
          <input
            name="teamA"
            onChange={handleChange}
            required
            value={formState.teamA}
          />
        </label>
        <label>
          {t("teamB")}
          <input
            name="teamB"
            onChange={handleChange}
            required
            value={formState.teamB}
          />
        </label>
        <label>
          {t("matchDate")}
          <input
            name="date"
            onChange={handleChange}
            required
            type="date"
            value={formState.date}
          />
        </label>
        <label>
          {t("location")}
          <input
            name="location"
            onChange={handleChange}
            value={formState.location}
          />
        </label>
      </div>

      {includeScores ? (
        <div className="form-grid two-columns">
          <label>
            {t("scoreA")}
            <input
              min="0"
              name="scoreA"
              onChange={handleChange}
              type="number"
              value={formState.scoreA}
            />
          </label>
          <label>
            {t("scoreB")}
            <input
              min="0"
              name="scoreB"
              onChange={handleChange}
              type="number"
              value={formState.scoreB}
            />
          </label>
        </div>
      ) : null}

      <label>
        {t("referee")}
        <select
          name="refereeId"
          onChange={handleChange}
          value={formState.refereeId}
        >
          <option value="">{t("chooseReferee")}</option>
          {referees.map((referee) => (
            <option
              key={referee.id || referee._id}
              value={referee.id || referee._id}
            >
              {referee.name}
            </option>
          ))}
        </select>
      </label>

      <div className="action-row">
        <button className="primary-button" disabled={loading} type="submit">
          {submitLabel}
        </button>
        {onCancel ? (
          <button className="secondary-button" onClick={onCancel} type="button">
            {t("cancel")}
          </button>
        ) : null}
      </div>
    </form>
  );
}
