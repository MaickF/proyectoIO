import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

function Arboles() {
  /*
  /Variables requeridas para guardar elementos necesarios para ejecutar el algoritmo.
  */
  const [datos, setDatos] = useState([]); //Tabla final.
  const [llaves, setLlaves] = useState([]); //Formato de la serie.
  const [cantidad, setCantidad] = useState(0); //cantidad de partidos a jugar.
  const [calc, setCalc] = useState(false); //Variable que confirma cuando se puede realizar el calculo.
  const navigate = useNavigate();
  const [fileContent, setFileContent] = useState('');
  const fileInputRef = useRef(null);

  /*const handleFileChange = (event) => {
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
    setTimeout(() => {
    }, 2000);
    cargarDatos();
  };

  const cargar = () => {
    fileInputRef.current.click();
  };

  const cargarDatos = () =>{
    let contenido = fileContent.split('\n');
    console.log(contenido);
    let d1 = contenido[0].split(',');
    let d2 = contenido[1].split(',');
    setPartidos(parseInt(d1[0]));
    setEquipoA_L(parseFloat(d1[1]));
    setEquipoA_V(parseFloat(d1[2]));
    setEquipoB_L(parseFloat(d1[3]));
    setEquipoB_V(parseFloat(d1[4]));
    let f = [];
    for(let i = 0; i<d2.length; i++){
      let valor = (d2[i] === '1');
      f[i] = valor;
    }
    console.log(f);
    setFormato(f);
  }*/

  /*const guardar = () => {
    const contenido = partidos.toString();
    let guardado = contenido.concat(",", equipoA_L.toString(),"," ,equipoA_V.toString(), ",",equipoB_L.toString(), ",",equipoB_V.toString(), "\n");
    for(let i=0; i<formato.length; i++){
      let actual = formato[i].toString();
      guardado += actual;
      if(i!=formato.length-1){
        guardado += ",";
      }
    }
    const blob = new Blob([guardado], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `matriz_${Date.now()}.txt`; 
    link.click();
        URL.revokeObjectURL(url);
  };*/

  const handleCantidad = (e) => {
    const value = e.target.value;
    if (value === '') {
      setCantidad('');
    } else {
      let valor = (parseInt(value, 10));
      setCantidad(valor);
      let nuevaLlave = [];
      for(let i = 0; i<valor; i++){
        if(llaves[i]===undefined){
          let llaveDef = [];
          nuevaLlave[i] = llaveDef;
        }else{
          nuevaLlave[i] = llaves[i];
        }
      }
      setLlaves(nuevaLlave);
    }
  }

  const handleCambio = (index, index2, value) => {
    if (value === '') {
      let nuevos = [...llaves];
      nuevos[index][index2] = value;
      setLlaves(nuevos);
    } else if(isNaN(value)){
      let nuevos = [...llaves];
      nuevos[index][index2] = value;
      setLlaves(nuevos);
    }else {
      let nuevos = [...llaves];
      let valor = (parseFloat(value, 10));
      nuevos[index][index2] = valor;
      setLlaves(nuevos);
    }
  }
  console.log(llaves);

  /*
  \Entradas: Recibe la dimension (dim) necesaria para realizar una tabla cuadrada.
  \Salidas: La tabla inicial del algoritmo, con lo valores del caso base.
  \Restricciones: No posee restricciones.
  */
  const crearInicio = () => {
    const llavesOrdenadas = llaves.sort((a, b) => {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
      });
      
    let tablaInicial = [];
    const sumaTotal = llavesOrdenadas.reduce((acumulador, fila) => acumulador + fila[1], 0);
    for(let i = 0; i<=cantidad; i++){
      let fila  = [];
      for(let j = 0; j<=cantidad; j++){
        if(i===j){
            fila[j] = 0;
        }else if(i===j-1){
            let valorRed = parseFloat(((llavesOrdenadas[i][1])/sumaTotal).toFixed(4))
            fila[j] = valorRed;
        }else{
            fila[j] = null;
        }
      }
      tablaInicial[i] = fila;
    }
    setDatos(tablaInicial);
    setCalc(true);
    console.log(tablaInicial);
    return tablaInicial;
  }

  /*
  \Entradas: Hace el cálculo necesario para cada posición de la tabla, a partir de una tabla inicial.
  \Salidas: La tabla resultante tras aplicar el algoritmo.
  \Restricciones: Todos los valores necesarios para realizar el cálculo fueron introducidos.
  */
  const calcularTabla = () => {
      let tablaInicial = crearInicio();
      let fila = 0;
      let columna = 2;
      while(columna!=cantidad && fila!=1){
        while(columna!=cantidad+1){
            
        }

      }
  }

  const minimo = (valores) => {
    const valorMinimo = Math.min(...valores);
    return valorMinimo;
  }

  const volver = () => {
    navigate('/');
  };

  if (!calc) {
    return (
      <div className="column-container">
      <div className="row-container">
        <button onClick={volver}>Volver</button>
      </div>
      <input 
        type="file" 
        accept=".txt" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
      />
      <label>
        Cantidad de Llaves:
        <input
          type="number"
          value={cantidad}
          onChange={handleCantidad}
          min="1"
          max="10"
        />
      </label>

      <div>
        {Array.from({ length: cantidad }, (_, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <label htmlFor={`textfield1-${index}`}>Llave {index + 1}: </label>
          <input 
            type="text" 
            id={`textfield1-${index}`} 
            placeholder={`Nombre`}
            style={{ marginRight: '10px' }}
            value = {llaves[index][0]}
            onChange={ (e) => handleCambio(index, 0, e.target.value)}
          />
          <input 
            type="text" 
            id={`textfield2-${index}`} 
            placeholder={`Valor`}
            style={{ marginRight: '10px' }}
            value = {llaves[index][1]}
            onChange={ (e) => handleCambio(index, 1, e.target.value)}
          />
        </div>  
        ))}
      </div>

      <button onClick={crearInicio}>Calcular</button>
    </div>
    );
  }

  const columnas = Object.keys(datos[0]);
  return (
    <div className="column-container">
    <div className="row-container">
        <button onClick={volver}>Volver</button>
      </div>
      <input 
        type="file" 
        accept=".txt" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
      />
      <label>
        Cantidad de Llaves:
        <input
          type="number"
          value={cantidad}
          onChange={handleCantidad}
          min="1"
          max="10"
        />
      </label>

      <div>
        {Array.from({ length: cantidad }, (_, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <label htmlFor={`textfield1-${index}`}>Llave {index + 1}: </label>
          <input 
            type="text" 
            id={`textfield1-${index}`} 
            placeholder={`Nombre`}
            style={{ marginRight: '10px' }}
            value = {llaves[index][0]}
            onChange={ (e) => handleCambio(index, 0, e.target.value)}
          />
          <input 
            type="text" 
            id={`textfield2-${index}`} 
            placeholder={`Valor`}
            style={{ marginRight: '10px' }}
            value = {llaves[index][1]}
            onChange={ (e) => handleCambio(index, 1, e.target.value)}
          />
        </div>  
        ))}
      </div>

    <button onClick={crearInicio}>Calcular</button>
    <h3>Tabla</h3>
    <div className="table-container">
      <table className="table">
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
  </div>
  );
}

export default Arboles;