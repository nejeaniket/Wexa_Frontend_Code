# Developer Skill & Project Explorer — Frontend

React + Vite frontend for the Developer Skill & Project Explorer.

## Run

```bash
npm install
npm run dev
```

The backend should run on `http://localhost:3001`.

If your backend uses another URL, create `.env` from `.env.example` and set:

```env
VITE_API_BASE_URL=https://wexa-backend-application.onrender.com/api
```

## Fixed issues

- Stable API loader references prevent repeated `useResource` requests/rerenders.
- Detail panel no longer uses a broken ternary expression.
- Detail panel safely handles missing arrays and both Neo4j and mock-data shapes.
- Error/loading states are handled consistently.
