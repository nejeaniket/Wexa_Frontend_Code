const API_BASE_URL ="https://wexa-backend-application.onrender.com";

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`);

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(
        body.error || "API request failed",
        response.status
      );
    }

    return body.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      "Could not reach the API. Make sure the backend is running on port 3001.",
      0
    );
  }
}

export const api = {
  // Skills
  skills: () => request("/skills"),

  skill: (id) =>
    request(`/skills/${encodeURIComponent(id)}`),

  // Projects
  projects: () => request("/projects"),

  project: (id) =>
    request(`/projects/${encodeURIComponent(id)}`),

  // Developers
  developers: () => request("/developers"),

  developer: (id) =>
    request(`/developers/${encodeURIComponent(id)}`),

  // Search
  search: (term) =>
    request(
      `/search?q=${encodeURIComponent(term)}`
    ),

  // Graph relationships
  relatedDevelopers: (id) =>
    request(
      `/developers/${encodeURIComponent(id)}/related`
    ),

  recommendations: (id) =>
    request(
      `/developers/${encodeURIComponent(id)}/recommendations`
    ),
};