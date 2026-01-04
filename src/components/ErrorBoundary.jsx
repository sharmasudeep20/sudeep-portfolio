import { Component } from "react";
import { Link } from "react-router-dom";
import Container from "./Container.jsx";
import shell from "../pages/PageShell.module.css";
import styles from "./ErrorBoundary.module.css";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unexpected UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={shell.page}>
          <section className={styles.page}>
            <Container>
              <div className={styles.card}>
                <p className={styles.eyebrow}>Something went wrong</p>
                <h1 className={styles.h1}>We hit an unexpected error</h1>
                <p className={styles.message}>
                  Try reloading the page or head back home. If this keeps happening,
                  let me know and I will fix it quickly.
                </p>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.actionPrimary}
                    onClick={() => window.location.reload()}
                  >
                    Reload
                  </button>
                  <Link className={styles.action} to="/">
                    Go home
                  </Link>
                </div>
              </div>
            </Container>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}
