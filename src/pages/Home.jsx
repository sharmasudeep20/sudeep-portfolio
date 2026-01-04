import { useEffect, useMemo, useState } from "react";
import Container from "../components/Container.jsx";
import Seo from "../components/Seo.jsx";
import styles from "./Home.module.css";
import shell from "./PageShell.module.css";
import { ChevronRight } from "lucide-react";
import profileImg from "../assets/profile.png";
import { experience } from "../data/dummyData";
import { Link } from "react-router-dom";

export default function Home() {
    const rotating = useMemo(
        () => ["Data Pipelines", "APIs", "Cloud", "Analytics", "Automation"],
        []
    );
    const [idx, setIdx] = useState(0);
    const [phase, setPhase] = useState("in"); // "in" | "out"

    useEffect(() => {
        const interval = setInterval(() => {
            setPhase("out");
            setTimeout(() => {
                setIdx((p) => (p + 1) % rotating.length);
                setPhase("in");
            }, 220);
        }, 2200);

        return () => clearInterval(interval);
    }, [rotating.length]);

    const categories = [
        { title: "Database and Data Integration", skills: ["SQL", "Microsoft SQL Server", "SQL Server Integration Services(SSIS)", "API & Data Integrations", "REST APIs"] },
        { title: "Data Architecture & Modelling", skills: ["Data Warehousing", "Schema Design", "Data Modelling"] },
        { title: "Business Intelligence & Analytics", skills: ["Power BI(DAX, Data Modelling, Enterprise Dashboards)", "Google Analytics", "SPSS"] },
        { title: "Cloud & Data Platforms", skills: ["Microsoft Azure", "Microsoft Fabric", "AWS", "Google Cloud"] },
        { title: "Programming and Scripting", skills: ["Python", "Java", "C#", "Shell", "Bash"] },
        { title: "Version Control & Collaboration", skills: ["Git", "GitHub", "Bitbucket", "SVN"] },
    ];

    return (
        <div className={shell.page}>
            <Seo title="Home" path="/" />
            <section className={styles.hero}>
                <Container wide>
                    <div className={styles.heroGrid}>
                        <div>
                            <h1 className={styles.h1}>
                                Hi, I’m <span className={styles.gradientText}>Sudeep Sharma</span>
                            </h1>

                            <p className={styles.role}>
                                Data & Software Engineer —{" "}
                                <span
                                    className={phase === "in" ? styles.rotateIn : styles.rotateOut}
                                    aria-live="polite"
                                >
                                    {rotating[idx]}
                                </span>
                            </p>

                            <p className={styles.lead}>
                                With 6 years of experience in building scalable data solutions and software applications.
                                Passionate about leveraging technology to solve complex problems and drive innovation.
                            </p>

                            <div className={styles.ctas}>
                                <Link className={styles.primary} to="/projects">View Projects</Link>
                                <Link className={styles.secondary} to="/contact">Get in Touch</Link>
                            </div>
                        </div>

                        <div className={styles.heroImageWrap}>
                            <div className={styles.heroBgBlob} aria-hidden="true" />
                            <div className={styles.heroDots} aria-hidden="true" />

                            <div className={styles.heroImageMask} aria-hidden="true">
                                <img src={profileImg} alt="" className={styles.heroImgMasked} />
                            </div>


                        </div>
                    </div>
                </Container>
            </section>

            {/* Skills */}
            <section className={styles.sectionWhite}>
                <Container wide>
                    <h2 className={styles.h2}>Technical Expertise</h2>
                    <div className={styles.skillsGrid}>
                        {categories.map((c) => (
                            <div key={c.title} className={styles.skillCard}>
                                <h3 className={styles.cardTitle}>{c.title}</h3>
                                <ul className={styles.list}>
                                    {c.skills.map((s) => (
                                        <li key={s} className={styles.li}>
                                            <ChevronRight size={16} className={styles.chev} />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>


            <section className={styles.sectionSoft}>
                <Container wide>
                    <h2 className={styles.h2}>Experience</h2>
                    <p className={styles.subText}>
                        6 years of professional experience in data engineering and software development
                    </p>

                    <div className={styles.expStack}>
                        {experience.map((exp) => (
                            <div key={exp.id} className={styles.expCard}>
                                <div className={styles.expTop}>
                                    <div>
                                        <h3 className={styles.expTitle}>{exp.title}</h3>
                                        <p className={styles.expCompany}>{exp.company}</p>
                                    </div>
                                    <p className={styles.expPeriod}>{exp.period}</p>
                                </div>

                                <ul className={styles.expList}>
                                    {exp.responsibilities.map((item) => (
                                        <li key={item} className={styles.expItem}>
                                            <span className={styles.expBullet}>›</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>


            {/* Education */}
            <section className={styles.sectionSoft}>
                <Container wide>
                    <h2 className={styles.h2}>Education</h2>
                    <div className={styles.eduGrid}>
                        <div className={styles.eduCard}>
                            <h3 className={styles.eduTitle}>Master of Information Technology</h3>
                            <p className={styles.eduSchool}>Central Queensland University</p>
                            <p>Sydney, Australia</p>

                        </div>

                        <div className={styles.eduCard}>
                            <h3 className={styles.eduTitle}>Bachelor of Engineering</h3>
                            <p className={styles.eduSchool}>Electronics and Communication Engineering</p>
                            <p className={styles.eduSchool}>Khwopa Engineering College</p>
                            <p>Bhaktapur, Nepal</p>
                        </div>
                    </div>
                </Container>
            </section>




        </div>
    );
}
