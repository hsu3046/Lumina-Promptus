# 🌟 Lumina Promptus

## Tagline-en

Forget copying prompts from Instagram. Just shoot the way you always have — pick your body, your lens, your lighting — and let Lumina Promptus turn those settings into a photo-ready AI prompt. You can even generate the image right here, no other app needed.

## Tagline-ko

인스타에서 프롬프트 복붙하던 시절은 끝. 늘 하던 대로 바디 고르고, 렌즈 끼우고, 조명 잡고, 조리개와 ISO 맞추세요 — Lumina Promptus가 그 감각을 사진 전용 AI 프롬프트로 바꿔드립니다. 여기서 바로 사진 생성까지.

## Tagline-ja

Instagramからプロンプトをコピペする時代は終わり。いつも通りボディを選び、レンズを付け、ライティングを決め、絞りとISOを合わせてください — Lumina Promptusがその感覚を写真専用AIプロンプトに変えます。このアプリだけで写真の生成まで。

---

## Summary-en

You know that feeling — scrolling through social media at midnight, saving yet another "magic prompt" someone swears makes incredible AI photos. Then you try it, and the result looks nothing like what you imagined. Lumina Promptus takes a completely different approach. Instead of guessing at text prompts, you set up your shot the way you've always done: choose a camera body, pair it with a lens, adjust your lighting, dial in your aperture and ISO. The app takes that photographer's intuition and translates it into a prompt built specifically for realistic photography. Four modes cover the genres you actually shoot — Studio for portraits and fashion, Landscape for scenery with real weather and 3D terrain, Snap for street and candid moments, and Product for commercial work.

## Summary-ko

한밤중에 SNS 돌아다니면서 "이 프롬프트 쓰면 진짜 사진 같은 결과 나온다"는 게시물 저장해 본 적 있으시죠? 막상 써보면 내가 원하던 그림이 아닌 경우가 대부분입니다. Lumina Promptus는 접근 방식이 다릅니다. 텍스트 프롬프트를 짜맞추는 대신, 늘 해오던 방식으로 촬영을 세팅하세요. 바디 고르고, 렌즈 끼우고, 조명 잡고, 조리개와 ISO 맞추면 됩니다. 앱이 그 포토그래퍼의 감각을 사진에 특화된 AI 프롬프트로 번역해 줍니다. 전문적인 용도에 맞게 네 가지 모드를 갖추고 있어서 — 인물·패션은 Studio, 풍경은 실제 날씨와 3D 지형까지 반영하는 Landscape, 거리 스냅은 Snap, 상품 촬영은 Product — 용도에 맞는 다양한 모드를 지원합니다.

## Summary-ja

深夜にSNSをスクロールしながら「このプロンプトなら本物の写真みたいな結果が出る」という投稿を保存したこと、ありますよね？実際に使ってみると、思い描いていた写真とは全然違う。Lumina Promptusはアプローチが違います。テキストプロンプトを組み立てる代わりに、いつも通りに撮影をセットアップしてください。ボディを選び、レンズを付け、ライティングを決め、絞りとISOを合わせるだけ。アプリがそのフォトグラファーの感覚を写真に特化したAIプロンプトに翻訳します。実際に撮るジャンルに合わせたモードも用意されています — ポートレート・ファッションはStudio、実際の天気と3D地形が反映される風景はLandscape、ストリート・キャンディッドはSnap、商品撮影はProduct。

---

## ✨ What It Does

- **Simulates real cameras** — Choose a camera body and lens, then adjust aperture, ISO, and shutter speed with sliders that behave like physical dials.
- **Sets up studio lighting** — Pick from professional lighting patterns like Rembrandt, Butterfly, and Loop, adjust key light direction and color temperature, and see it all reflected in the final prompt.
- **Builds prompts automatically** — Every setting you touch is converted into an AI-ready prompt, so you never have to write one from scratch.
- **Supports 4 shooting modes** — Studio (portraits), Landscape (scenery), Snap (street photography), and Product (commercial) — each with tailored controls.
- **Exports to any AI platform** — One-click optimized output for ChatGPT, Midjourney, and NanoBanana with platform-specific formatting.
- **Detects setting conflicts** — A physics-based engine warns you when your combination of aperture, lighting, and lens produces unrealistic results.
- **Shows real-world conditions** — In Landscape mode, the app pulls live weather, sun angle, and 3D terrain data for the location you choose.
- **Generates images directly** — Connects to Google Gemini, OpenAI, and SeeDream to generate images right inside the app using your own API keys.
- **Hands off via QR code** — Scan a QR code to transfer your finished prompt to a phone, tablet, or another device instantly.

---

## 🚀 Try It Now

👉 **[Live Demo](https://luminaprompt.com/)**

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (Strict) |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui + Radix UI |
| State | Zustand 5 |
| Icons | Huge Icons |
| Image Generation | Google Gemini · OpenAI · SeeDream (fal.ai) |
| Geo / Solar | CesiumJS · SunCalc · Google Places API |
| Deploy | Vercel |

---

## 📦 Installation

```bash
git clone https://github.com/hsu3046/Lumina-Promptus.git
cd Lumina-Promptus
npm install
cp .env.example .env.local   # Fill in your API keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── studio/                   # Studio mode (portrait / fashion)
│   ├── landscape/                # Landscape mode (geospatial)
│   ├── snap/                     # Snap mode (street / candid)
│   ├── product/                  # Product mode (commercial)
│   └── api/                      # API routes (places, weather, image-proxy)
├── components/
│   ├── settings/                 # Mode-specific settings panels (28+ components)
│   │   └── tabs/                 # Camera, Subject, Lighting, Landscape, Product tabs
│   └── ui/                       # shadcn/ui base components
├── config/mappings/              # Equipment & style databases
│   ├── cameras.ts                # 21 camera body specs
│   ├── lenses.ts                 # 30+ lens specs
│   ├── fashion-options.ts        # Wardrobe & styling data
│   ├── lighting-patterns.ts      # Lighting configurations
│   └── ...                       # landscape, photo-styles, portrait, product, snap
├── lib/
│   ├── prompt/
│   │   ├── builders/             # StudioBuilder, LandscapeBuilder, SnapBuilder, ProductBuilder
│   │   └── exporters/            # NanoBanana, ChatGPT, Midjourney exporters
│   ├── image-gen/                # Multi-provider image generation
│   ├── landscape/                # Solar calculator, occlusion analyzer
│   ├── dictionary/               # Universal angle / pose dictionary
│   └── rules/                    # Conflict resolution engine
├── store/                        # Zustand stores
├── types/                        # TypeScript type definitions
└── docs/                         # Project documentation
```

---

## 🗺 Roadmap

- [ ] Image Gallery with Preset / Reference Injection
- [ ] Photographer Style presets expansion
- [ ] Additional camera brands (Phase One, Mamiya, etc.)
- [ ] Extended lighting patterns
- [ ] Prompt history & favorites
- [ ] Multi-angle product prompts — generate prompts for multiple angles of a product in one go (Product mode)
- [ ] Cross-mode subject reuse — use a portrait created in Studio mode as the subject in Landscape or Snap mode

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat(scope): add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html).

---

*Built by [KnowAI](https://knowai.space) · © 2026 KnowAI*
