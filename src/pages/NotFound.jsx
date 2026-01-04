import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import Seo from "../components/Seo.jsx";
import shell from "./PageShell.module.css";
import styles from "./NotFound.module.css";

const variants = {
  page: {
    title: "404 — Page not found",
    message: "The page you are looking for does not exist or has moved.",
    actions: [
      { to: "/", label: "Go home", primary: true },
      { to: "/projects", label: "View projects" },
      { to: "/contact", label: "Contact" },
    ],
  },
  project: {
    title: "Project not found",
    message: "That project does not exist or is no longer available.",
    actions: [
      { to: "/projects", label: "Back to projects", primary: true },
      { to: "/", label: "Go home" },
    ],
  },
};

export default function NotFound({ variant = "page" }) {
  const content = variants[variant] ?? variants.page;

  return (
    <div className={shell.page}>
      <Seo title={content.title} description={content.message} />
      <section className={styles.page}>
        <Container>
          <div className={styles.card}>
            <p className={styles.eyebrow}>Lost in the stack</p>
            <h1 className={styles.h1}>{content.title}</h1>
            <p className={styles.message}>{content.message}</p>
            <div className={styles.actions}>
              {content.actions.map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className={action.primary ? styles.actionPrimary : styles.action}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
