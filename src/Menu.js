import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

function Menu() {
  const [tooltip, setTooltip] = useState('');
  const navigate = useNavigate();

  const salirPrograma = () => {
    alert("El programa ha terminado (simulación).");
    // Simulamos la salida. En una app web, no puedes cerrar la ventana directamente.
  };

  const mostrarMensajeTooltip = (mensaje) => {
    setTooltip(mensaje);
  };

  const ocultarMensajeTooltip = () => {
    setTooltip('');
  };

  const irSeriesDeportivas = () => {
    navigate('/ASD');
  };

  const irProblemaMochila = () => {
    navigate('/APM');
  };

  const irArboles = () => {
    navigate('/AA');
  };

  const irRutasCortas = () => {
    navigate('/ARC');
  };

  return (
    <div>
      <h1>Menu</h1>

      <div 
        onMouseEnter={() => mostrarMensajeTooltip('Presiona para ir al algoritmo de rutas más cortas')}
        onMouseLeave={ocultarMensajeTooltip}
      >
        <button onClick={irRutasCortas}>Rutas más cortas</button>
      </div>

      <div 
        onMouseEnter={() => mostrarMensajeTooltip('Presiona ir al algoritmo de la mochila')}
        onMouseLeave={ocultarMensajeTooltip}
      >
        <button onClick={irProblemaMochila}>Algoritmo de la mochila</button>
      </div>

      <div 
        onMouseEnter={() => mostrarMensajeTooltip('Presiona para ir al algoritmo de series deportivas')}
        onMouseLeave={ocultarMensajeTooltip}
      >
        <button onClick={irSeriesDeportivas}>Series deportivas</button>
      </div>

      <div 
        onMouseEnter={() => mostrarMensajeTooltip('Presiona para ir al algoritmo de balanceo de árboles')}
        onMouseLeave={ocultarMensajeTooltip}
      >
        <button onClick={irArboles}>Árboles</button>
      </div>

      <div 
        onMouseEnter={() => mostrarMensajeTooltip('Presiona para salir del programa')}
        onMouseLeave={ocultarMensajeTooltip}
      >
        <button onClick={salirPrograma}>Salir</button>
      </div>
      
      {tooltip && <div className="tooltip">{tooltip}</div>}
      
    </div>
  );
}

export default Menu;