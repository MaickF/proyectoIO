import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Matriz from './Matriz';
import './App.css';

function RutasCortas() {
  /*
  /Variables requeridas para guardar elementos necesarios para ejecutar el algoritmo.
  */
  const [datos, setDatos] = useState([]); //Tablas de distancias.
  const [datos2, setDatos2] = useState([]); //Tablas de rutas
  const [nodos, setNodos] = useState([]); //Nodos y sus distancias
  const [cantidad, setCantidad] = useState(0); //cantidad de nodos
  const [radB, setRadB] = useState(null);//RadioButton seleccionado
  const [calc, setCalc] = useState(false); //Confirma cuando se puede realizar el cálculo.
  const navigate = useNavigate();
  const [fileContent, setFileContent] = useState('');
  const fileInputRef = useRef(null);

  /*
  /Entradas: Un click del mouse, representado por un evento
  /Salidas: El archivo seleccionado abierto
  /Restricciones: Debe seleccionarse un archivo por parte del usuario
  */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.readAsText(file);
    } else {
      alert('Por favor selecciona un archivo de texto (.txt)');
    }
    cargarDatos();
  };

  /*
  /Entradas: No tiene entradas
  /Salidas: Dispara el evento para cargar un archivo.
  /Restricciones: No posee restricciones.
  */
  const cargar = () => {
    fileInputRef.current.click();
  };

  /*
  /Entradas: No tiene entradas
  /Salidas: Toma los datos del archivo abierto y los coloca en las variables correspondientes
  /Restricciones: No posee restricciones.
  */
  const cargarDatos = () => {
    console.log(fileContent);
    let contenido = fileContent.split(',');
    setCantidad(parseInt(contenido[1]));
    setRadB(parseInt(contenido[2]));
    const matriz = contenido[0].split('\n')
    .map(line => line.split(' '))
    .map(arr => arr.filter(word => word !== ''))
    .map(arr => arr.map(word => (word === 'i' ? 'i' : parseInt(word))));
    setNodos(matriz);
  }

  /*
  /Entradas: No tiene entradas
  /Salidas: Guarda los datos del algoritmo en un archivo txt
  /Restricciones: No posee restricciones.
  */
  const guardar = () => {
    const tabla = nodos.map(fila => fila.join(' ')).join('\n');
    const contenido = tabla.concat('\n', ',', cantidad.toString(), ',', radB.toString());
    
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `guardado_${Date.now()}.txt`; 
    link.click();
    
    URL.revokeObjectURL(url);
  };

  /*
  /Entradas: Recibe la cantidad de nodos establecida por el usuario
  /Salidas: Actualiza la cantidad de nodos
  /Restricciones: No posee restricciones.
  */
  const handleCantidad = (e) => {
    const value = e.target.value;
    if(radB===cantidad-1){
      setRadB(null);
    }
    if (value === '') {
      setCantidad('');
    } else {
      let valor = (parseInt(value, 10));
      setCantidad(valor);
      let nuevosNodos = [];
      for(let i = 0; i<valor; i++){
        if(nodos[i]===undefined){
          let nodoDef = [];
          nodoDef[valor-1] = 0;
          nuevosNodos[i] = nodoDef;
        }else{
          nuevosNodos[i] = nodos[i];
        }
      }
      setNodos(nuevosNodos);
    }
  }

  /*
  /Entradas: Recibe dos valores para sumar
  /Salidas: Retorna un valor infinito o uno entero, dependiendo de las entradas de la suma
  /Restricciones: No posee restricciones.
  */
  const suma = (valorA, valorB) => {
    if(valorA==='i' || valorB==='i'){
      return Infinity;
    }else{
      return valorA + valorB;
    }
  }

  /*
  \Entradas: Hace el cálculo necesario para cada posición de la tabla, a partir de una tabla inicial.
  \Salidas: Las tablas resultantes tras aplicar el algoritmo.
  \Restricciones: Todos los valores necesarios para realizar el cálculo fueron introducidos.
  */
  const calcularTabla = () => {
    const respuesta1 = [];
    const respuesta2 =[];
    const P = Array.from({ length: cantidad }, () => Array(cantidad).fill(0));
    const D = nodos.map(fila => [...fila]);
      for (let k = 0; k < cantidad; k++) {
        for (let i = 0; i < cantidad; i++) {
          for (let j = 0; j < cantidad; j++) {
            let actual = D[i][j];
            let sum = suma(D[i][k], D[k][j]);
            if(actual==='i'){
              actual=Infinity;
            }
            if (sum<actual) {
              D[i][j] = sum;
              P[i][j] = k;
            }
          }
        }
        respuesta1.push(D);
        respuesta2.push(P);
      }
      setDatos(respuesta1);
      setDatos2(respuesta2);
      setCalc(true);
  };

  console.log(datos);

  /*
  /Entradas: Dos indices para ubicarse en el nodo correspondiente y el valor del nodo en esa posicion
  /Salidas: La tabla de distancias actualizada
  /Restricciones: No posee restricciones.
  */
  const handleCambio = (index, index2, value) => {
    console.log("ENTRO");
    console.log(index);
    console.log(index2);
    console.log(value);
    if (value === '') {
      let nuevos = [...nodos];
      nuevos[index][index2] = value;
      setNodos(nuevos);
    } else if(value === 'i'){
      let nuevos = [...nodos];
      nuevos[index][index2] = value;
      setNodos(nuevos);
    }else {
      let nuevos = [...nodos];
      let valor = (parseInt(value, 10));
      nuevos[index][index2] = valor;
      setNodos(nuevos);
    }
  };

  /*
  /Entradas: Un indice
  /Salidas: El radiobutton ubicado en el indice
  /Restricciones: No posee restricciones.
  */
  const handleRadioButtons = (index) => {
    setRadB(index);
  }

  /*
  /Navegar atras
  */
  const volver = () => {
    navigate('/');
  };


  //Despliega la interfaz de usuario sin ejecutar el algoritmo
  if (!calc) {
    return (
      <div className="column-container">
        <div className="row-container">
          <button onClick={cargar}>Cargar</button>
          <button onClick={guardar}>Guardar</button>
          <button onClick={volver}>Volver</button>
        </div>
        <input 
        type="file" 
        accept=".txt" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />
      <label>
        Cantidad de nodos:  
        <input 
          type="number" 
          value={cantidad} 
          onChange={handleCantidad}
          min="1" 
          max="10" 
        />
      </label>
      <div>
      <h3>Selecciona un Nodo:</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        {Array.from({ length: cantidad }, (_, index) => (
          <label key={index}>
            <input 
            type="radio" 
            name="opcion" 
            value={index}
            onChange={() =>handleRadioButtons(index)}
             />
            Nodo {index + 1}
          </label>
        ))}
      </div>
      <div>
        {radB !== null && (
        Array.from({ length: cantidad }, (_, index) => (
          index !== radB && (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <label>Nodo {index + 1}: </label>
              <input 
                type="text" 
                id={`textfield1-${index}`} 
                placeholder="Distancia"
                style={{ marginRight: '10px' }}
                value={nodos[radB][index]}
                onChange={(e) => handleCambio(radB, index, e.target.value)}
              />
            </div>
          )
        ))
      )}
    </div>
    </div>
        <button onClick={calcularTabla}>Calcular</button>
    </div>
    );
  }

  //Despliega la interfaz de usuario cuando el algoritmo fue ejecutado.
  return (
    <div className="column-container">
        <div className="row-container">
          <button onClick={cargar}>Cargar</button>
          <button onClick={guardar}>Guardar</button>
          <button onClick={volver}>Volver</button>
        </div>
        <input 
        type="file" 
        accept=".txt" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />
      <label>
        Cantidad de nodos:  
        <input 
          type="number" 
          value={cantidad} 
          onChange={handleCantidad}
          min="1" 
          max="10" 
        />
      </label>
      <div>
      <h3>Selecciona un Nodo:</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        {Array.from({ length: cantidad }, (_, index) => (
          <label key={index}>
            <input 
            type="radio" 
            name="opcion" 
            value={index}
            onChange={() =>handleRadioButtons(index)}
             />
            Nodo {index + 1}
          </label>
        ))}
      </div>
      <div>
        {radB !== null && (
        Array.from({ length: cantidad }, (_, index) => (
          index !== radB && (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <label>Nodo {index + 1}: </label>
              <input 
                type="text" 
                id={`textfield1-${index}`} 
                placeholder="Distancia"
                style={{ marginRight: '10px' }}
                value={nodos[radB][index]}
                onChange={(e) => handleCambio(radB, index, e.target.value)}
              />
            </div>
          )
        ))
      )}
    </div>
    </div>
        <button onClick={calcularTabla}>Calcular</button>
    <div>
      <div style={{ display: 'flex', gap: '40px' }}>
      <div>
      {datos.map((matriz, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h3>Tabla D {index + 1}</h3>
          <Matriz datos={matriz} />
        </div>
      ))}
    </div>
    <div>
      {datos2.map((matriz, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h3>Tabla P {index + 1}</h3>
          <Matriz datos={matriz} />
        </div>
      ))}
    </div>
      </div>
    </div>
    </div>
  );
}

export default RutasCortas;