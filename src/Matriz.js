import React from 'react';
import './App.css';

function Matriz({ datos }) {
    const columnas = Object.keys(datos[0]);
  return (
    <div className="table-container">
    <table className='table'>
        <tbody>
          {datos.map((fila, filaIndex) => (
            <tr key={filaIndex}>
              {columnas.map((columna, colIndex) => (
                <td key={colIndex}>{fila[columna]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
  );
}

export default Matriz;