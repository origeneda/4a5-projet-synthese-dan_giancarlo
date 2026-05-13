import { useEffect, useState } from "react";

import { useLanguage } from "../../context/LanguageContext.jsx";

const defaultState = {
  name: "",
  email: "",
  password: "",
  age: "",
  level: "Provincial",
  region: "",
};

export default function RefereeForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
  loading,
  readOnlyEmail = false,
  hidePassword = false,
}) {
  const { t } = useLanguage();
  const [formState, setFormState] = useState(defaultState);

  useEffect(() => {
    if (!initialValues) {
      setFormState(defaultState);
      return;
    }

    setFormState({
      name: initialValues.name || "",
      email: initialValues.email || "",
      password: "",
      age: initialValues.age || "",
      level: initialValues.level || "Provincial",
      region: initialValues.region || "",
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
    const payload = {
      name: formState.name,
      email: formState.email,
      age: Number(formState.age),
      level: formState.level,
      region: formState.region,
    };

    if (!hidePassword || formState.password) {
      payload.password = formState.password;
    }

    onSubmit(payload);
  };

  return (
    <form className="simple-form" onSubmit={handleSubmit}>
      <div className="form-grid two-columns">
        <label>
          {t("name")}
          <input
            name="name"
            onChange={handleChange}
            required
            value={formState.name}
          />
        </label>
        <label>
          {t("age")}
          <input
            name="age"
            onChange={handleChange}
            type="number"
            value={formState.age}
          />
        </label>
        <label>
          {t("level")}
          <select name="level" onChange={handleChange} value={formState.level}>
            <option value="Provincial">Provincial</option>
            <option value="R\u00E9gional">Regional</option>
            <option value="National">National</option>
          </select>
        </label>
        <label>
          {t("region")}
          <input
            name="region"
            onChange={handleChange}
            value={formState.region}
          />
        </label>
        <label>
          {t("email")}
          <input
            name="email"
            onChange={handleChange}
            readOnly={readOnlyEmail}
            required
            value={formState.email}
          />
        </label>
        {!hidePassword ? (
          <label>
            {t("password")}
            <input
              minLength="6"
              name="password"
              onChange={handleChange}
              required
              type="password"
              value={formState.password}
            />
          </label>
        ) : null}
      </div>

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
