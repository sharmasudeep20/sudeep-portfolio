import { useEffect, useMemo, useState } from "react";
import Container from "../components/Container.jsx";
import Seo from "../components/Seo.jsx";
import styles from "./Home.module.css";
import shell from "./PageShell.module.css";
import { ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import profileImg from "../assets/profile.png";
import { experience } from "../data/dummyData";
import { Link } from "react-router-dom";

/* =========================
   Duration helpers
========================= */
const MONTHS = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

function parseMonthYear(str) {
  if (!str) return null;
  const s = String(str).trim();

  if (s.toLowerCase() === "present") {
    const now = new Date();
    return { y: now.getFullYear(), m: now.getMonth() };
  }

  const parts = s.split(/\s+/);
  if (parts.length < 2) return null;

  const month = MONTHS[parts[0].toLowerCase()];
  const year = Number(parts[1]);

  if (month === undefined || !Number.isFinite(year)) return null;
  return { y: year, m: month };
}

function monthsBetweenInclusive(start, end) {
  const s = parseMonthYear(start);
  const e = parseMonthYear(end);
  if (!s || !e) return NaN;
  return (e.y - s.y) * 12 + (e.m - s.m) + 1;
}

function formatDuration(roles) {
  if (!roles?.length) return "";
  const first = roles[0];
  const last = roles[roles.length - 1];
  const total = monthsBetweenInclusive(first.start, last.end);
  if (!Number.isFinite(total) || total <= 0) return "";

  const y = Math.floor(total / 12);
  const m = total % 12;
  if (y && m) return `${y}y ${m}m`;
  if (y) return `${y} yrs`;
  return `${m} mos`;
}

export default function Home() {
  /* Hero rotating text */
  const rotating = useMemo(
    () => ["Data Pipelines", "APIs", "Cloud", "Analytics", "Automation"],
    []
  );
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("in");

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

  /* Highlights toggle */
  const [openHighlights, setOpenHighlights] = useState({});
  const toggleHighlights = (id) =>
    setOpenHighlights((p) => ({ ...p, [id]: !p[id] }));

  const categories = [
    {
      title: "Database and Data Integration",
      skills: [
        "SQL",
        "Microsoft SQL Server",
        "SQL Server Integration Services (SSIS)",
        "API & Data Integrations",
        "REST APIs",
      ],
    },
    {
      title: "Data Architecture & Modelling",
      skills: ["Data Warehousing", "Schema Design", "Data Modelling"],
    },
    {
      title: "Business Intelligence & Analytics",
      skills: [
        "Power BI (DAX, Data Modelling, Enterprise Dashboards)",
        "Google Analytics",
        "SPSS",
      ],
    },
    {
      title: "Cloud & Data Platforms",
      skills: ["Microsoft Azure", "Microsoft Fabric", "AWS", "Google Cloud"],
    },
    {
      title: "Programming and Scripting",
      skills: ["Python", "Java", "C#", "Shell", "Bash"],
    },
    {
      title: "Version Control & Collaboration",
      skills: ["Git", "GitHub", "Bitbucket", "SVN"],
    },
  ];

  return (
    <div className={shell.page}>
      <Seo title="Home" path="/" />

      {/* HERO */}
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
                >
                  {rotating[idx]}
                </span>
              </p>

              <p className={styles.lead}>
                With 6 years of experience across healthcare, and not-for-profit domains, working on data pipelines,
                analytics platforms, and cloud-based reporting systems.
                Focused on building scalable, reliable data solutions that improve data quality and support accurate reporting.
              </p>

              <div className={styles.ctas}>
                <Link to="/projects" className={styles.primary}>
                  View Projects
                </Link>
                <Link to="/contact" className={styles.secondary}>
                  Get in Touch
                </Link>
              </div>
            </div>

            <div className={styles.heroImageWrap}>
              <div className={styles.heroBgBlob} aria-hidden />
              <div className={styles.heroDots} aria-hidden />
              <div className={styles.heroImageMask}>
                <img src={profileImg} alt="Sudeep Sharma" className={styles.heroImgMasked} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SKILLS */}
      <section className={styles.sectionWhite}>
        <Container wide>
          <h2 className={styles.h2}>Technologies I’ve worked with</h2>
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

      {/* EXPERIENCE */}
      <section className={styles.expSection}>
        <Container wide>
          <h2 className={styles.h2}>Experience</h2>

          <div className={styles.expGrid}>
            {experience.map((c) => {
              const expKey = `${c.company}-${c.roles?.[0]?.start ?? ""}`;

              return (
                <article key={expKey} className={styles.expCard}>
                  <div className={styles.expHeader}>
                    <div>
                      <h3 className={styles.companyName}>{c.company}</h3>
                      <p className={styles.companyMeta}>
                        {c.location}
                        <span className={styles.sep}>•</span>
                        {c.roles.length} roles
                      </p>
                    </div>

                    <div className={styles.duration}>
                      {c.variant === "break"
                        ? "Career break"
                        : formatDuration(c.roles)}
                    </div>
                  </div>

                  {c.summary && (
                    <p className={styles.companySummary}>{c.summary}</p>
                  )}

                  <ul className={styles.roleList}>
                    {c.roles.map((r, i) => (
                      <li key={`${expKey}-${i}`} className={styles.roleItem}>
                        <span className={styles.dot} />
                        <div className={styles.roleContent}>
                          <div className={styles.roleTop}>
                            <span className={styles.roleTitle}>{r.title}</span>
                            {r.current && (
                              <span className={styles.current}>Current</span>
                            )}
                          </div>
                          <div className={styles.roleDate}>
                            {r.start} — {r.end}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {c.highlights?.length > 0 && (
                    <div className={styles.highlightsWrap}>
                      <button
                        className={styles.expandBtn}
                        onClick={() => toggleHighlights(expKey)}
                      >
                        <span>
                          {openHighlights[expKey]
                            ? "Show less"
                            : "Show more"}
                        </span>
                        {openHighlights[expKey] ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>

                      {openHighlights[expKey] && (
                        <div className={styles.highlightsInner}>
                          <div className={styles.highlightsTitle}>
                            Key highlights
                          </div>
                          <ul className={styles.highlightsList}>
                            {c.highlights.map((h) => (
                              <li key={h} className={styles.highlightsItem}>
                                <ChevronRight size={16} />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* EDUCATION */}
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
