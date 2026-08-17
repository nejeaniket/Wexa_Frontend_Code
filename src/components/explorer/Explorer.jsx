import { useMemo, useState } from "react";
import Notice from "../common/Notice";
import SkillPill from "../common/SkillPill";
import ProjectCard from "../dashboard/ProjectCard";

export default function Explorer({
  type,
  source,
  query,
  select,
}) {
  const [category, setCategory] =
    useState("All");

  const rows = useMemo(() => {
    const items = Array.isArray(source.data)
      ? source.data
      : [];

    return items.filter((item) => {
      const searchText = `
        ${item.name || ""}
        ${item.category || ""}
        ${item.role || ""}
      `.toLowerCase();

      const matchesSearch =
        searchText.includes(
          query.toLowerCase()
        );

      const matchesCategory =
        category === "All" ||
        item.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    source.data,
    query,
    category,
  ]);

  if (source.loading) {
    return <Notice />;
  }

  if (source.error) {
    return (
      <Notice
        error={source.error}
        retry={source.reload}
      />
    );
  }

  const categories =
    type === "skill"
      ? [
          "All",
          ...new Set(
            source.data
              .map(
                (item) =>
                  item.category
              )
              .filter(Boolean)
          ),
        ]
      : ["All"];

  const title =
    type === "skill"
      ? "Skills"
      : type === "project"
        ? "Projects"
        : "Developers";

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">
          Graph explorer · live API
        </p>

        <h1>{title}</h1>

        <p>
          Browse the live graph records that
          connect people, skills, and projects.
        </p>
      </section>

      {/* Skill Filters */}
      {type === "skill" && (
        <div className="filter-row">
          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item
                  ? "filter active"
                  : "filter"
              }
              onClick={() =>
                setCategory(item)
              }
            >
              {item === "All"
                ? "All skills"
                : item}
            </button>
          ))}
        </div>
      )}

      {/* No Data */}
      {rows.length === 0 && (
        <div className="empty">
          <span>⌕</span>

          <h3>
            No matches found
          </h3>

          <p>
            Nothing in the graph matches
            "{query}".
          </p>
        </div>
      )}

      {/* Skills */}
      {type === "skill" &&
        rows.length > 0 && (
          <div className="skill-grid">
            {rows.map((skill) => (
              <article
                key={skill.id}
                className="skill-card clickable"
                onClick={() =>
                  select(
                    "skill",
                    skill.id
                  )
                }
              >
                <div
                  className="skill-logo"
                  style={{
                    borderColor:
                      skill.color ||
                      "#8c7be8",

                    color:
                      skill.color ||
                      "#8c7be8",
                  }}
                >
                  ✦
                </div>

                <div>
                  <span className="category">
                    {skill.category ||
                      "Skill"}
                  </span>

                  <h3>
                    {skill.name}
                  </h3>

                  <p>
                    {skill.level ||
                      "Unknown"}{" "}
                    proficiency
                  </p>
                </div>

                <footer>
                  <span>
                    {skill.developers ??
                      0}{" "}
                    developers
                  </span>

                  <span>
                    {skill.projects ??
                      0}{" "}
                    projects
                  </span>
                </footer>
              </article>
            ))}
          </div>
        )}

      {/* Projects */}
      {type === "project" &&
        rows.length > 0 && (
          <div className="card-grid">
            {rows.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                select={select}
              />
            ))}
          </div>
        )}

      {/* Developers */}
      {type === "developer" &&
        rows.length > 0 && (
          <div className="developer-list">
            {rows.map((developer) => (
              <article
                key={developer.id}
                className="developer clickable"
                onClick={() =>
                  select(
                    "developer",
                    developer.id
                  )
                }
              >
                <span className="avatar">
                  {developer.initials ||
                    developer.name
                      ?.slice(0, 2)
                      .toUpperCase()}
                </span>

                <div>
                  <h3>
                    {developer.name}
                  </h3>

                  <p>
                    {developer.role}
                  </p>
                </div>

                <div className="skill-row">
                  {Array.isArray(
                    developer.skills
                  ) &&
                    developer.skills.map(
                      (skill) => (
                        <SkillPill
                          key={
                            typeof skill ===
                            "string"
                              ? skill
                              : skill.id
                          }
                          name={
                            typeof skill ===
                            "string"
                              ? skill
                              : skill.name
                          }
                        />
                      )
                    )}
                </div>

                <button
                  className="text-button"
                  onClick={(event) => {
                    event.stopPropagation();

                    select(
                      "developer",
                      developer.id
                    );
                  }}
                >
                  View graph →
                </button>
              </article>
            ))}
          </div>
        )}
    </>
  );
}