import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <p className={styles.main}>© {new Date().getFullYear()} Sudeep Sharma. All rights reserved.</p>
                <p className={styles.sub}>Built with React | Data & Software Engineer</p>
            </div>
        </footer>
    );
}
