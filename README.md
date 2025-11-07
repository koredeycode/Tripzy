# Tripzy

<p align="left">
  <img alt="Expo" src="https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white" />
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="NativeWind" src="https://img.shields.io/badge/NativeWind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="React Navigation" src="https://img.shields.io/badge/React%20Navigation-000000?style=for-the-badge&logo=react&logoColor=white" />
  <img alt="Zustand" src="https://img.shields.io/badge/Zustand-5C4033?style=for-the-badge" />
  <img alt="Stripe" src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
  <img alt="Clerk" src="https://img.shields.io/badge/Clerk-5B34DA?style=for-the-badge&logo=clerk&logoColor=white" />
  <img alt="Google Maps" src="https://img.shields.io/badge/Google%20Maps-4285F4?style=for-the-badge&logo=googlemaps&logoColor=white" />
  <img alt="ESLint" src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" />
  <img alt="Prettier" src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=000" />
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/github/license/koredeycode/Tripzy?style=for-the-badge" /></a>
  <a href="https://github.com/koredeycode/Tripzy/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/koredeycode/Tripzy?style=for-the-badge" /></a>
</p>

A modern, cross‑platform trip planning experience built with Expo + React Native. Tripzy helps users discover places, search destinations, view routes on an interactive map, and handle authentication and payments for bookings.

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
  - [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [License](#license)
- [Contributors](#contributors)

## Introduction

Tripzy is a mobile app designed to make travel planning simple and delightful. Search and explore destinations using Google Places, preview routes and travel times on maps, and securely authenticate with Clerk. Payments are powered by Stripe, and the UI is styled with Tailwind (via NativeWind), ensuring a responsive, accessible experience on Android, iOS, and the web.

## Features

- Location search with Google Places Autocomplete
- Interactive maps with turn‑by‑turn directions
- Secure authentication via Clerk
- Payments and checkout flows with Stripe
- Smooth navigation with React Navigation and Expo Router
- Modern styling with TailwindCSS (NativeWind)
- Global state management with Zustand
- Works on Android, iOS, and Web via Expo

## Tech Stack

- App: Expo, React Native, TypeScript
- Routing & Navigation: Expo Router, React Navigation
- UI: TailwindCSS (NativeWind), @expo/vector-icons
- Maps: react-native-maps, react-native-maps-directions, Google Places Autocomplete
- Auth: Clerk
- Payments: Stripe
- State: Zustand
- Tooling: ESLint, Prettier

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (installed automatically via npx)
- One of: Expo Go app, Android Emulator, or iOS Simulator

### Installation

```bash
npm install
```

### Running the App

```bash
# Start the development server
npx expo start

# Or directly launch a platform
npm run android
npm run ios
npm run web
```

### Environment Variables

Create a `.env` (or your preferred env management) and set the following. Expo will expose variables prefixed with `EXPO_PUBLIC_` to the client app.

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

Reference these in code via `process.env.EXPO_PUBLIC_*`.

## Available Scripts

- `npm start` – Start the Expo dev server
- `npm run android` – Run on Android
- `npm run ios` – Run on iOS
- `npm run web` – Run on Web
- `npm run lint` – Lint the codebase
- `npm run reset-project` – Reset to a fresh project layout (moves example code)

## License

This project is licensed under the MIT License. See `LICENSE` for details.

## Contributors

Contributions are welcome! Feel free to submit issues and pull requests.

- Your Name (@your-handle)
- See the contributors page of the repository for more
