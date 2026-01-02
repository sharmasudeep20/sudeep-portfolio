// src/pages/Projects.jsx
import { useEffect, useMemo, useState } from "react";
import Container from "../components/Container.jsx";
import shell from "./PageShell.module.css";
import styles from "./Projects.module.css";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { sanity } from "../lib/sanityClient";
import { urlFor } from "../lib/sanityImage";
import { Link } from "react-router-dom";

const PROJECTS_QUERY = `
*[_type == "project"] | order(year desc, _createdAt desc) {
  _id,
  title,
  summary,
  year,
  type,
  tech,
  link,
  coverImage,
  slug { current }
}
`;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);

  const PER_PAGE = 3;

  useEffect(() => {
    let alive = true;

    sanity.fetch(PROJECTS_QUERY).then((data) => {
      if (!alive) return;
      setProjects(Array.isArray(data) ? data : []);
    });

    return () => {
      alive = false;
    };
  }, []);

  const totalPages = Math.ceil(projects.length / PER_PAGE);
  const hasPages = totalPages > 0;

  useEffect(() => {
    if (!hasPages) {
      setPage(0);
      return;
    }
    setPage((p) => Math.min(p, totalPages - 1));
  }, [hasPages, totalPages]);

  const visible = useMemo(() => {
    if (!hasPages) return [];
    const start = page * PER_PAGE;
    return projects.slice(start, start + PER_PAGE);
  }, [hasPages, projects, page]);

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => {
    if (!hasPages) return;
    setPage((p) => Math.min(totalPages - 1, p + 1));
  };

  return (
    <div className={shell.page}>
      <section className={styles.page}>
        <Container wide>
          <header className={styles.header}>
            <h1 className={styles.h1}>Projects</h1>
            <p className={styles.sub}>
              A collection of projects showcasing my expertise in data engineering, software development, and cloud technologies.
            </p>
          </header>

          {/* Carousel */}
          <div className={styles.carousel}>
            <button
              className={styles.navBtn}
              onClick={goPrev}
              disabled={!hasPages || page === 0}
              aria-label="Previous projects"
            >
              <ChevronLeft size={22} />
            </button>

            <div className={styles.track}>
              {!hasPages && (
                <div className={styles.empty}>
                  No projects to display yet. Check back soon.
                </div>
              )}
              {visible.map((p) => {
                const img = p.coverImage
                  ? urlFor(p.coverImage)
                      .width(1200)
                      .height(675)
                      .fit("crop")
                      .auto("format")
                      .url()
                  : "";

                return (
                  <article key={p._id} className={styles.card}>
                    <div className={styles.coverFrame}>
                      {img && (
                        <img
                          src={img}
                          alt={p.title}
                          className={styles.coverImg}
                          loading="lazy"
                        />
                      )}
                    </div>

                    <div className={styles.body}>
                      <h2 className={styles.title}>{p.title}</h2>

                      {p.summary && (
                        <p className={styles.desc}>{p.summary}</p>
                      )}

                      <div className={styles.actions}>
                        {p.slug?.current && (
                          <Link
                            to={`/projects/${p.slug.current}`}
                            className={styles.link}
                          >
                            View details
                          </Link>
                        )}

                        {p.link && (
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.linkSoft}
                          >
                            External <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <button
              className={styles.navBtn}
              onClick={goNext}
              disabled={!hasPages || page === totalPages - 1}
              aria-label="Next projects"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Pagination dots */}
          {hasPages && (
            <div className={styles.dots}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={i === page ? styles.dotActive : styles.dot}
                  onClick={() => setPage(i)}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
