import styles from "./Container.module.css";

export default function Container({ children, wide = false }) {
    return <div className={wide ? `${styles.container} ${styles.wide}` : styles.container}>{children}</div>;
}
