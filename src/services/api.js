const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://wexa-backend-application.onrender.com/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`);
  } catch {
    throw new ApiError(
      "Could not reach the API. Start the backend with npm run dev:server.",
      0,
    );
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new ApiError(
      body.error || "The request could not be completed.",
      response.status,
    );
  return body.data;
}

export const api = {
  skills: () => request("/skills"),
  skill: (id) => request(`/skills/${id}`),
  projects: () => request("/projects"),
  project: (id) => request(`/projects/${id}`),
  developers: () => request("/developers"),
  developer: (id) => request(`/developers/${id}`),
  search: (term) => request(`/search?q=${encodeURIComponent(term)}`),
  relatedDevelopers: (id) => request(`/developers/${id}/related`),
  recommendations: (id) => request(`/developers/${id}/recommendations`),
};

// Stable loader references prevent useResource from re-running on every render.
export const loadSkills = api.skills;
export const loadProjects = api.projects;
export const loadDevelopers = api.developers;
