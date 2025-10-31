🌌 Solar System Simulator (React + Three.js + Vite)
A realistic 3D Solar System Simulator built with React, Three.js, and Vite.
It features NASA-like planet textures, real-time orbital motion, dynamic sunlight illumination, and smooth camera focus transitions for each planet.

🚀 Features
✅ Realistic NASA planet textures
✅ Dynamic lighting from the Sun (point light with shadows)
✅ Orbit paths for all planets
✅ Interactive planet selection (focus camera on any planet)
✅ Scaled planet sizes and orbital distances (Earth = 1 unit reference)
✅ Soft bloom and glow post-processing effects
✅ Starfield background for deep space ambience
✅ Smooth, responsive camera transitions

🧠 Technologies Used


React 18


Vite (fast dev environment)


Three.js (WebGL 3D engine)


@react-three/fiber (React renderer for Three.js)


@react-three/drei (useful helpers like Stars, OrbitControls)


@react-three/postprocessing (for glow/bloom effects)



📁 Project Structure
├── public
│   └── vite.svg
├── src
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── textures
│   │   ├── sun.jpg
│   │   ├── mercury.jpg
│   │   ├── venus.jpg
│   │   ├── earth.jpg
│   │   ├── mars.jpg
│   │   ├── jupiter.jpg
│   │   ├── saturn.jpg
│   │   ├── uranus.jpg
│   │   └── neptune.jpg
│   └── assets
│       └── react.svg
└── vite.config.js


🪐 Planet Scale Reference (Earth = 1.0)
PlanetSize (relative)Distance (units)SpeedMercury0.39301.2Venus0.95401.0Earth1.00550.8Mars0.53650.7Jupiter11.21850.5Saturn9.451200.4Uranus4.011450.3Neptune3.881650.2

⚙️ Installation & Setup


Clone the repository
git clone https://github.com/your-username/solar-system-simulator.git
cd solar-system-simulator



Install dependencies
npm install



Start development server
npm run dev



Open your browser and visit:
http://localhost:5173




🎮 Controls


Left Click + Drag → Rotate camera


Scroll → Zoom in/out


Click Planet Name (top-right) → Focus camera on that planet


Click "Solar System" → Return to full view



🌞 Lighting & Effects


The Sun acts as a point light source, casting light and shadows on all planets.


Planets use meshStandardMaterial for physically correct lighting.


A Bloom post-processing effect simulates the Sun’s glow.



🖼️ Credits


Planet Textures: NASA / Jet Propulsion Laboratory (public domain)


3D Framework: Three.js


React Integration: React Three Fiber


Starfield: @react-three/drei



💡 Future Enhancements (Ideas)


🌗 Add moon orbiting Earth


🌠 Add asteroid belt between Mars and Jupiter


☄️ Add comets with particle trails


🛰️ Add spacecraft models or satellites


🕹️ Enable time scaling (speed up or slow down orbits)



📸 Preview
(Add a screenshot or GIF here after running your project!)
Example:
![Solar System Preview](./preview.gif)


Would you like me to include a deploy section (GitHub Pages / Vercel) in the README so you can easily host your simulator online?
