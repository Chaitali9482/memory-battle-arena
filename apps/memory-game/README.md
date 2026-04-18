# Memory Battle Arena

A premium, responsive, and educational memory game built with React, TypeScript, and Framer Motion.

## 🚀 Features

### Dual Game Modes
- **Fun Mode**: Choose from various themes (Animals, Food, Nature, Space, Sports) and match vibrant emojis.
- **Learning Mode**: Master educational subjects (Math, Science, History, Geography) with Q&A matching and detailed explanations.

### Adaptive Difficulty
- **Easy**: 4x4 Grid (8 pairs)
- **Medium**: 6x6 Grid (18 pairs)
- **Hard**: 8x8 Grid (32 pairs)

### Premium Experience
- **Universal Text Fitting**: Intelligent font scaling ensures every word and expression fits perfectly within the tiles.
- **Dynamic Animations**: Smooth 3D flips, match highlights, and wrong-match shakes.
- **Integrated Soundtrack**: High-quality audio feedback for flips, matches, and victories.
- **Gamification**: Move counters, timers, and star-rating systems to track progress.

---

## 🛠️ Tech Stack
- **Framework**: React (Vite)
- **Language**: TypeScript
- **State Management**: React Hooks (useGame)
- **Animations**: Framer Motion
- **Styling**: Vanilla CSS (Premium Teal/Navy theme)
- **Monorepo Management**: Nx

---

## 🏃 Getting Started

### Installation
```bash
npm install
```

### Run Locally
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## 📁 Project Structure
- `src/components`: UI elements (Grid, Tile, Overlay, etc.)
- `src/pages`: Main application screens (Home, Game, Result)
- `src/hooks`: Core game engine logic (`useGame.ts`)
- `src/services`: Data loading and sound management
- `src/data`: JSON content for all subjects and themes
- `src/types`: TypeScript definitions

---

## 💡 Implementation Highlights
- **Universal Rendering**: Content adapts automatically using character-length detection and multiple CSS scaling layers.
- **Data Pooling**: High-density grids (8x8) intelligently pull from all difficulty buckets to ensure no stale content.
- **Strict Matching**: Learning Mode uses `pairId` validation to ensure precise Q&A mapping.

---
Developed as part of the Memory Battle Arena Sprint Series.
