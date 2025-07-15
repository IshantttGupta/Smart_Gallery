# Smart Image Gallery 🖼️⚡

A high-performance image gallery leveraging modern Web APIs for optimal user experience. Inspired by Vercel's design system with a sleek black theme.

# Deployed link
https://chic-ganache-b9515e.netlify.app/

![Gallery Screenshot](./screenshots/gallery-demo.gif) <!-- Add your screenshot path -->
<img width="1438" height="913" alt="image" src="https://github.com/user-attachments/assets/e7acb8aa-24dd-4886-bcff-cb5a57a985be" />
<img width="1458" height="923" alt="image" src="https://github.com/user-attachments/assets/88faa0e3-7423-4707-87de-f724370ae434" />
<img width="1814" height="907" alt="image" src="https://github.com/user-attachments/assets/373d2353-73d0-4ea1-b1b8-281090c56225" />
<img width="1569" height="729" alt="image" src="https://github.com/user-attachments/assets/8b35b29f-620b-4560-a2da-ffd6e69c44a0" />
<img width="1919" height="970" alt="image" src="https://github.com/user-attachments/assets/a16fea7d-d344-41f0-b21d-b8ed372b18e1" />

Here, we can see that all API's working properly.



## 🛠️ Tech Stack

### Core Framework
- **React** (v18+) with TypeScript
- **Vite** (Build tool)

### State Management
- **Zustand** (Lightweight state management)

### Styling
- **CSS Modules** with SCSS preprocessing
- **PostCSS** for modern CSS features
- **Framer Motion** for animations

### Web APIs
- **Network Information API**
- **Intersection Observer API**
- **Canvas API**
- **Background Tasks API** (requestIdleCallback)

### Utilities
- **Axios** (HTTP client)
- **date-fns** (Date formatting)
- **Lodash** (Utility functions)

### Deployment
- **Netlify**

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

2. Install dependencies
   ```bash
   npm install

3. development server
   ```bash
   npm run dev

