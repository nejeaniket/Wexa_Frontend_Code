const ICONS = {
  Dashboard: "▦",
  Skills: "◎",
  Projects: "◈",
  Developers: "♙",
  Search: "⌕",
};

export default function Icon({ name }) {
  return ICONS[name] ?? "•";
}
