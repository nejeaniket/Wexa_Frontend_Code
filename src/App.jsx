import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import Dashboard from "./components/dashboard/Dashboard";
import Explorer from "./components/explorer/Explorer";

import DetailPanel from "./components/details/DetailPanel";

import { useResource } from "./hooks/useResource";
import { api } from "./services/api";

export default function App() {
  const [page, setPage] =
    useState("Dashboard");

  const [query, setQuery] =
    useState("");

  const [detail, setDetail] =
    useState(null);

  const [results, setResults] =
    useState([]);

  /*
   * Keep API loader functions stable.
   * This prevents useResource from
   * continuously re-fetching.
   */
  const loadSkills = useCallback(
    () => api.skills(),
    []
  );

  const loadProjects = useCallback(
    () => api.projects(),
    []
  );

  const loadDevelopers = useCallback(
    () => api.developers(),
    []
  );

  const skills =
    useResource(loadSkills);

  const projects =
    useResource(loadProjects);

  const developers =
    useResource(loadDevelopers);

  /*
   * Search
   */
  useEffect(() => {
    const term =
      query.trim();

    if (term.length < 2) {
      setResults([]);
      return;
    }

    const timer =
      setTimeout(async () => {
        try {
          const data =
            await api.search(term);

          setResults(
            Array.isArray(data)
              ? data
              : []
          );
        } catch (error) {
          console.error(
            "Search error:",
            error
          );

          setResults([]);
        }
      }, 300);

    return () =>
      clearTimeout(timer);
  }, [query]);

  /*
   * Open detail
   */
  const select = useCallback(
    async (type, id) => {
      console.log(
        "Opening detail:",
        type,
        id
      );

      setDetail({
        type,
        loading: true,
        data: null,
        error: null,
      });

      try {
        let data;

        if (type === "skill") {
          data =
            await api.skill(id);
        } else if (
          type === "project"
        ) {
          data =
            await api.project(id);
        } else if (
          type === "developer"
        ) {
          data =
            await api.developer(id);
        } else {
          throw new Error(
            `Unknown type: ${type}`
          );
        }

        let related = [];
        let recommendations = [];

        /*
         * Only developers need
         * graph recommendations.
         */
        if (
          type === "developer"
        ) {
          [
            related,
            recommendations,
          ] = await Promise.all([
            api.relatedDevelopers(
              id
            ),
            api.recommendations(
              id
            ),
          ]);
        }

        setDetail({
          type,
          data,
          related:
            Array.isArray(related)
              ? related
              : [],
          recommendations:
            Array.isArray(
              recommendations
            )
              ? recommendations
              : [],
          loading: false,
          error: null,
          reload: () =>
            select(type, id),
        });
      } catch (error) {
        console.error(
          `Failed to load ${type}:`,
          error
        );

        setDetail({
          type,
          data: null,
          loading: false,
          error,
          reload: () =>
            select(type, id),
        });
      }
    },
    []
  );

  /*
   * Search result click
   */
  const handleSearchSelect =
    (item) => {
      setQuery("");
      setResults([]);

      select(
        item.type,
        item.id
      );
    };

  /*
   * Current explorer resource
   */
  let resource;
  let explorerType;

  if (page === "Skills") {
    resource = skills;
    explorerType = "skill";
  } else if (
    page === "Projects"
  ) {
    resource = projects;
    explorerType = "project";
  } else {
    resource = developers;
    explorerType =
      "developer";
  }

  return (
    <div className="app">
      <Sidebar
        page={page}
        setPage={setPage}
      />

      <main>
        <Header
          page={page}
          query={query}
          setQuery={setQuery}
          results={results}
          onSelect={
            handleSearchSelect
          }
        />

        <div className="content">
          {page ===
          "Dashboard" ? (
            <Dashboard
              resources={{
                skills,
                projects,
                developers,
              }}
              setPage={setPage}
              select={select}
            />
          ) : (
            <Explorer
              type={explorerType}
              source={resource}
              query={query}
              select={select}
            />
          )}
        </div>
      </main>

      <DetailPanel
        state={detail}
        close={() =>
          setDetail(null)
        }
      />
    </div>
  );
}