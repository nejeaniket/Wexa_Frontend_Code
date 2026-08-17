import Notice from "../common/Notice";
import ProjectCard from "./ProjectCard";

export default function Dashboard({
  resources,
  setPage,
  select,
}) {
  const {
    skills,
    projects,
    developers,
  } = resources;

  if (
    skills.loading ||
    projects.loading ||
    developers.loading
  ) {
    return <Notice />;
  }

  const error =
    skills.error ||
    projects.error ||
    developers.error;

  if (error) {
    return (
      <Notice
        error={error}
        retry={() => {
          skills.reload();
          projects.reload();
          developers.reload();
        }}
      />
    );
  }

  const connected =
    skills.data.reduce(
      (count, skill) =>
        count +
        (skill.developers || 0) +
        (skill.projects || 0),
      0
    );

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">
            Developer Skill & Project Explorer
          </p>

          <h1>
            See how your team's
            <br />
            <em>skills connect</em>{" "}
            to impact.
          </h1>

          <p className="lede">
            Live developer, technology,
            and project data from your
            graph database.
          </p>

          <button
            className="primary"
            onClick={() =>
              setPage("Skills")
            }
          >
            Explore the graph
            <span>→</span>
          </button>
        </div>

        <div className="graph-art">
          <div className="node n1">
            React
          </div>

          <div className="node n2">
            Priya
          </div>

          <div className="node n3">
            Atlas
          </div>

          <div className="node n4">
            Neo4j
          </div>

          <div className="line l1" />
          <div className="line l2" />
          <div className="line l3" />

          <div className="orb" />
        </div>
      </section>

      <section className="stats">
        <Stat
          value={developers.data.length}
          label="Developers"
          glyph="♙"
        />

        <Stat
          value={skills.data.length}
          label="Skills mapped"
          glyph="◎"
        />

        <Stat
          value={
            projects.data.filter(
              (project) =>
                project.status ===
                "Active"
            ).length
          }
          label="Active projects"
          glyph="◈"
        />

        <Stat
          value={connected}
          label="Graph connections"
          glyph="⌘"
        />
      </section>

      <section className="section-head">
        <div>
          <p className="eyebrow">
            Live from CognoDB
          </p>

          <h2>Projects</h2>
        </div>

        <button
          className="text-button"
          onClick={() =>
            setPage("Projects")
          }
        >
          View all projects →
        </button>
      </section>

      <div className="card-grid">
        {projects.data
          .slice(0, 3)
          .map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              select={select}
            />
          ))}
      </div>
    </>
  );
}

function Stat({
  value,
  label,
  glyph,
}) {
  return (
    <article className="stat-card">
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>

      <i>{glyph}</i>
    </article>
  );
}