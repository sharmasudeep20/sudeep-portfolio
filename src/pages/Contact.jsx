import { useEffect, useMemo, useState } from "react";
import Container from "../components/Container.jsx";
import Seo from "../components/Seo.jsx";
import shell from "./PageShell.module.css";
import styles from "./Contact.module.css";
import { Mail, Phone, MapPin, Linkedin, Github, Instagram } from "lucide-react";
import { contactInfo } from "../data/dummyData";
import emailjs from "@emailjs/browser";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_SECONDS = 60; // Cooldown period between submissions

export default function Contact() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [touched, setTouched] = useState({ name: false, email: false, message: false });
    const [status, setStatus] = useState({ type: "idle", message: "" }); // idle | sending | success | error | ratelimited
    const [lastSubmitTime, setLastSubmitTime] = useState(0);
    const [cooldownRemaining, setCooldownRemaining] = useState(0);

    // Update cooldown timer every second
    useEffect(() => {
        if (cooldownRemaining <= 0) return;

        const timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - lastSubmitTime) / 1000);
            const remaining = Math.max(0, RATE_LIMIT_SECONDS - elapsed);
            setCooldownRemaining(remaining);

            if (remaining === 0 && status.type === "ratelimited") {
                setStatus({ type: "idle", message: "" });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldownRemaining, lastSubmitTime, status.type]);

    const errors = useMemo(() => {
        const e = {};
        if (!formData.name.trim()) e.name = "Name is required.";
        if (!formData.email.trim()) e.email = "Email is required.";
        else if (!emailRegex.test(formData.email)) e.email = "Please enter a valid email address.";
        if (!formData.message.trim()) e.message = "Message is required.";
        return e;
    }, [formData]);

    const hasErrors = Object.keys(errors).length > 0;
    const isRateLimited = cooldownRemaining > 0;

    const onChange = (e) => {
        const { id, value } = e.target;
        setFormData((p) => ({ ...p, [id]: value }));
        if (status.type === "error") setStatus({ type: "idle", message: "" });
    };

    const onBlur = (e) => {
        const { id } = e.target;
        setTouched((p) => ({ ...p, [id]: true }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setTouched({ name: true, email: true, message: true });

        // Check rate limit
        if (isRateLimited) {
            setStatus({
                type: "ratelimited",
                message: `Please wait ${cooldownRemaining} seconds before sending another message.`,
            });
            return;
        }

        if (hasErrors) {
            setStatus({ type: "error", message: "Please fix the highlighted fields and try again." });
            return;
        }

        setStatus({ type: "sending", message: "Sending..." });

        try {
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const mainTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const autoReplyTemplateId = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            if (!serviceId || !mainTemplateId || !autoReplyTemplateId || !publicKey) {
                throw new Error("Missing EmailJS environment variables.");
            }

            const payload = {
                from_name: formData.name,
                reply_to: formData.email,
                message: formData.message,
            };

            // 1) Send message to you
            await emailjs.send(serviceId, mainTemplateId, payload, { publicKey });

            // 2) Auto-reply to the sender (do not block success if this fails)
            try {
                await emailjs.send(serviceId, autoReplyTemplateId, payload, { publicKey });
            } catch (autoReplyError) {
                console.warn("EmailJS auto-reply failed:", autoReplyError);
            }

            // Set rate limit timer
            const now = Date.now();
            setLastSubmitTime(now);
            setCooldownRemaining(RATE_LIMIT_SECONDS);

            setStatus({ type: "success", message: "Thanks! Your message has been sent." });
            setFormData({ name: "", email: "", message: "" });
            setTouched({ name: false, email: false, message: false });
        } catch (err) {
            console.error("EmailJS error:", err);
            setStatus({
                type: "error",
                message: "Something went wrong while sending. Please try again later.",
            });
        }
    };

    const inputClass = (key) => {
        const showError = touched[key] && errors[key];
        return showError ? `${styles.input} ${styles.inputError}` : styles.input;
    };

    const textareaClass = () => {
        const showError = touched.message && errors.message;
        return showError ? `${styles.textarea} ${styles.inputError}` : styles.textarea;
    };

    return (
        <div className={shell.page}>
            <Seo
                title="Contact"
                description="Get in touch with Sudeep Sharma for data engineering and software development opportunities."
                path="/contact"
            />
            <section className={styles.page}>
                <Container wide>
                    <header className={styles.header}>
                        <h1 className={styles.h1}>{contactInfo.heading}</h1>
                        <p className={styles.sub}>{contactInfo.subheading}</p>
                    </header>

                    <div className={styles.grid}>
                        {/* Left column */}
                        <div className={styles.left}>
                            <h2 className={styles.h2}>Contact Information</h2>

                            <div className={styles.infoStack}>
                                <div className={styles.infoRow}>
                                    <div className={styles.iconBox}>
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <div className={styles.label}>Email</div>
                                        <a className={styles.valueLink} href={`mailto:${contactInfo.email}`}>
                                            {contactInfo.email}
                                        </a>
                                    </div>
                                </div>

                                <div className={styles.infoRow}>
                                    <div className={styles.iconBox}>
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <div className={styles.label}>Phone</div>
                                        <a
                                            className={styles.valueLink}
                                            href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                                        >
                                            {contactInfo.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className={styles.infoRow}>
                                    <div className={styles.iconBox}>
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <div className={styles.label}>Location</div>
                                        <div className={styles.value}>{contactInfo.location}</div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.connect}>
                                <h3 className={styles.h3}>Connect with me</h3>
                                <div className={styles.socialRow}>
                                    <a
                                        className={styles.socialBtn}
                                        href={contactInfo.linkedin}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="LinkedIn"
                                        title="LinkedIn"
                                    >
                                        <Linkedin size={20} />
                                    </a>
                                    <a
                                        className={styles.socialBtn}
                                        href={contactInfo.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="GitHub"
                                        title="GitHub"
                                    >
                                        <Github size={20} />
                                    </a>

                                    <a
                                        className={styles.socialBtn}
                                        href={contactInfo.instagram}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="Instagram"
                                        title="Instagram"
                                    >
                                        <Instagram size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right column */}
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Send a Message</h2>

                            {status.type !== "idle" && (
                                <div
                                    className={
                                        status.type === "success"
                                            ? `${styles.alert} ${styles.alertSuccess}`
                                            : status.type === "sending"
                                                ? `${styles.alert} ${styles.alertSending}`
                                                : `${styles.alert} ${styles.alertError}`
                                    }
                                    role="status"
                                >
                                    {status.message}
                                </div>
                            )}

                            <form className={styles.form} onSubmit={onSubmit} noValidate>
                                <div className={styles.field}>
                                    <label className={styles.fieldLabel} htmlFor="name">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className={inputClass("name")}
                                        autoComplete="name"
                                    />
                                    {touched.name && errors.name && <div className={styles.help}>{errors.name}</div>}
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.fieldLabel} htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className={inputClass("email")}
                                        autoComplete="email"
                                    />
                                    {touched.email && errors.email && (
                                        <div className={styles.help}>{errors.email}</div>
                                    )}
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.fieldLabel} htmlFor="message">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        value={formData.message}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className={textareaClass()}
                                        rows={7}
                                    />
                                    {touched.message && errors.message && (
                                        <div className={styles.help}>{errors.message}</div>
                                    )}
                                </div>

                                <button className={styles.submit} type="submit" disabled={status.type === "sending" || isRateLimited}>
                                    {status.type === "sending" ? "Sending..." : isRateLimited ? `Wait ${cooldownRemaining}s...` : "Send Message"}
                                </button>
                            </form>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}
