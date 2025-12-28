# 카메라 바디와 렌즈의 역할
| 변수 (Variable)             | 핵심 역할 (Core Responsibility)   | 시뮬레이션의 의미 (Impact on AI)                                                                                                                 |   |   |
|-----------------------------|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|---|---|
| 1. 카메라 바디              | 이미지의 토양 (Base Canvas)       | 브랜드 고유의 **색 해석(Color Science)**과 RAW 데이터의 질감을 결정해. "어떤 화질과 톤의 도화지인가"를 정의하는 역할이야.                        |   |   |
| 2. Aperture                 | 광학적 정교함 (Optical Precision) | 단순 심도 조절을 넘어, 렌즈의 해상력 피크나 회절 현상을 모방해. "초점면이 얼마나 날카롭고 배경이 얼마나 뭉개지는가"의 물리 법칙을 담당해.        |   |   |
| 3. Shutter Speed            | 시간의 텍스처 (Temporal Texture)  | 노출값이 아니라 **'움직임의 렌더링'**을 담당해. 찰나의 정지 혹은 흐름의 잔상을 시각적 질감으로 변환하는 역할이야.                                |   |   |
| 4. ISO                      | 입자의 순도 (Material Density)    | 디지털 노이즈와 다이내믹 레인지의 한계를 결정해. 낮은 값에선 깨끗한 계조를, 높은 값에선 암부의 거친 질감과 색상 열화를 표현해.                   |   |   |
| 5. 렌즈 특성 (Purpose)      | 장르적 문법 (Semantic Layer)      | 각 용도(Studio, Street 등)에 맞는 미학적 렌더링 방식을 주입해. 같은 85mm라도 '인물용'이면 피부 질감에, '제품용'이면 선명한 반사광에 집중하게 해. |   |   |
| 6. 렌즈 Category            | 공간의 구조 (Geometry)            | 화각에 따른 **원근 왜곡(Perspective)**과 공간 압축을 설계해. 광각의 확장감이나 망원의 평면적인 레이어링 같은 '프레임의 기하학'을 담당해.         |   |   |
| 7. Bokeh (Conditional)      | 광학적 장식 (Optical Ornament)    | 최대 개방 시에만 활성화되어, 배경 흐림의 '형태(Swirly, Circular 등)'를 결정해. 렌즈의 유리알이 가진 고유의 개성을 시각화하는 도구야.             |   |   |
| 8. Vignetting (Conditional) | 시선의 유도 (Edge Masking)        | 최대 개방 시에만 활성화되어, 주변부 광량을 제어해. 광학적 결함을 이용해 중앙 피사체로 시선을 모으는 심리적 장치 역할을 해.                       |   |   |


# 라이팅 관련
## 1. 조명 구조 (Setup: 빛의 레이어와 입체감)
| 유저 선택지 (UI)            | 대응 AI 프롬프트 (English)                                                   | 구현 의도                                                                                                                                        |   |   |
|-----------------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|---|---|
| 1점 조명             | single key light source, dramatic chiaroscuro, high contrast shadows         | 강한 명암 대비와 예술적 그림자 생성                                                                                                              |   |   |
| 2점 조명        | key and fill lighting setup, balanced facial shadows, natural volume         | 그림자를 적절히 메워 부드러운 입체감 형성                                                                                                        |   |   |
| 3점 조명      | professional 3-point setup, rim light, hair light, subject separation        | 인물 테두리에 빛을 맺히게 하여 배경과 분리                                                                                                       |   |   |
| 백라이트          | strong backlighting, glowing edges, dark frontal exposure, silhouette effect | 배경에서 강한 빛이 들어와 형태를 강조                                                                                                            |   |   |

## 2. 광질 및 도구 (Quality: 피부 질감과 하이라이트)
| 유저 선택지 (UI)            | 대응 AI 프롬프트 (English)                                                           | 구현 의도                                                                                                                                        |   |   |
|-----------------------------|--------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|---|---|
| 소프트박스       | diffused softbox light, smooth skin transitions, gentle shadow falloff               | 잡티를 가리고 화사한 피부 톤 구현                                                                                                                |   |   |
| 뷰티 디쉬         | beauty dish illumination, crisp facial contours, specular highlights, micro-contrast | 이목구비를 또렷하게 하고 피부 질감 강조                                                                                                          |   |   |
| 스포트라이트         | focused snoot light, narrow beam, dramatic light falloff, cinematic focus            | 특정 부위만 밝히고 나머지는 급격히 어둡게 처리                                                                                                   |   |   |
| 엄브렐러           | wide umbrella bounce, even global illumination, open shadows                         | 화면 전체에 균일하고 넓게 퍼지는 빛                                                                                                              |   |   |

## 3. 디테일 및 배경 (Detail: 시선의 완성)
| 유저 선택지 (UI)            | 대응 AI 프롬프트 (English)                                         | 구현 의도                                                                                                                                        |   |   |
|-----------------------------|--------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|---|---|
| 원형        | sharp circular catchlights in irises, vibrant eye reflections      | 인물의 생기 부여 (동그란 조명 형태)                                                                                                              |   |   |
| 창문       | rectangular window catchlights, realistic eye highlights           | 자연스러운 실내 창가 느낌의 반사광                                                                                                               |   |   |
| 광륜          | halo light on backdrop, gradual background glow behind subject     | 인물 뒤 배경에 그라데이션 조명 효과 추가                                                                                                         |   |   |
| 배경 완전 암전              | pitch black background, zero ambient light, pure subject isolation | 배경을 완벽하게 검게 처리하여 인물만 부각                                                                                                        |   |   |

## 4. 스튜디오 색온도
| 유저 선택지 (UI)            | 대응 AI 프롬프트 (English)                                                             | 시각적 효과 및 의도                                                                                                                              |   |   |
|-----------------------------|----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|---|---|
| 표준 화이트 (5600K)         | neutral 5600K white balance, daylight balanced strobes, accurate color rendering       | 가장 깨끗하고 정확한 색상. 광고, 도감, 정석 프로필에 사용.                                                                                       |   |   |
| 따뜻한 텅스텐 (3200K)       | warm tungsten lighting, 3200K amber glow, cozy indoor atmosphere, nostalgic mood       | 인물에 온기를 더하고 부드럽고 친근한 느낌 조성.                                                                                                  |   |   |
| 차가운 시네마틱 (7500K)     | cool blueish studio light, 7500K temperature, clinical and modern look, high-tech mood | 차갑고 이성적인 느낌. 테크 제품이나 미스터리한 인물 화보에 적합.                                                                                 |   |   |
| 컬러 젤 (창의적)            | creative color gels, dual-tone lighting, cyan and magenta contrast                     | 조명 앞에 색상 필터를 끼운 효과. 예술적이고 강렬한 비주얼 구현.                                                                                  |   |   |