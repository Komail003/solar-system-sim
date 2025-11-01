import React from "react";
import { Routes, Route } from "react-router-dom";
import MainMenu from "./Components/MainMenu";
import SolarSystem from "./Components/SolarSystem";
import EarthView from "./Components/EarthView";
import SaturnView from "./Components/SaturnView";
import JupiterView from "./Components/JupiterView";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/simulator" element={<SolarSystem />} />
      <Route path="/earth" element={<EarthView />} />
      <Route path="/saturn" element={<SaturnView />} />
      <Route path="/jupiter" element={<JupiterView />} />

      <Route path="*" element={<MainMenu />} />
    </Routes>
  );
}
