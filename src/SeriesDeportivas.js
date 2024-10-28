import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

function SeriesDeportivas() {
  /*
  /Variables requeridas para guardar elementos necesarios para ejecutar el algoritmo.
  */
  const [datos, setDatos] = useState([]); //Tabla final.
  const [formato, setFormato] = useState([]); //Formato de la serie.
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [partidos, setPartidos] = useState(0); //cantidad de partidos a jugar.
  const [equipoA_L, setEquipoA_L] = useState(0); //Porcentaje de victoria del equipo A como local.
  const [equipoA_V, setEquipoA_V] = useState(0); //Porcentaje de victoria del equipo A como visitante.
  const [equipoB_L, setEquipoB_L] = useState(0); //Porcentaje de victoria del equipo B como local.
  const [equipoB_V, setEquipoB_V] = useState(0); //Porcentaje de victoria del equipo B como visitante.
  const [calc, setCalc] = useState(false); //Confirma cuando se puede realizar el cálculo.
  const navigate = useNavigate();
  const [fileContent, setFileContent] = useState('');
  const fileInputRef = useRef(null);

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
  }

  const guardar = () => {
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
  };


  /*
  \Entradas: No tiene parametros de entrada.
  \Salidas: Modificación del porcentaje de A como local y de B como visitante.
  \Restricciones: No posee restricciones.
  */
  const conversorEntradaL = (e) => {
    const value = e.target.value;
    if (value === '') {
      setEquipoA_L('');
    } else {
      let valorA = (parseFloat(value, 10));
      let valorB = 100 - valorA;
      setEquipoA_L(valorA);
      setEquipoB_V(valorB);
    }
  };

  /*
  \Entradas: No tiene parametros de entrada.
  \Salidas: Modificación del porcentaje de A como visitante y de B como local.
  \Restricciones: No posee restricciones.
  */
  const conversorEntradaV = (e) => {
    const value = e.target.value;
    if (value === '') {
      setEquipoA_V('');
    } else {
      let valorA = (parseFloat(value, 10));
      let valorB = 100 - valorA;
      setEquipoA_V(valorA);
      setEquipoB_L(valorB);
    }
  };

  /*
  \Entradas: Recibe la dimension (dim) necesaria para realizar una tabla cuadrada.
  \Salidas: La tabla inicial del algoritmo, con lo valores del caso base.
  \Restricciones: No posee restricciones.
  */
  const crearInicio = (dim) => {
    let tablaInicial = [];
    for(let i = 0; i<=dim; i++){
      let fila  = [];
      for(let j = 0; j<=dim; j++){
        if(i===0 && j===0){
          fila[j] =- 1;
        }else if(i===0){
          fila[j] = 1;
        }else{
          fila[j] = 0;
        }
      }
      tablaInicial[i] = fila;
    }
    return tablaInicial;
  }

  /*
  \Entradas: Hace el cálculo necesario para cada posición de la tabla, a partir de una tabla inicial.
  \Salidas: La tabla resultante tras aplicar el algoritmo.
  \Restricciones: Todos los valores necesarios para realizar el cálculo fueron introducidos.
  */
  const calcularTabla = () => {
    if(validacionCalculo()){
      const dim = (partidos+1)/2;
      let tabla = crearInicio(dim);
      const eqAL = equipoA_L/100;
      const eqAV = equipoA_V/100;
      const eqBL = equipoB_L/100;
      const eqBV = equipoB_V/100;
      for(let i = 1; i<=dim; i++){
        let valor = 0;
        for(let j = 1; j<=dim; j++){
          let jugados = (dim - i) + (dim - j);
          let local = formato[jugados];
          console.log(local);
          console.log(jugados);
          if(local){
            valor = tabla[i][j-1] * eqBV + tabla[i-1][j] * eqAL;
            let valorRed = parseFloat(valor.toFixed(4))
            tabla[i][j] = valorRed;
          }else{
            valor = tabla[i][j-1] * eqBL + tabla[i-1][j] * eqAV;
            let valorRed = parseFloat(valor.toFixed(4))
            tabla[i][j] = valorRed;
          }
        }
      }
      setDatos(tabla);
      setCalc(true);
    }
  };

  /*
  \Entradas: El valor introducido en el campo de texto que solicita el número de partidos.
  \Salidas: Modifiicación de la cantidad de partidos y de las opciones de formato.
  \Restricciones: No hay restricciones.
  */
  const handleChange = (e) => {
    let partidos = Number(e.target.value);
    setPartidos(partidos);
    let nuevoFormato = [];
    for(let i = 0; i<partidos; i++){
      if(formato[i] !== 1){
        nuevoFormato[i]=0;
      }else{
        nuevoFormato[i]=1;
      }
    }
    setFormato(nuevoFormato);
  };

  /*
  \Entradas: Indice de un checkbox.
  \Salidas: Lista de  checkbox actualizada según la cantidad de partidos.
  \Restricciones: Si el checkbox ya existia lo elimina y si no existia lo agrega.
  */
  const handleCheckboxChange = (index) => {
    if (selectedCheckboxes.includes(index)) {
      setSelectedCheckboxes(selectedCheckboxes.filter(i => i !== index));
      formato[index]=0;
    } else {
      setSelectedCheckboxes([...selectedCheckboxes, index]);
      formato[index]=1;
    }
  };

  /*
  \Entradas: No hay entradas.
  \Salidas: Retorna true si se cumplen todas las condiciones para ejecutar el algoritmo y false en caso contrario.
  \Restricciones: No hay restricciones
  */
  const validacionCalculo = () =>{
    if((equipoA_L/100 > 0 && equipoA_L/100 < 1) && (equipoA_V/100 > 0 && equipoA_V/100 < 1) && (partidos > 0 && partidos%2 !== 0)){
      return true;
    }
    return false;
  }

  const volver = () => {
    navigate('/');
  };

  if (!calc) {
    return (
      <div className="column-container">
      <div className="row-container">
        <button onClick={cargar}>Cargar</button>
        <button onClick={guardar}>Guardar</button>
        <button onClick={volver}>Volver</button>
      </div>

      <label>Equipo A de local:</label>
      <input
        id="numberInput"
        type="number"
        value={equipoA_L}
        onChange={conversorEntradaL}
      />
      <label>Equipo A de visita:</label>
      <input
        id="numberInput"
        type="number"
        value={equipoA_V}
        onChange={conversorEntradaV}
      />
      <label>
        Cantidad de partidos:
        <input
          type="number"
          value={partidos}
          onChange={handleChange}
          min="1"
          max="10"
        />
      </label>

      <div className="checkbox-container">
        {Array.from({ length: partidos }, (_, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`checkbox-${index}`}
              checked={selectedCheckboxes.includes(index)}
              onChange={() => handleCheckboxChange(index)}
            />
            <label>Partido {index + 1}</label>
          </div>
        ))}
      </div>

      <button onClick={calcularTabla}>Calcular</button>
    </div>
    );
  }

  const columnas = Object.keys(datos[0]);
  return (
    <div className="column-container">
    <div className="row-container">
      <button onClick={cargar}>Cargar</button>
      <button onClick={guardar}>Guardar</button>
      <button onClick={volver}>Volver</button>
    </div>
    <label>Equipo A de local:</label>
    <input
      id="numberInput"
      type="number"
      value={equipoA_L}
      onChange={conversorEntradaL}
    />
    <label>Equipo A de visita:</label>
    <input
      id="numberInput"
      type="number"
      value={equipoA_V}
      onChange={conversorEntradaV}
    />
    <label>
      Cantidad de partidos:
      <input
        type="number"
        value={partidos}
        onChange={handleChange}
        min="1"
        max="10"
      />
    </label>

    <div>
      {Array.from({ length: partidos }, (_, index) => (
        <div key={index}>
          <input
            type="checkbox"
            id={`checkbox-${index}`}
            checked={selectedCheckboxes.includes(index)}
            onChange={() => handleCheckboxChange(index)}
          />
          <label>Partido {index + 1}</label>
        </div>
      ))}
    </div>

    <button onClick={calcularTabla}>Calcular</button>
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

export default SeriesDeportivas;