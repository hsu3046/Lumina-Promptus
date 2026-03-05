# 🌟 Lumina Promptus

**Digital Darkroom — Optical Simulator**  
AI Photography Prompt Builder

---

## Summary-ko

Lumina Promptus는 실제 카메라와 렌즈의 광학 특성을 시뮬레이션하여 AI 이미지 생성을 위한 **고정밀 프롬프트**를 만들어내는 「디지털 암실(Digital Darkroom)」 웹 애플리케이션입니다.

다양한 카메라 바디, 렌즈, 마운트 시스템을 기반으로 실제 촬영 파라미터(조리개, ISO, 셔터 스피드)를 1/3 스탑 단위로 조절할 수 있습니다. **Studio · Landscape · Snap · Product** 4가지 전문 모드에서 인물, 풍경, 스트리트, 상업 촬영까지 커버하며, ChatGPT · Midjourney · NanoBanana 등 다양한 AI 모델별 최적화 포맷으로 프롬프트를 내보낼 수 있습니다.

Landscape 모드에서는 **CesiumJS 3D 타일** 기반 지오스패셜 시뮬레이션과 **Google Places / 날씨 API** 연동으로 실제 위치의 태양 고도·기상·지형을 반영합니다. AI 레퍼런스 사진 분석(Gemini 3.1 Flash), 멀티 프로바이더 이미지 생성(Gemini · OpenAI · SeeDream), QR 코드 프롬프트 핸드오프, 물리 기반 충돌 감지 엔진, 그리고 **BYOK(Bring Your Own Key)** 보안 모델까지 — 전문 포토그래퍼의 워크플로를 완벽히 재현하는 올인원 AI 촬영 시뮬레이터입니다.

## Summary-en

Lumina Promptus is a **Digital Darkroom** — a web application that simulates real camera and lens optical characteristics to generate high-precision prompts for AI image generation.

With a wide range of camera bodies, lenses, and mount systems, you can dial in real shooting parameters (aperture, ISO, shutter speed) at 1/3-stop increments across four specialized modes — **Studio** (portrait/fashion), **Landscape** (geospatial), **Snap** (street/candid), and **Product** (commercial) — and export deterministic prompts optimized for ChatGPT, Midjourney, NanoBanana, and more.

The Landscape mode features **CesiumJS 3D Photorealistic Tiles** for geospatial simulation with **Google Places API** and real-time weather/solar data. Additional capabilities include AI-powered reference photo analysis (Gemini 3.1 Flash), multi-provider image generation (Gemini, OpenAI, SeeDream via fal.ai), a physics-based conflict detection engine, QR code prompt handoff for cross-device workflows, and a **BYOK (Bring Your Own Key)** security model where API keys never leave your device.

## Summary-ja

Lumina Promptusは、実際のカメラとレンズの光学特性をシミュレーションし、AI画像生成のための**高精度プロンプト**を生成する「デジタル暗室（Digital Darkroom）」Webアプリケーションです。

多彩なカメラボディ、レンズ、マウントシステムを基盤に、実際の撮影パラメータ（絞り、ISO、シャッタースピード）を1/3段刻みで調整可能。**Studio**（ポートレート）・**Landscape**（ジオスペーシャル）・**Snap**（ストリート）・**Product**（商業撮影）の4つの専門モードで、ChatGPT・Midjourney・NanoBananaなど各AIモデルに最適化されたプロンプトを決定論的にエクスポートできます。

Landscapeモードでは**CesiumJS 3Dフォトリアリスティックタイル**による地理空間シミュレーションと**Google Places API**・リアルタイム気象/太陽データを統合。AIリファレンス写真分析（Gemini 3.1 Flash）、マルチプロバイダー画像生成（Gemini・OpenAI・SeeDream）、物理ベースの衝突検知エンジン、QRコードによるプロンプトハンドオフ、**BYOK（Bring Your Own Key）**セキュリティモデルを搭載し、プロフォトグラファーのワークフローを完全に再現するオールインワンAI撮影シミュレータです。

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

This project is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html).  
© KnowAI — [https://knowai.space](https://knowai.space)

---

## 👤 Author

**KnowAI**

---

Built with ❤️ using Next.js and shadcn/ui
