import { Link } from "react-router-dom";

import Shell from "../components/Shell.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function NotFoundPage() {
    const { t } = useLanguage();

    return (
        <Shell title="404">
            <p className="muted-text">Page introuvable.</p>
            <Link className="primary-button link-button" to="/">
                {t("home")}
            </Link>
        </Shell>
    );
}