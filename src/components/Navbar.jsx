// src/components/Navbar.jsx
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Linkedin } from "lucide-react";
import styles from "./Navbar.module.css";
import { contactInfo } from "../data/dummyData";

const navItems = [
    { to: "/", label: "Home", end: true },
    { to: "/projects", label: "Projects" },
    { to: "/contact", label: "Contact" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navClass = useMemo(
        () => (scrolled ? `${styles.nav} ${styles.navScrolled}` : styles.nav),
        [scrolled]
    );

    return (
        <nav className={navClass}>
            <div className={styles.inner}>
                <NavLink to="/" className={styles.brand} aria-label="Go to home">
                    <span className={styles.logoText}>
                        {'<Sudeep /> | Builds'}
                    </span>
                </NavLink>


                <div className={styles.desktop}>
                    <div className={styles.navLinks}>
                        {navItems.map((it) => (
                            <NavLink
                                key={it.to}
                                to={it.to}
                                end={it.end}
                                className={({ isActive }) =>
                                    isActive ? `${styles.link} ${styles.active}` : styles.link
                                }
                            >
                                {it.label}
                            </NavLink>
                        ))}
                    </div>

                    <div className={styles.iconGroup}>
                        <a
                            className={styles.iconBtn}
                            href={contactInfo.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn"
                        >
                            <Linkedin size={18} />
                        </a>
                    </div>
                </div>

                <button
                    className={styles.mobileBtn}
                    onClick={() => setOpen((v) => !v)}
                    aria-label={open ? "Close menu" : "Open menu"}
                >
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {
                open && (
                    <div className={styles.mobilePanel}>
                        <div className={styles.mobileCard}>
                            {navItems.map((it) => (
                                <NavLink
                                    key={it.to}
                                    to={it.to}
                                    end={it.end}
                                    className={({ isActive }) =>
                                        isActive ? `${styles.mobileLink} ${styles.mobileActive}` : styles.mobileLink
                                    }
                                    onClick={() => setOpen(false)}
                                >
                                    <span>{it.label}</span>
                                    <span className={styles.chev} aria-hidden="true">›</span>
                                </NavLink>
                            ))}

                            <a
                                className={styles.mobileSocial}
                                href={contactInfo.linkedin}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Linkedin size={18} />
                                LinkedIn
                            </a>
                        </div>
                    </div>
                )
            }
        </nav >
    );
}
