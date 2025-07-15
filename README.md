# Smart Image Gallery 🖼️⚡

A high-performance image gallery leveraging modern Web APIs for optimal user experience. Inspired by Vercel's design system with a sleek black theme.

![Gallery Screenshot](./screenshots/gallery-demo.gif) <!-- Add your screenshot path -->

## 🌟 Features

- **Real-time network adaptation** (Network Information API)
- **True lazy loading** (Intersection Observer API)
- **Client-side image processing** (Canvas API)
- **Idle-time optimization** (Background Tasks API)
- **Vercel-inspired dark UI** with smooth animations
- **Responsive grid layout** that adapts to all screens
- **Live API activity indicators** showing real-time data

## 🛠️ Web API Integration

| API | Integration Points | Real-World Benefit |
|------|-------------------|-------------------|
| 🌐 Network Information | `useNetworkInfo.ts`, `NetworkStatus.tsx` | Adaptive image quality based on connection speed |
| 👁️ Intersection Observer | `useIntersectionObserver.ts`, `ImageCard.tsx` | True lazy loading and infinite scroll |
| 🎨 Canvas | `useCanvas.ts`, `FilterControls.tsx` | Client-side image filters without server load |
| ⚡ Background Tasks | `useBackgroundTasks.ts` | Heavy processing during browser idle time |

## 🚀 Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/smart-image-gallery.git
