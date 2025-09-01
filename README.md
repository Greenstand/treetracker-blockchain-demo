
# TreeTracker Frontend Demo App

A **frontend demo app** for Greenstand’s [TreeTracker](https://greenstand.org/) project.  
This application simulates a grower’s journey: **register → log in → upload a tree photo** → receive blockchain-backed verification and tokens.

The demo integrates with **Keycloak** for authentication and is scaffolded with **React 19, TypeScript, Vite, TailwindCSS, and PrimeReact**.

---

## 🌱 Background

TreeTracker verifies reforestation efforts by linking **geo-tagged, time-stamped images** of trees with grower identities. Verified plantings can be tied to donor funding and impact tokens.  

This demo illustrates how blockchain elements (e.g. CA-backed identities, signed submissions, audit trail, and token issuance) could be woven into the TreeTracker user flow.

---

## ✨ Features

- 🔑 **User Registration** via Keycloak  
- 🔒 **Login with credentials** (Keycloak password flow)  
- 🌍 **Geolocation capture** on submission  
- 🌳 **Tree upload form** (photo + metadata)  
- 📜 **Audit trail view** (planned)  
- 🎫 **Token issuance on approval** (planned)  

> ⚠️ **Note:** For demo purposes, the frontend uses Keycloak admin APIs directly to create users.  
> This is **not recommended in production**.

---

## 🛠️ Tech Stack

- **React 19 + Vite** (frontend tooling)  
- **TypeScript** (type safety)  
- **TailwindCSS** (styling)  
- **PrimeReact** (UI components)  
- **Keycloak JS Adapter** (authentication)  

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS recommended, v18+)  
- npm, pnpm, or yarn  
- Docker (optional, for containerized setup)  

### Install & Run

```bash
# install dependencies
npm install

# start dev server
npm run dev

# build production bundle
npm run build

# preview production build
npm run preview
