import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from './Menu';
import SeriesDeportivas from './SeriesDeportivas';
import ProblemaMochila from './ProblemaMochila';
import Arboles from './Arboles';
import RutasCortas from './RutasCortas';

// Definir todas las rutas aquí
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/ASD" element={<SeriesDeportivas />} />
      <Route path="/APM" element={<ProblemaMochila />} />
      <Route path="/AA" element={<Arboles />} />
      <Route path="/ARC" element={<RutasCortas />} />
    </Routes>
  );
}

export default AppRoutes;