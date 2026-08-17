import SkillPill from "../common/SkillPill";

export default function ProjectCard({
  project,
  select,
}) {
  const skills = Array.isArray(
    project.skills
  )
    ? project.skills
    : [];

  const contributors =
    Array.isArray(
      project.contributors
    )
      ? project.contributors.length
      : project.contributors || 0;

  return (
    <article
      className="project-card clickable"
      onClick={() => {
        if (select) {
          select(
            "project",
            project.id
          );
        }
      }}
    >
      <div className="project-top">
        <div
          className="project-icon"
          style={{
            background:
              project.color ||
              "#7c3aed",
          }}
        >
          {project.name
            ?.charAt(0)
            .toUpperCase()}
        </div>

        <span className="status">
          <i />
          {project.status ||
            "Unknown"}
        </span>
      </div>

      <h3>
        {project.name}
      </h3>

      <p>
        {project.description ||
          "No description available."}
      </p>

      <div className="skill-row">
        {skills.map((skill) => {
          const name =
            typeof skill ===
            "string"
              ? skill
              : skill.name;

          return (
            <SkillPill
              key={name}
              name={name}
              color={
                typeof skill ===
                "object"
                  ? skill.color
                  : undefined
              }
            />
          );
        })}
      </div>

      <footer>
        <span>
          ♙ {contributors} contributors
        </span>

        <span>
          {project.updated ||
            "Recently"}
        </span>
      </footer>
    </article>
  );
}