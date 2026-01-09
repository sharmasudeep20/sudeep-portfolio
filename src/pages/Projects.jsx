// src/pages/Projects.jsx
import { useEffect, useMemo, useState } from "react";
import Container from "../components/Container.jsx";
import Seo from "../components/Seo.jsx";
import shell from "./PageShell.module.css";
import styles from "./Projects.module.css";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  ChevronRight as ChevronRightSmall,
} from "lucide-react";
import { sanity } from "../lib/sanityClient";
import { urlFor } from "../lib/sanityImage";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "../lib/analytics.js";
import projectsImage from "../assets/projects.jpeg";

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

const PER_PAGE = 3;

const truncate = (text, max = 150) =>
  text && text.length > max ? text.slice(0, max).trimEnd() + "…" : text;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    setLoading(true);

    sanity
      .fetch(PROJECTS_QUERY)
      .then((data) => {
        if (!alive) return;
        setProjects(Array.isArray(data) ? data : []);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const types = useMemo(() => {
    const unique = new Set();
    projects.forEach((p) => p?.type && unique.add(p.type));
    return Array.from(unique).sort();
  }, [projects]);

  const hasFilters = query.trim().length > 0 || typeFilter !== "all";

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (typeFilter !== "all" && p?.type !== typeFilter) return false;
      if (!trimmed) return true;

      const haystack = [p.title, p.summary, p.type, String(p.year || ""), ...(p.tech || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(trimmed);
    });
  }, [projects, query, typeFilter]);

  const totalCount = projects.length;
  const filteredCount = filtered.length;

  const totalPages = Math.ceil(filteredCount / PER_PAGE);
  const hasPages = filteredCount > 0;

  useEffect(() => {
    if (!hasPages) {
      setPage(0);
      return;
    }
    setPage((p) => Math.min(p, totalPages - 1));
  }, [hasPages, totalPages]);

  useEffect(() => {
    setPage(0);
  }, [query, typeFilter]);

  const visible = useMemo(() => {
    if (!hasPages) return [];
    const start = page * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [hasPages, filtered, page]);

  const startIndex = hasPages ? page * PER_PAGE + 1 : 0;
  const endIndex = hasPages ? Math.min((page + 1) * PER_PAGE, filteredCount) : 0;

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  const onCarouselKeyDown = (e) => {
    if (!hasPages) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  const clearAll = () => {
    setQuery("");
    setTypeFilter("all");
  };

  const handleCardClick = (project) => {
    const slug = project?.slug?.current;
    if (!slug) return;
    trackEvent("project_click", { label: project.title, slug });
    navigate(`/projects/${slug}`);
  };

  const handleCardKeyDown = (event, project) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick(project);
    }
  };

  const typeClassFor = (type = "") => {
    const value = (type || "").toLowerCase();
    if (value.includes("cloud")) return styles.typeCloud;
    if (value.includes("data")) return styles.typeData;
    if (value.includes("analytics") || value.includes("bi")) return styles.typeAnalytics;
    if (value.includes("automation") || value.includes("api")) return styles.typeAutomation;
    return styles.typeDefault;
  };

  return (
    <div className={shell.page}>
      <Seo
        title="Projects"
        description="A Selection of Projects I’ve Worked On"
        path="/projects"
      />

      {/* HERO: consistent with Home (theme background + CTA styling) */}
      <section className={styles.hero}>
        <Container wide className={styles.heroInner}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <p className={styles.eyebrow}>Featured work</p>
              <h1 className={styles.h1}>Projects</h1>
              <p className={styles.sub}>
                A curated selection of projects across data engineering, software development, and cloud technologies.
              </p>

              <div className={styles.ctas}>
                <a className={styles.primary} href="#project-filters">
                  Explore projects
                </a>
                <a className={styles.secondary} href="/contact">
                  Contact me
                </a>
              </div>
            </div>
          </div>
        </Container>

        {/* image sits under navbar on the right */}
        <div className={styles.heroImageWrap} aria-hidden="true">
          <img className={styles.heroImage} src={projectsImage} alt="" loading="eager" />
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className={styles.page}>
        <Container wide>
          {/* Sticky Filters */}
          <div className={styles.stickyWrap}>
            <div className={styles.filters} id="project-filters">
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel} htmlFor="projectType">
                  Filter by type
                </label>
                <select
                  id="projectType"
                  className={styles.filter}
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All types</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.searchWrap}>
                <label className={styles.searchLabel} htmlFor="projectSearch">
                  Search
                </label>
                <div className={styles.searchField}>
                  <Search size={16} className={styles.searchIcon} />
                  <input
                    id="projectSearch"
                    className={styles.search}
                    type="search"
                    placeholder="Search projects, tech, keywords…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="button"
                className={styles.clear}
                onClick={clearAll}
                disabled={!hasFilters}
                aria-disabled={!hasFilters}
              >
                Clear
              </button>
            </div>

            <div className={styles.resultsBar} aria-live="polite">
              <div className={styles.resultsCount}>
                {loading ? "Loading projects…" : `Showing ${filteredCount} of ${totalCount} projects`}
              </div>

              {hasPages ? (
                <div className={styles.range}>
                  {startIndex}–{endIndex} of {filteredCount}
                </div>
              ) : null}
            </div>

            {hasFilters && (
              <div className={styles.activeFilters}>
                {query.trim() ? <span className={styles.filterChip}>“{query.trim()}”</span> : null}
                {typeFilter !== "all" ? <span className={styles.filterChip}>{typeFilter}</span> : null}
              </div>
            )}
          </div>

          {/* Carousel */}
          <div
            className={styles.carousel}
            tabIndex={0}
            onKeyDown={onCarouselKeyDown}
            aria-label="Projects carousel. Use left and right arrow keys to change page."
          >
            <button
              className={styles.navBtn}
              onClick={goPrev}
              disabled={!hasPages || page === 0}
              aria-label="Previous projects"
              type="button"
            >
              <ChevronLeft size={20} />
            </button>

            <div className={styles.track}>
              {loading ? (
                <>
                  <div className={styles.skeletonRow} />
                  <div className={styles.skeletonRow} />
                  <div className={styles.skeletonRow} />
                </>
              ) : !hasPages ? (
                <div className={styles.empty}>
                  <div className={styles.emptyTitle}>{hasFilters ? "No results" : "No projects yet"}</div>
                  <div className={styles.emptyText}>
                    {hasFilters
                      ? "Try a different keyword, change the type filter, or reset everything."
                      : "Add projects in your CMS to show them here."}
                  </div>

                  {hasFilters && (
                    <div className={styles.emptyActions}>
                      <button type="button" className={styles.emptyBtn} onClick={clearAll}>
                        Reset filters
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                visible.map((p) => {
                  const thumb = p.coverImage
                    ? urlFor(p.coverImage).width(160).height(160).fit("crop").auto("format").url()
                    : "";
                  const isClickable = Boolean(p.slug?.current);

                  return (
                    <article
                      key={p._id}
                      className={isClickable ? `${styles.row} ${styles.rowClickable}` : styles.row}
                      tabIndex={isClickable ? 0 : -1}
                      role={isClickable ? "button" : undefined}
                      onClick={() => isClickable && handleCardClick(p)}
                      onKeyDown={(event) => isClickable && handleCardKeyDown(event, p)}
                      aria-label={isClickable ? `View details for ${p.title}` : undefined}
                    >
                      <div className={styles.rowMedia}>
                        {thumb ? (
                          <img className={styles.thumb} src={thumb} alt={p.title} loading="lazy" />
                        ) : (
                          <div className={styles.thumbFallback} aria-hidden="true" />
                        )}
                      </div>

                      <div className={styles.rowBody}>
                        <div className={styles.rowHeader}>
                          <div className={styles.titleBlock}>
                            <h2 className={styles.title}>{p.title}</h2>
                            <div className={styles.meta}>
                              {p.year ? <span className={styles.year}>{p.year}</span> : null}
                              {p.type ? (
                                <span className={`${styles.typeChip} ${typeClassFor(p.type)}`}>
                                  {p.type}
                                </span>
                              ) : null}
                            </div>
                          </div>

                          {isClickable ? (
                            <span className={styles.chev} aria-hidden="true">
                              <ChevronRightSmall size={18} />
                            </span>
                          ) : null}
                        </div>

                        {p.summary ? <p className={styles.desc}>{truncate(p.summary, 170)}</p> : null}

                        {(p.tech || []).length ? (
                          <div className={styles.techRow}>
                            <span className={styles.techLabel}>Tech:</span>
                            <div className={styles.techList} title={(p.tech || []).join(", ")}>
                              {p.tech.slice(0, 10).map((t) => (
                                <span key={t} className={styles.techChip}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        <div className={styles.actions}>
                          {p.link && (
                            <a
                              href={p.link}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.linkSoft}
                              onMouseDown={(event) => event.stopPropagation()}
                              onClick={(event) => {
                                event.stopPropagation();
                                trackEvent("outbound_click", { label: p.title, url: p.link });
                              }}
                            >
                              External <ExternalLink size={14} />
                            </a>
                          )}

                          {isClickable && <span className={styles.linkHint}>View details</span>}
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            <button
              className={styles.navBtn}
              onClick={goNext}
              disabled={!hasPages || page === totalPages - 1}
              aria-label="Next projects"
              type="button"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Pagination (dots) */}
          {hasPages && !loading && (
            <div className={styles.pagination}>
              <div className={styles.pageInfo}>
                Page {page + 1} of {totalPages}
              </div>

              <div className={styles.pageControls} aria-label="Pagination">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={i === page ? styles.pageDotActive : styles.pageDot}
                    onClick={() => setPage(i)}
                    aria-label={`Go to page ${i + 1}`}
                    aria-current={i === page ? "page" : undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
