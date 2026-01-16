# 🌌 QAntum Vortex - 3D Holographic Command Center

## Бърз Старт

**Отваряне на Demo:**

```bash
# Просто отвори в браузър:
holographic-demo.html
```

Demo-то работи standalone с CDN libraries - **не изисква build**.

---

## 📦 Компоненти

### 1. **HolographicDeck.tsx** - Главен Контейнер

- 3D Canvas (React Three Fiber)
- 2D HUD Overlay с parallax ефект
- Mouse tracking за панел tilt

### 2. **HeliosGlobe.tsx** - Централен Глобус

- Rotating wireframe sphere (cyan glow)
- Latitude/Longitude grid lines
- Pulsing core light
- **Performance**: 32x32 полигона

### 3. **ParticleField.tsx** - Particle System

- **5000 instanced particles** (1 draw call!)
- Slow drift animation
- Twinkling effect
- **Optimized**: GPU instancing

### 4. **Scene3D.tsx** - 3D Orchestrator

- OrbitControls (mouse drag, zoom)
- Lighting setup (ambient + 2 point lights)
- Bloom post-processing

---

## 🎨 Визуална Стилистика

| Елемент | Цвят | Ефект |
|---------|------|-------|
| Primary Glow | `#06b6d4` (Cyan) | Bloom shader |
| Accent | `#f43f5e` (Rose) | Point light |
| Background | `#000510` (Deep Void) | Radial gradient |
| Text | Monospace (JetBrains Mono) | Neon glow |

---

## 🚀 Интеграция в React App

```tsx
import { HolographicDeck } from './ui/components/holographic';

function App() {
  return (
    <HolographicDeck
      bioMetrics={{ heartRate: 72, stress: 0.3, entropy: 0.15 }}
      financialMetrics={{ portfolio: 125000, pnl: 4.2, risk: 0.6 }}
      systemStatus="OPERATIONAL"
    />
  );
}
```

---

## ⚙️ Performance Specs

### Минимални Изисквания

- **GPU**: GTX 1060 / RX 580
- **RAM**: 8GB
- **Display**: 1080p
- **FPS Target**: 60 FPS

### Оптимизации

- ✅ Instanced meshes (particles)
- ✅ Bloom post-processing (GPU)
- ✅ Geometry reuse
- ✅ Low polygon count (sphere: 32x32)

### Fallback Strategy

Ако GPU е weak:

```ts
const particleCount = gpuWeak ? 1000 : 5000;
const bloomEnabled = gpuWeak ? false : true;
```

---

## 🎮 Контроли

- **Mouse Drag**: Orbit around globe
- **Mouse Wheel**: Zoom in/out
- **Mouse Move**: HUD panel parallax tilt
- **Auto-Rotate**: Slow continuous spin

---

## 📂 Файлова Структура

```
src/ui/components/holographic/
├── HolographicDeck.tsx      # Main container
├── HeliosGlobe.tsx           # 3D rotating globe
├── ParticleField.tsx         # Instanced particles
├── Scene3D.tsx               # 3D scene orchestrator
├── holographic.css           # Styling
└── index.ts                  # Barrel export
```

---

## 🔧 Dependencies

```json
{
  "three": "^0.160.0",
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.95.0",
  "@react-three/postprocessing": "^2.16.0",
  "framer-motion": "^11.0.0"
}
```

**Инсталация:**

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing framer-motion
```

---

## 🧪 Testing

### Standalone Demo

```bash
# Open in browser:
holographic-demo.html
```

### React Integration

```bash
npm install
npm run dev
```

Отвори: `http://localhost:3000`

---

## 🔄 Rollback Plan

Ако 3D интерфейсът НЕ хареса:

```bash
# 1. Git revert
git revert HEAD

# 2. Uninstall dependencies
npm uninstall three @react-three/fiber @react-three/drei @react-three/postprocessing framer-motion

# 3. Restore 2D HUD
# (Previous component automatically restored via git)
```

---

## 🎖️ Architect's Notes

> **3D е оръжие, не играчка.**
>
> - **Центърът**: 3D (Globe) - Привлича вниманието
> - **Периферията**: 2D (Text) - Четимост и бързина
> - **Bloom**: Само на glowing elements (threshold 0.9)
> - **Particles**: Instanced mesh - 5000 particles = 1 draw call
>
> Мозъкът обработва дълбочина по-бързо от цвят. Използвай това.

---

## 📊 Browser Support

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome 100+ | ✅ Full | Best performance |
| Firefox 100+ | ✅ Full | Good |
| Safari 16+ | ⚠️ Partial | Bloom може да е по-слаб |
| Edge 100+ | ✅ Full | Chromium-based |

---

## 🐛 Known Issues

- **Safari**: Bloom effect може да няма същата интензивност
- **Low-end GPU**: Намали `particleCount` до 1000
- **Mobile**: Не е оптимизирано (desktop-first design)

---

## 🚀 Next Steps

1. ✅ Demo работи standalone
2. ⏳ Интегрирай в main React app
3. ⏳ Добави real-time WebSocket data
4. ⏳ Добави click interactions (globe regions)

---

**Статус**: ✅ ГОТОВО ЗА ТЕСТВАНЕ

**Demo**: `holographic-demo.html`
