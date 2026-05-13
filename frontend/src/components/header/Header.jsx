import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";

import "./Header.css";

export default function Header({ title, subtitle }) {
    const auth = useAuth();
    const { language, toggleLanguage, t } = useLanguage();
    const hasPageHeading = Boolean(title || subtitle);

    return (
        <header className="site-header">
            <div className="site-header__navbar">
                <Link className="site-header__app-link" to="/">
                    <span className="site-header__app-mark" aria-hidden="true" />
                    <span className="site-header__app-name">{t("appName")}</span>
                </Link>
                <div className="site-header__actions">
                    <button
                        className="site-header__toolbar-btn"
                        onClick={toggleLanguage}
                        type="button"
                    >
                        {language.toUpperCase()}
                    </button>
                    {auth.isLoggedIn ? (
                        <button
                            className="site-header__toolbar-btn"
                            onClick={auth.logout}
                            type="button"
                        >
                            {t("logout")}
                        </button>
                    ) : null}
                </div>
            </div>

            {hasPageHeading ? (
                <div className="site-header__page">
                    {title ? <h1 className="site-header__page-title">{title}</h1> : null}
                    {subtitle ? <p className="site-header__page-subtitle muted-text">{subtitle}</p> : null}
                </div>
            ) : null}
        </header>
    );
}
