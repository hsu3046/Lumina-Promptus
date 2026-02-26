# 🌟 Lumina Promptus

**Digital Darkroom — Optical Simulator**  
AI Photography Prompt Builder

---

## Summary-ko

Lumina Promptus는 실제 카메라와 렌즈의 광학 특성을 시뮬레이션하여 AI 이미지 생성을 위한 고품질 프롬프트를 생성하는 웹 애플리케이션입니다. 21개 카메라 바디, 30개 이상의 렌즈, 16개 마운트 시스템을 기반으로 실제 촬영 파라미터(조리개, ISO, 셔터 스피드)를 1/3 스탑 단위로 조절할 수 있으며, Studio · Landscape · Snap · Product 4가지 모드에서 ChatGPT, Midjourney, NanoBanana 등 다양한 포맷으로 프롬프트를 내보낼 수 있습니다.

## Summary-en

Lumina Promptus is a web application that simulates real camera and lens optical characteristics to generate high-quality prompts for AI image generation. With 21 camera bodies, 30+ lenses, and 16 mount systems, you can dial in real shooting parameters (aperture, ISO, shutter speed) at 1/3-stop increments across four specialized modes — Studio, Landscape, Snap, and Product — and export prompts in ChatGPT, Midjourney, NanoBanana, and other formats.

## Summary-ja

Lumina Promptusは、実際のカメラとレンズの光学特性をシミュレーションし、AI画像生成のための高品質なプロンプトを生成するWebアプリケーションです。21台のカメラボディ、30本以上のレンズ、16のマウントシステムを基盤に、実際の撮影パラメータ（絞り、ISO、シャッタースピード）を1/3段刻みで調整可能。Studio・Landscape・Snap・Productの4モードで、ChatGPT、Midjourney、NanoBananaなど多様なフォーマットでプロンプトをエクスポートできます。

---

## ✨ Features

### 🎛️ Four Specialized Modes

| Mode | Description |
|------|-------------|
| **Studio** | Full portrait/fashion photography simulation with subject, wardrobe, pose, and lighting controls |
| **Landscape** | Environment-first composition with real-time solar position, weather, and terrain parameters |
| **Snap** | Quick street/candid photography with streamlined controls |
| **Product** | Commercial product photography with material and staging options |

### 📷 Camera & Lens Simulation

- **21 Camera Bodies** — 17 digital + 4 film across Canon, Sony, Nikon, Leica, Fujifilm, Hasselblad, Panasonic, Pentax
- **30+ Lenses** — Modern GM/RF/Z glass to legendary Leica Noctilux and vintage film lenses
- **16 Mount Systems** — Automatic lens compatibility filtering (RF, EF, E, Z, F, M, L, X, G, V, 67…)
- **Snap Sliders** — Real 1/3-stop increment controls for aperture, ISO, and shutter speed
- **Brand Auto-selection** — Selecting a brand auto-populates compatible cameras and lenses

### 🧠 Prompt Engine

- **Slot-based Architecture** — Priority-weighted prompt composition via IR-v2.1 Semantic Authority model
- **4 Dedicated Builders** — `StudioBuilder`, `LandscapeBuilder`, `SnapBuilder`, `ProductBuilder`
- **Conflict Resolution** — Automatically detects and resolves incompatible settings
- **Prompt Diff Generator** — Visual diff comparison between prompt versions
- **Universal Dictionary** — Standardized vocabulary for camera angles, body poses, and hand poses

### 📤 Multi-Format Export

| Exporter | Target |
|----------|--------|
| **NanoBanana** | Optimized for NanoBanana Pro format |
| **ChatGPT** | Structured for ChatGPT / DALL-E workflows |
| **Midjourney** | Formatted with Midjourney-style parameters |
| **Product** | Specialized commercial photography output |

### 🎨 Subject & Composition

- **Fashion System** — Comprehensive wardrobe options with style conflict detection
- **Portrait Composition** — Framing, cropping, and subject placement presets
- **Photo Styles** — Curated photography style presets
- **Lighting Patterns** — Studio and natural lighting configurations

### 🌍 Landscape Intelligence

- **Solar Calculator** — Real-time sun position based on location and time
- **Occlusion Analyzer** — Terrain-aware lighting analysis
- **Environment Validator** — Ensures physically consistent settings
- **Google Places API** — Location autocomplete and geographic context

### 🖼️ Image Generation

Generate images directly from prompts via built-in multi-provider support:

- **Google Gemini** (Imagen)
- **OpenAI** (GPT-Image)
- **SeeDream** (via fal.ai)

### 🔑 BYOK Security Model

All API keys are stored client-side in browser local storage. No server-side key storage — your keys never leave your device.

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
| Image Generation | fal.ai, Google GenAI, OpenAI |
| Geo / Solar | SunCalc, Google Places API |

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Fill in your API keys — see `.env.example` for details.

### 3. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Production Build

```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
├── app/                        # Next.js App Router
│   ├── studio/                # Studio mode page
│   ├── landscape/             # Landscape mode page
│   ├── snap/                  # Snap mode page
│   ├── product/               # Product mode page
│   └── api/                   # API routes (places, weather, knowledge-graph, image-proxy)
├── components/
│   ├── settings/              # Mode-specific settings panels (28+ components)
│   │   └── tabs/              # Camera, Subject, Lighting, Landscape, Product, Snap tabs
│   └── ui/                    # shadcn/ui components
├── config/mappings/           # Equipment & style databases
│   ├── cameras.ts             # 21 camera body specs
│   ├── lenses.ts              # 30+ lens specs
│   ├── fashion-options.ts     # Wardrobe & styling data
│   ├── lighting-patterns.ts   # Lighting configurations
│   ├── landscape-environment.ts
│   ├── photo-styles.ts
│   ├── portrait-composition.ts
│   ├── product-options.ts
│   └── snap-options.ts
├── lib/
│   ├── prompt/
│   │   ├── builders/          # StudioBuilder, LandscapeBuilder, SnapBuilder, ProductBuilder
│   │   └── exporters/         # NanoBanana, ChatGPT, Midjourney, Product exporters
│   ├── image-gen/             # Multi-provider image generation (Gemini, OpenAI, SeeDream)
│   ├── landscape/             # Solar calculator, occlusion analyzer, environment validator
│   ├── dictionary/            # Universal Dictionary (angles, body poses, hand poses)
│   └── rules/                 # Conflict resolution engine
├── store/                     # Zustand stores (settings, history, prompt, API keys)
├── types/                     # TypeScript type definitions
└── docs/                      # Project documentation
```

---

## �️ Roadmap

- [ ] Image Gallery with Preset / Reference Injection
- [ ] Photographer Style presets
- [ ] Additional camera brands (Phase One, Mamiya, etc.)
- [ ] Extended lighting patterns
- [ ] Prompt history & favorites
- [ ] Visual diff system

---

## 📄 License

This project is private and proprietary.

---

## 👤 Author

**KnowAI**

---

Built with ❤️ using Next.js and shadcn/ui
