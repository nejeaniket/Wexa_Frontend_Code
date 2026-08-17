import SkillPill from "../common/SkillPill";

export default function ProjectCard({ project, select }) {
  return (
    <article
      className="project-card clickable"
      onClick={() => select?.("project", project.id)}
    >
      <div className="project-top">
        <div
          className="project-icon"
          style={{ background: project.color || "#7c3aed" }}
        >
          {project.name[0]}
        </div>
        <span className="status">
          <i />
          {project.status}
        </span>
      </div>

      <h3>{project.name}</h3>
      <p>{project.description}</p>

      <div className="skill-row">
        {project.skills?.map((skill) => (
          <SkillPill
            key={typeof skill === "string" ? skill : skill.id}
            name={typeof skill === "string" ? skill : skill.name}
            color={typeof skill === "string" ? undefined : skill.color}
          />
        ))}
      </div>

      <footer>
        <span>
          ♙ {project.contributors?.length ?? project.contributors ?? 0} contributors
        </span>
        <span>{project.updated}</span>
      </footer>
    </article>
  );
}
