export default function SkillPill({ name, color }) {
  return (
    <span className="pill">
      <span style={{ background: color || "#8c7be8" }} />
      {name}
    </span>
  );
}
