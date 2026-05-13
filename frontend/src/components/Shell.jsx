import { NavLink } from "react-router-dom";

import Footer from "./footer/Footer.jsx";
import Header from "./header/Header.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

function getLinks(role, t) {
  if (role === "admin") {
    return [
      { to: "/matches", label: t("adminMatches") },
      { to: "/create-match", label: t("createMatch") },
      { to: "/create-referee", label: t("createReferee") },
      { to: "/referees", label: t("adminReferees") },
    ];
  }

  if (role === "referee") {
    return [
      { to: "/my-matches", label: t("myMatches") },
      { to: "/my-profile", label: t("myProfile") },
    ];
  }

  return [
    { to: "/", label: t("home") },
    { to: "/login", label: t("login") },
  ];
}

export default function Shell({ title, subtitle, children }) {
  const auth = useAuth();
  const { t } = useLanguage();
  const links = getLinks(auth.user?.role, t);

  return (
    <div className="shell">
      <Header subtitle={subtitle} title={title} />

      <div className="page-layout">
        <aside className="sidebar">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
          {auth.isLoggedIn ? (
            <p className="sidebar-user">{auth.user?.email}</p>
          ) : null}
        </aside>

        <main className="content-panel">{children}</main>
      </div>

      <Footer />
    </div>
  );
}
