import { useMemo, useState } from "react";
import Notice from "../common/Notice";
import SkillPill from "../common/SkillPill";
import ProjectCard from "../dashboard/ProjectCard";

export default function Explorer({ type, source, query, select }) {
  const [category, setCategory] = useState("All");

  const rows = useMemo(
    () =>
      source.data.filter((item) => {
        const matchesQuery = `${item.name} ${item.category || ""} ${item.role || ""}`
          .toLowerCase()
          .includes(query.toLowerCase());

        const matchesCategory =
          category === "All" || item.category === category;

        return matchesQuery && matchesCategory;
      }),
    [source.data, query, category],
  );

  if (source.loading) return <Notice />;
  if (source.error) {
    return <Notice error={source.error} retry={source.reload} />;
  }

  const plural =
    type === "skill" ? "Skills" : type === "project" ? "Projects" : "Developers";

  const categories =
    type === "skill"
      ? ["All", ...new Set(source.data.map((skill) => skill.category))]
      : ["All"];

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Graph explorer · live API</p>
        <h1>{plural}</h1>
        <p>
          Browse the live graph records that connect people, skills, and projects.
        </p>
      </section>

      {categories.length > 1 && (
        <div className="filter-row">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "filter active" : "filter"}
              onClick={() => setCategory(item)}
            >
              {item === "All" ? "All skills" : item}
            </button>
          ))}
        </div>
      )}

      {rows.length ? (
        type === "skill" ? (
          <div className="skill-grid">
            {rows.map((skill) => (
              <article
                className="skill-card clickable"
                key={skill.id}
                onClick={() => select("skill", skill.id)}
              >
                <div
                  className="skill-logo"
                  style={{ borderColor: skill.color, color: skill.color }}
                >
                  ✦
                </div>
                <div>
                  <span className="category">{skill.category}</span>
                  <h3>{skill.name}</h3>
                  <p>{skill.level} proficiency across the team</p>
                </div>
                <footer>
                  <span>{skill.developers} developers</span>
                  <span>{skill.projects} projects</span>
                </footer>
              </article>
            ))}
          </div>
        ) : type === "project" ? (
          <div className="card-grid">
            {rows.map((project) => (
              <ProjectCard key={project.id} project={project} select={select} />
            ))}
          </div>
        ) : (
          <div className="developer-list">
            {rows.map((developer) => (
              <article
                className="developer clickable"
                key={developer.id}
                onClick={() => select("developer", developer.id)}
              >
                <span className="avatar">{developer.initials}</span>
                <div>
                  <h3>{developer.name}</h3>
                  <p>{developer.role}</p>
                </div>
                <div className="skill-row">
                  {developer.skills?.map((skill) => (
                    <SkillPill name={skill} key={skill} />
                  ))}
                </div>
                <button className="text-button">View graph →</button>
              </article>
            ))}
          </div>
        )
      ) : (
        <div className="empty">
          <span>⌕</span>
          <h3>No matches found</h3>
          <p>Nothing in the live graph matches “{query}”.</p>
        </div>
      )}
    </>
  );
}
