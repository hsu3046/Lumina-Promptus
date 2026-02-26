# 🌟 Lumina Promptus — Public Alpha Release

> **Digital Darkroom — Optical Simulator**
> AI Photography Prompt Builder

---

## 🎉 Overview

**Lumina Promptus** is a professional-grade AI prompt builder that simulates real camera optics, lighting physics, and compositional techniques to generate photorealistic image prompts. Instead of guessing keywords, you dial in real-world camera settings and the engine synthesizes technically accurate prompts across multiple export formats.

This is the **Public Alpha** release — the first version available for public use.

---

## ✨ Key Features

### 🎛️ Four Specialized Modes

| Mode | Description |
|------|-------------|
| **Studio** | Full portrait/fashion photography simulation with subject, wardrobe, pose, and lighting controls |
| **Landscape** | Environment-first composition with real-time solar position, weather, and terrain parameters |
| **Snap** | Quick street/candid photography with streamlined controls |
| **Product** | Commercial product photography with material and staging options |

### 📷 Camera & Lens Simulation

- **21 Camera Bodies** — 17 digital + 4 film bodies across Canon, Sony, Nikon, Leica, Fujifilm, Hasselblad, Panasonic, and Pentax
- **30+ Lenses** — From modern GM/RF/Z lenses to legendary Leica Noctilux and vintage film glass
- **16 Mount Systems** — Automatic lens compatibility filtering (RF, EF, E, Z, F, M, L, X, G, V, 67, and more)
- **Snap Sliders** — Real 1/3-stop increment controls for aperture, ISO, and shutter speed

### 🧠 Intelligent Prompt Engine

- **IR-v2.1 Semantic Authority Model** — Slot-based prompt architecture with priority-weighted composition
- **4 Prompt Builders** — Dedicated builder for each mode (`StudioBuilder`, `LandscapeBuilder`, `SnapBuilder`, `ProductBuilder`)
- **Conflict Resolution Engine** — Automatically detects and resolves incompatible settings (e.g., wide-angle lens + shallow DOF)
- **Prompt Diff Generator** — Visual diff comparison between prompt versions

### 📤 Multi-Format Export

| Exporter | Target |
|----------|--------|
| **NanoBanana** | Optimized for NanoBanana Pro format |
| **ChatGPT** | Structured for ChatGPT / DALL-E workflows |
| **Midjourney** | Formatted with Midjourney-style parameters |
| **Product** | Specialized commercial photography output |

### 🎨 Subject & Composition

- **Universal Dictionary** — Standardized vocabulary for camera angles, body poses, and hand poses
- **Fashion System** — Comprehensive wardrobe options with style conflict detection
- **Portrait Composition** — Framing, cropping, and subject placement presets
- **Photo Styles** — Curated photography style presets

### 🌍 Landscape Intelligence

- **Solar Calculator** — Real-time sun position based on location and time (powered by `suncalc`)
- **Occlusion Analyzer** — Terrain-aware lighting analysis
- **Environment Validator** — Ensures environment settings are physically consistent
- **Google Places Integration** — Location autocomplete and place details via API

### 🖼️ Image Generation (Direct)

Generate images directly from your prompts through built-in multi-provider support:

- **Google Gemini** (Imagen)
- **OpenAI** (DALL-E / GPT-Image)
- **SeeDream** (via fal.ai)

### 💾 Reference Image Upload

Upload reference images to guide your prompt construction and image generation.

### 🔑 BYOK (Bring Your Own Key)

All API keys are stored client-side in browser local storage. No server-side key storage — your keys stay on your device.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui + Radix UI |
| State Management | Zustand 5 |
| Icons | Huge Icons |
| Image Gen | fal.ai, Google GenAI, OpenAI |
| Geo/Solar | SunCalc, Google Places/Maps |
| Analytics | Vercel Analytics |

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/hsu3046/Lumina-Promptus.git
cd lumina-promptus

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
# Fill in your API keys (Google Places, Knowledge Graph)

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗺️ Roadmap

- [ ] Image Gallery with Preset/Reference Injection
- [ ] Photographer Style presets
- [ ] Additional camera brands (Phase One, Mamiya, etc.)
- [ ] Extended lighting patterns
- [ ] Prompt history & favorites
- [ ] Visual diff system

---

## 📝 Known Limitations

- **Public Alpha** — expect rough edges and breaking changes
- Product mode is still in active development
- Image generation requires your own API keys (BYOK model)

---

## 👤 Author

**yuhitomi** — Built with ❤️ using Next.js and shadcn/ui

---

*Released: February 2026*
