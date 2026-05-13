import { useLanguage } from "../../context/LanguageContext.jsx";

import "./Footer.css";

export default function Footer() {
    const { t } = useLanguage();
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <p className="site-footer__line">
                © {year} {t("appName")} — {t("footerRights")}
            </p>
        </footer>
    );
}
