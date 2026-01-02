// src/pages/ProjectDetails.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "../components/Container.jsx";
import shell from "./PageShell.module.css";
import styles from "./ProjectDetails.module.css";
import { sanity } from "../lib/sanityClient";
import { urlFor } from "../lib/sanityImage";
import { PortableText } from "@portabletext/react";
import { ExternalLink } from "lucide-react";

const PROJECT_QUERY = `
*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  slug { current },
  summary,
  year,
  type,
  tech,
  highlights,
  link,
  coverImage,
  description
}
`;

const MORE_PROJECTS_QUERY = `
*[_type == "project" && _id != $id] | order(year desc, _createdAt desc)[0...6]{
  _id,
  title,
  summary,
  year,
  type,
  coverImage,
  slug { current }
}
`;

function getBlockText(value) {
  return (value?.children || []).map((child) => child.text).join("").trim();
}

const portableComponents = {
  block: {
    h2: ({ children, value }) => {
      const text = getBlockText(value);
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 60);

      return (
        <h2 id={id} className={styles.h2}>
          {children}
        </h2>
      );
    },
    h3: ({ children }) => <h3 className={styles.h3}>{children}</h3>,
    normal: ({ children }) => <p className={styles.p}>{children}</p>,
    blockquote: ({ children }) => <blockquote className={styles.quote}>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className={styles.ul}>{children}</ul>,
    number: ({ children }) => <ol className={styles.ol}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className={styles.li}>{children}</li>,
    number: ({ children }) => <li className={styles.li}>{children}</li>,
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href || "#";
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a
          className={styles.a}
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

export default function ProjectDetails() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [more, setMore] = useState([]);
  const [state, setState] = useState({ status: "loading", message: "Loading..." });

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setState({ status: "loading", message: "Loading..." });

        const data = await sanity.fetch(PROJECT_QUERY, { slug });
        if (!alive) return;

        if (!data?._id) {
          setProject(null);
          setState({ status: "notfound", message: "Project not found." });
          return;
        }

        setProject(data);
        setState({ status: "ready", message: "" });

        // Load other projects for bottom section
        const moreData = await sanity.fetch(MORE_PROJECTS_QUERY, { id: data._id });
        if (!alive) return;
        setMore(Array.isArray(moreData) ? moreData : []);
      } catch (e) {
        if (!alive) return;
        setState({ status: "error", message: "Unable to load this project." });
      }
    })();

    return () => {
      alive = false;
    };
  }, [slug]);

  if (state.status === "loading") {
    return (
      <div className={shell.page}>
        <section className={styles.page}>
          <Container>
            <div className={styles.notice}>{state.message}</div>
          </Container>
        </section>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className={shell.page}>
        <section className={styles.page}>
          <Container>
            <div className={styles.noticeError}>{state.message}</div>
            <Link to="/projects" className={styles.back}>
              ← Back to projects
            </Link>
          </Container>
        </section>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={shell.page}>
        <section className={styles.page}>
          <Container>
            <div className={styles.notice}>Project not found.</div>
            <Link to="/projects" className={styles.back}>
              ← Back to projects
            </Link>
          </Container>
        </section>
      </div>
    );
  }

  const coverUrl = project.coverImage
    ? urlFor(project.coverImage).width(1800).height(900).fit("crop").auto("format").url()
    : "";

  return (
    <div className={shell.page}>
      <section className={styles.page}>
        <Container>
 
          <header className={styles.hero}>
            <h1 className={styles.h1}>{project.title}</h1>

            <div className={styles.metaRow}>
              {project.type ? <span className={styles.metaChip}>{project.type}</span> : null}
              {project.year ? <span className={styles.metaText}>{project.year}</span> : null}
            </div>

            {project.summary ? <p className={styles.lead}>{project.summary}</p> : null}

          {coverUrl ? (
  <div className={styles.coverFrame}>
    <img
      src={coverUrl}
      alt={project.title}
      className={styles.coverImg}
    />
  </div>
) : null}

          </header>

          <article className={styles.article}>
            {/* ✅ Dynamic message when no H2 headings exist */}
            {project.description?.length ? (
              <>
                

                <PortableText value={project.description} components={portableComponents} />
              </>
            ) : (
              <div className={styles.callout}>
                Add content in Sanity under <strong>Full description</strong> to show the article here.
              </div>
            )}

            {(project.highlights || []).length ? (
              <>
                <h2 className={styles.h2} id="highlights">Highlights</h2>
                <ul className={styles.ul}>
                  {project.highlights.map((h) => (
                    <li key={h} className={styles.li}>{h}</li>
                  ))}
                </ul>
              </>
            ) : null}

            {(project.tech || []).length ? (
              <>
                <h2 className={styles.h2} id="tech-stack">Tech stack</h2>
                <div className={styles.tags}>
                  {project.tech.map((t) => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>
              </>
            ) : null}

            {project.link ? (
              <>
                <h2 className={styles.h2} id="links">Links</h2>
                <a className={styles.ext} href={project.link} target="_blank" rel="noreferrer">
                  External project link <ExternalLink size={16} />
                </a>
              </>
            ) : null}
          </article>

          {/* ✅ Bottom “More projects” section */}
          {more.length ? (
            <section className={styles.more}>
              <div className={styles.moreHeader}>
                <h2 className={styles.moreTitle}>More projects</h2>
                <Link to="/projects" className={styles.moreAll}>
                  View all
                </Link>
              </div>

              <div className={styles.moreGrid}>
                {more.map((p) => {
                  const pSlug = p?.slug?.current;
                  const img = p.coverImage
                    ? urlFor(p.coverImage).width(1200).height(675).fit("crop").auto("format").url()
                    : "";

                  return (
                    <article key={p._id} className={styles.moreCard}>
                      {img ? (
                        <div className={styles.moreThumbWrap}>
                          <img className={styles.moreThumb} src={img} alt={p.title} loading="lazy" />
                        </div>
                      ) : (
                        <div className={styles.moreThumbFallback} aria-hidden="true" />
                      )}

                      <div className={styles.moreBody}>
                        <div className={styles.moreTop}>
                          <h3 className={styles.moreCardTitle}>{p.title}</h3>
                          <div className={styles.moreMeta}>
                            {p.type ? <span className={styles.moreChip}>{p.type}</span> : null}
                            {p.year ? <span className={styles.moreYear}>{p.year}</span> : null}
                          </div>
                        </div>

                        {p.summary ? <p className={styles.moreDesc}>{p.summary}</p> : null}

                        {pSlug ? (
                          <Link className={styles.moreLink} to={`/projects/${pSlug}`}>
                            View details
                          </Link>
                        ) : (
                          <span className={styles.moreLinkDisabled}>No slug</span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}
        </Container>
      </section>
    </div>
  );
}
