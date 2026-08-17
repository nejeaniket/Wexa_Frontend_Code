# Developer Skill & Project Explorer — Frontend

A React-based web application for exploring relationships between developers, technical skills, and projects through an interactive graph-oriented interface.

## Overview

The frontend provides a dashboard and explorer interface where users can:

- View developer, skill, and project statistics
- Browse technical skills
- Browse projects
- Browse developers
- Search skills, projects, and developers
- View detailed information for individual records
- Explore developer skill relationships
- View related developers based on shared skills
- View recommended skills based on project relationships

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- REST API
- Fetch API

## Project Structure;
src/
├── components/
│   ├── common/
│   ├── dashboard/
│   ├── details/
│   ├── explorer/
│   └── layout/
│
├── hooks/
│   └── useResource.js
│
├── services/
│   └── api.js
│
├── data/
│   └── mockData.js
│
├── styles/
│   └── index.css
│
├── App.jsx
└── main.jsx