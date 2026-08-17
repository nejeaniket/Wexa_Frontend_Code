import { useEffect, useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./components/dashboard/Dashboard";
import Explorer from "./components/explorer/Explorer";
import DetailPanel from "./components/details/DetailPanel";
import { useResource } from "./hooks/useResource";
import { api, loadSkills, loadProjects, loadDevelopers } from "./services/api";

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState(null);
  const [results, setResults] = useState([]);

  const skills = useResource(loadSkills);
  const projects = useResource(loadProjects);
  const developers = useResource(loadDevelopers);

  useEffect(() => {
    const term = query.trim();

    if (term.length < 2) {
      setResults([]);
      return undefined;
    }

    const timer = setTimeout(() => {
      api
        .search(term)
        .then(setResults)
        .catch(() => setResults([]));
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const select = async (type, id) => {
    setDetail({ type, loading: true });

    try {
      const data = await api[type](id);

      const [related, recommendations] =
        type === "developer"
          ? await Promise.all([
              api.relatedDevelopers(id),
              api.recommendations(id),
            ])
          : [undefined, undefined];

      setDetail({
        type,
        data,
        related,
        recommendations,
        loading: false,
      });
    } catch (error) {
      setDetail({
        type,
        loading: false,
        error,
        reload: () => select(type, id),
      });
    }
  };

  const resource =
    page === "Skills"
      ? skills
      : page === "Projects"
        ? projects
        : developers;

  const handleSearchSelect = (item) => {
    select(item.type, item.id);
    setQuery("");
  };

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} />

      <main>
        <Header
          page={page}
          query={query}
          setQuery={setQuery}
          results={results}
          onSelect={handleSearchSelect}
        />

        <div className="content">
          {page === "Dashboard" ? (
            <Dashboard
              resources={{ skills, projects, developers }}
              setPage={setPage}
            />
          ) : (
            <Explorer
              type={page.slice(0, -1).toLowerCase()}
              source={resource}
              query={query}
              select={select}
            />
          )}
        </div>
      </main>

      <DetailPanel state={detail} close={() => setDetail(null)} />
    </div>
  );
}
