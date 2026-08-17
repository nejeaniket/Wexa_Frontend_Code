# WEXA Graph --- Developer Skill & Project Explorer

A full-stack graph database application built for the Wexa AI CognoDB
take-home assignment.

The application helps users explore relationships between **developers,
technical skills, and projects** using a graph database powered by
**CognoDB** and the official **Neo4j JavaScript driver**.

## Live Demo

**Frontend:** https://wexagraph.netlify.app/

**Backend API:** https://wexa-backend-application.onrender.com/

## GitHub

Add your repository URL here:

`https://github.com/YOUR_USERNAME/YOUR_REPOSITORY`

------------------------------------------------------------------------

# 1. Project Overview

WEXA Graph is a Developer Skill & Project Explorer.

Instead of treating developers, skills, and projects as independent
records, the application models their relationships as a graph.

Users can:

-   Explore technical skills
-   View skill details
-   Explore projects
-   Explore developers
-   Search across skills, projects, and developers
-   See relationships between graph entities
-   View multi-hop developer relationships
-   View recommended skills based on graph relationships

The application is designed around the idea that the most useful
questions are about **connections and relationships**, making a graph
database a natural fit.

------------------------------------------------------------------------

# 2. Why a Graph Database?

A relational database can store developers, projects, and skills in
separate tables with junction tables, but relationship-heavy questions
require multiple joins.

For this application, graph traversal is more natural.

Example:

``` text
Developer
   |
   | HAS_SKILL
   v
Skill
   |
   | USED_IN
   v
Project
```

This makes relationship-based questions straightforward, such as:

-   Which developers share skills?
-   Which projects use a particular skill?
-   Which skills are connected to a developer through projects?
-   Which developers are related through common skills?
-   What skills could be recommended based on existing relationships?

The graph model makes these traversals explicit and keeps the domain
relationships close to the data.

------------------------------------------------------------------------

# 3. Architecture

``` text
┌──────────────────────────────┐
│        React + Vite          │
│          Frontend            │
│                              │
│  Dashboard                   │
│  Skills Explorer             │
│  Projects Explorer           │
│  Developers Explorer         │
│  Search                      │
│  Detail Panels               │
└──────────────┬───────────────┘
               │ HTTPS / REST API
               ▼
┌──────────────────────────────┐
│       Node.js + Express      │
│          Backend             │
│                              │
│  Routes                      │
│  Controllers / Services      │
│  Error Handling              │
│  Neo4j Driver                │
└──────────────┬───────────────┘
               │ Bolt / openCypher
               ▼
┌──────────────────────────────┐
│           CognoDB            │
│      Graph Database          │
│                              │
│  Developer                   │
│  Skill                       │
│  Project                     │
│  Relationships               │
└──────────────────────────────┘
```

------------------------------------------------------------------------

# 4. Graph Data Model

The core graph contains three main node types:

``` text
(:Developer)
(:Skill)
(:Project)
```

Relationships connect these entities.

Conceptually:

``` text
                 ┌──────────────┐
                 │   Developer  │
                 └──────┬───────┘
                        │
                    HAS_SKILL
                        │
                        ▼
                 ┌──────────────┐
                 │    Skill     │
                 └──────┬───────┘
                        │
                    USED_IN
                        │
                        ▼
                 ┌──────────────┐
                 │   Project    │
                 └──────────────┘
```

Developers can also be associated with projects:

``` text
Developer ──HAS_SKILL──> Skill
Developer ──WORKS_ON───> Project
Project   ──USES_SKILL─> Skill
```

This model supports direct and multi-hop traversals.

------------------------------------------------------------------------

# 5. Technology Stack

## Frontend

-   React
-   Vite
-   JavaScript
-   CSS
-   REST API integration

## Backend

-   Node.js
-   Express.js
-   JavaScript / ES Modules
-   CORS
-   dotenv
-   Neo4j JavaScript Driver

## Database

-   CognoDB
-   openCypher
-   Bolt protocol
-   Neo4j JavaScript driver

## Deployment

-   Netlify --- Frontend
-   Render --- Backend
-   CognoDB --- Graph database

------------------------------------------------------------------------

# 6. Project Structure

The project is separated into frontend and backend responsibilities.

``` text
project/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── details/
│   │   │   └── ...
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── server/
│   │   ├── config/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── queries/
│   │   ├── seed/
│   │   └── index.js
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

------------------------------------------------------------------------

# 7. Backend API

Base URL:

``` text
https://wexa-backend-application.onrender.com
```

## Health

``` http
GET /health
```

Example:

``` text
GET https://wexa-backend-application.onrender.com/health
```

## Skills

``` http
GET /api/skills
GET /api/skills/:id
```

## Projects

``` http
GET /api/projects
GET /api/projects/:id
```

## Developers

``` http
GET /api/developers
GET /api/developers/:id
GET /api/developers/:id/related
GET /api/developers/:id/recommendations
```

## Search

``` http
GET /api/search?q=react
```

The search endpoint supports searching across the graph using a query
term.

------------------------------------------------------------------------

# 8. Example Graph Queries

The application uses parameterized Cypher queries through the official
Neo4j driver.

A basic skill lookup follows the pattern:

``` cypher
MATCH (s:Skill)
RETURN s
```

A developer-to-skill traversal:

``` cypher
MATCH (d:Developer)-[:HAS_SKILL]->(s:Skill)
WHERE d.id = $id
RETURN d, s
```

A multi-hop relationship can traverse a developer's skills to other
developers:

``` cypher
MATCH (d:Developer {id: $id})
      -[:HAS_SKILL]->(s:Skill)
      <-[:HAS_SKILL]-(other:Developer)
WHERE other.id <> d.id
RETURN other, collect(s.name) AS sharedSkills
```

The important point is that IDs and search values are passed as
parameters rather than concatenated into Cypher strings.

------------------------------------------------------------------------

# 9. Seed Data

The repository includes a seed script for loading realistic graph data.

The seed process creates sample relationships between:

-   Developers
-   Skills
-   Projects

Example conceptual data:

``` text
Developer
  ├── React
  ├── Node.js
  └── MongoDB

Project
  ├── React
  ├── Node.js
  └── TypeScript
```

The seed script allows the application to be run against a fresh CognoDB
instance.

------------------------------------------------------------------------

# 10. Environment Variables

Do not commit database credentials to GitHub.

## Backend

Create a `.env` file:

``` env
NEO4J_URI=bolt+s://YOUR-INSTANCE.databases.cognodb.cloud
NEO4J_USERNAME=cognodb
NEO4J_PASSWORD=YOUR_PASSWORD
NEO4J_DATABASE=neo4j
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
```

For production:

``` env
CLIENT_ORIGIN=https://wexagraph.netlify.app
```

The production database password should be configured through the Render
environment variables rather than stored in the repository.

## Frontend

For local development:

``` env
VITE_API_BASE_URL=http://localhost:3001/api
```

For production:

``` env
VITE_API_BASE_URL=https://wexa-backend-application.onrender.com/api
```

------------------------------------------------------------------------

# 11. Local Setup

## Prerequisites

Install:

-   Node.js
-   npm
-   CognoDB account
-   Git

## Backend

Navigate to the backend directory:

``` bash
cd backend
```

Install dependencies:

``` bash
npm install
```

Create `.env` and configure the CognoDB connection.

Start the backend:

``` bash
npm run dev
```

or:

``` bash
npm start
```

The API will run locally on:

``` text
http://localhost:3001
```

Test:

``` text
http://localhost:3001/health
```

## Frontend

Navigate to the frontend directory:

``` bash
cd frontend
```

Install dependencies:

``` bash
npm install
```

Create `.env`:

``` env
VITE_API_BASE_URL=http://localhost:3001/api
```

Start the frontend:

``` bash
npm run dev
```

The Vite development server will provide the local frontend URL.

------------------------------------------------------------------------

# 12. CognoDB Setup

1.  Create a CognoDB Cloud account.
2.  Create a free database instance.
3.  Copy the generated Bolt connection URI.
4.  Save the generated password securely.
5.  Add the values to the backend environment variables.
6.  Run the seed script.
7.  Start the backend and verify `/health`.

Never commit the CognoDB password or `.env` file.

------------------------------------------------------------------------

# 13. Error Handling

The backend includes graceful handling for database connectivity
problems.

The API exposes:

``` http
GET /health
```

which verifies the database connection.

If the database is unavailable, the backend reports the database as
disconnected instead of silently treating the server as healthy.

The frontend also provides loading and error states when API requests
fail.

------------------------------------------------------------------------

# 14. UI Features

## Dashboard

Displays:

-   Developer count
-   Skill count
-   Active project count
-   Graph connection count
-   Project overview

## Skills

Users can:

-   Browse skills
-   Filter by category
-   View proficiency information
-   View connected developers/projects
-   Open skill details

## Projects

Users can:

-   Browse projects
-   View project descriptions
-   View project status
-   View associated skills
-   View project details

## Developers

Users can:

-   Browse developers
-   View roles
-   View skills
-   View developer details
-   Explore related developers

## Search

The global search allows users to search across:

-   Skills
-   Projects
-   Developers

------------------------------------------------------------------------

# 15. Deployment

## Frontend --- Netlify

Production frontend:

``` text
https://wexagraph.netlify.app/
```

Configure:

``` env
VITE_API_BASE_URL=https://wexa-backend-application.onrender.com/api
```

Then build:

``` bash
npm run build
```

and deploy the generated Vite `dist` directory.

## Backend --- Render

Production backend:

``` text
https://wexa-backend-application.onrender.com
```

Recommended Render configuration:

``` text
Build Command:
npm install

Start Command:
npm start
```

Configure the required environment variables in Render.

The backend listens on the Render-provided `PORT`.

------------------------------------------------------------------------

# 16. Security

Sensitive values are kept outside the repository.

The following must never be committed:

``` text
.env
NEO4J_PASSWORD
database credentials
private API keys
```

Use environment variables locally and Render/Netlify environment
configuration in production.

------------------------------------------------------------------------

# 17. Assignment Requirements Covered

The implementation addresses the major requirements of the Wexa AI
take-home assignment:

-   Graph-backed application using CognoDB
-   Developer, skill, and project graph model
-   Typed relationships and node properties
-   Seed data
-   Parameterized Cypher queries
-   Multi-hop graph traversal
-   REST API
-   Functional web application
-   Loading and error states
-   Environment-based database configuration
-   Structured frontend/backend architecture
-   Hosted application demo

------------------------------------------------------------------------

# 18. Demo

**Live Application:**

https://wexagraph.netlify.app/

**Backend API:**

https://wexa-backend-application.onrender.com/

------------------------------------------------------------------------

# 19. Screen Recording

Add your assignment walkthrough recording here:

``` text
[Add screen recording link]
```

The walkthrough should demonstrate:

1.  Dashboard
2.  Skills exploration
3.  Skill detail
4.  Projects
5.  Developers
6.  Search
7.  Graph relationships
8.  Backend/API functionality

------------------------------------------------------------------------

# 20. Author

**Aniket Ashok Neje**

Software Engineer / Full-Stack Web Developer

------------------------------------------------------------------------

## License

This project was created as a take-home technical assessment for Wexa
AI.
