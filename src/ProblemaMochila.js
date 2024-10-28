import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

function ProblemaMochila() {
  /*
  /Variables requeridas para guardar elementos necesarios para ejecutar el algoritmo.
  */
  const [datos, setDatos] = useState([]); //Tabla donde se imprime el resultado del algoritmo.
  const [datos2, setDatos2] = useState([]); //Tabla que almacena la cantidad de objetos usados por cada posicion.
  const [objetos, setObjetos] = useState([]); //Lista de objetos creados a partir de las entradas del usuario.
  const [capacidad, setCapacidad] = useState(0); //Capacidad de la mochila.
  const [cantidad, setCantidad] = useState(0); //Cantidad de objetos generados.
  const [calc, setCalc] = useState(false); //Variable que confirma cuando se puede realizar el calculo.
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
    cargarDatos();
  };

  const cargarDatos = () => {
    console.log(fileContent);
    let contenido = fileContent.split(',');
    setCantidad(Number(contenido[1]));
    setCapacidad(Number(contenido[2]));
    const matriz = contenido[0].split('\n')
    .map(line => line.split(' '))
    .map(arr => arr.filter(word => word !== ''))
    .map(arr => arr.map(word => (word === 'i' ? 'i' : parseInt(word))));
    setObjetos(matriz);
  }

  const cargar = () => {
    fileInputRef.current.click();
  };

  const guardar = () => {
    const tabla = objetos.map(fila => fila.join(' ')).join('\n');
    const contenido = tabla.concat('\n', ',', cantidad.toString(), ',', capacidad.toString());
    
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `guardado_${Date.now()}.txt`; // Nombre único usando timestamp
    link.click();
    
    URL.revokeObjectURL(url);
  };

  /*
  \Entradas: la capacidad establecida por el usuario.
  \Salidas: Modificación de la capacidad de la mochila.
  \Restricciones: No posee restricciones.
  */
  const handleCapacidad = (e) => {
    const value = e.target.value;
    if (value === '') {
      setCapacidad('');
    } else {
      let valor = (parseInt(value, 10));
      setCapacidad(valor);
    }
  };

  /*
  \Entradas: Indices del objeto y del atributo (los objetos son vectores con 3 elementos por objeto).
  \Salidas: Modifica uno de los atributos (valor, costo, cantidad) del objetos selecciionado
  \Restricciones: No posee restricciones.
  */
  const handleCambio = (index, index2, value) => {
    if (value === '') {
      let nuevos = [...objetos];
      nuevos[index][index2] = value;
      setObjetos(nuevos);
    } else if(value === 'i'){
      let nuevos = [...objetos];
      nuevos[index][index2] = value;
      setObjetos(nuevos);
    }else {
      let nuevos = [...objetos];
      let valor = (parseInt(value, 10));
      nuevos[index][index2] = valor;
      setObjetos(nuevos);
    }
  };

  /*
  \Entradas: cantidad seleccionada por el usuario.
  \Salidas: Modificación de la cantidad de objetos.
  \Restricciones: No posee restricciones.
  */
  const handleCantidad = (e) => {
    const value = e.target.value;
    if (value === '') {
      setCantidad('');
    } else {
      let valor = (parseInt(value, 10));
      setCantidad(valor);
      let nuevosObjetos = [];
      for(let i = 0; i<valor; i++){
        if(objetos[i]===undefined){
          let objDef = [i, "", "", ""];
          nuevosObjetos[i] = objDef;
        }else{
          nuevosObjetos[i] = objetos[i];
        }
      }
      setObjetos(nuevosObjetos);
    }
  };

  /*
  \Entradas: No tiene parametros de entrada.
  \Salidas: Crea una tabla inicial para ejecutar el algoritmo. Dicha tabla solo tiene 0 en sus posiciones y los encabezados de cada fila y columna.
  \Restricciones: No posee restricciones.
  */
  const crearTablaInicial = () => {
    let tabla = [];
    for (let i = 0; i <= capacidad+1; i++) {
      let fila = [];
      for (let j = 0; j <= cantidad; j++) {
        if (i === 0 && j === 0) {
          fila[j] = "";
        } else if (j === 0) {
          fila[j] = i - 1;
        } else if (i === 0) {
          fila[j] = "objeto" + j;
        } else {
          fila[j] = 0;
        }
      }
      tabla[i] = fila;
    }
    return tabla;
  }

  /*
  /Entradas:
  / valor: valor del objeto actual.
  / costo: costo del objeto actual.
  / cantidad: copias del objeto actual.
  / tabla: tabla con los valores actuales.
  / posI: columna del objeto actual.
  / posJ: fila del objeto actual.
  / capacidad: capacidad máxima que soporta la tabla en la posición actual.
  \Salidas: Una lista con vectores cuyas posiciones son:
  / 1. El posible valor de ese objeto.
  / 2. La cantidad de copias utilizadas para obtener ese valor.
  / EN RESUMEN, esta función retorna los "contendientes" que compiten por esa posición de la tabla.
  \Restricciones: No posee restricciones.
  */
  const listaValores = (valor, costo, cantidad, tabla, posI, posJ, capacidad) => {
    let respuesta = [];
    let valorActual = tabla[posJ][posI-1]
    respuesta[0] = [valorActual, 0];
    if(cantidad === 'i'){
      let i = 1;
      let salir = true;
      while(salir){
        if((costo*i)>capacidad){
          salir = false;
        }else{
          let opcion = (i*valor)+ (tabla[posJ-(costo*i)][posI-1]);
          respuesta[i] = [opcion, i];
          i++;
        }
      }
    }else{
      for(let i = 1; i<=cantidad; i++){
        if((costo*i)>capacidad){
          break;
        }else{
          let opcion = (i*valor)+ (tabla[posJ-(costo*i)][posI-1]);
          respuesta[i] = [opcion, i];
        }
      }
    }
    return respuesta;
  }

  /*
  \Entradas: valor del objeto actual, costo del objeto actual, cantidad de copias del objeto actual, capacidad de la tabla en la posición actual.
  \Salidas: El valor maximo de la posición actual. Como se trata de la primera columna, la evaluación es de solo un objeto.
  \Restricciones: No posee restricciones.
  */
  const primeraColumna = (valor, costo, cantidad, capacidad) => {
    let temp = 0;
    let cont = 0;
    if(cantidad === 'i'){
      let salir = true;
      let i = 1;
      while(salir){
        if((costo*i)>capacidad){
          salir = false;
        }else{
          temp += valor;
          cont += 1;
          i++;
        }
      }
    }else{
      for(let i = 1; i<=cantidad; i++){
        if((costo*i)>capacidad){
          break;
        }else{
          temp += valor;
          cont += 1;
        }
      }
    }
    let respuesta = [temp, cont];
    return respuesta;
  }

  /*
  \Entradas: La lista de posibles opciones para la posicion actual
  \Salidas: La opción con el valor mayor.
  \Restricciones: No posee restricciones.
  */
  const max = (listaOpciones) => {
    let mayor = 0;
    let indice = 0;
    for(let i = 0; i<listaOpciones.length; i++){
      let valorActual = listaOpciones[i][0];
      if(valorActual>=mayor){
        mayor = valorActual;
        indice = i;
      }
    }
    let resultado = listaOpciones[indice];
    return resultado;
  }

  /*
  \Entradas: No tiene entradas.
  \Salidas: Recorre toda la tabla, llenando las posiciones con los valores correspondientes.
  \Restricciones: No posee restricciones.
  */
  const calcularTabla = () => {
    let tabla = crearTablaInicial();
    let tabla2 = tabla.map(subArray => [...subArray]);
    for(let i = 1; i<=cantidad; i++){
      for(let j = 1; j<=capacidad+1; j++){
        let objetoActual = objetos[i-1];
        let costo = objetoActual[1];
        let valor = objetoActual[2];
        let cantidad = objetoActual[3];
        if(i===1){
          let posActual = primeraColumna(valor, costo, cantidad, j-1);
          tabla[j][i] = posActual[0];
          tabla2[j][i] = posActual[1];
        }else{
          let opciones = listaValores(valor, costo, cantidad, tabla, i, j, j-1);
          let posActual = max(opciones);
          tabla[j][i] = posActual[0];
          tabla2[j][i] = posActual[1];
        }
      }
    }
    setDatos(tabla);
    setDatos2(tabla2);
    setCalc(true);
  }

  const volver = () => {
    navigate('/');
  };


  if (!calc) {
    return (
      <div className='column-container'>
        <div className='row-container'>
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
      <label>Capacidad de mochila: </label>
      <input
        id="numberInput"
        type="number"
        value={capacidad}
        onChange={handleCapacidad}
        min="0" 
        max="20" 
      />
      <label>Cantidad de objetos: </label>
      <input
        id="numberInput"
        type="number"
        value={cantidad}
        onChange={handleCantidad}
        min="1" 
        max="10" 
      />
      <div>
        {Array.from({ length: cantidad }, (_, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <label htmlFor={`textfield1-${index}`}>Objeto {index + 1}: </label>
          <input 
            type="text" 
            id={`textfield1-${index}`} 
            placeholder={`Costo`}
            style={{ marginRight: '10px' }}
            value = {objetos[index][1]}
            onChange={ (e) => handleCambio(index, 1, e.target.value)}
          />
          <input 
            type="text" 
            id={`textfield2-${index}`} 
            placeholder={`Valor`}
            style={{ marginRight: '10px' }}
            value = {objetos[index][2]}
            onChange={ (e) => handleCambio(index, 2, e.target.value)}
          />
          <input 
            type="text" 
            id={`textfield2-${index}`} 
            placeholder={`Cantidad`}
            value = {objetos[index][3]}
            onChange={ (e) => handleCambio(index, 3, e.target.value)}
          />
        </div>  
        ))}
      </div>
        <button onClick={calcularTabla}>Calcular</button>
      </div>
    );
  }

  return (
    <div className='column-container'>
      <div className='row-container'>
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
      <label>Capacidad de mochila: </label>
      <input
        id="numberInput"
        type="number"
        value={capacidad}
        onChange={handleCapacidad}
        min="0" 
        max="20" 
      />
      <label>Cantidad de objetos: </label>
      <input
        id="numberInput"
        type="number"
        value={cantidad}
        onChange={handleCantidad}
        min="1" 
        max="10" 
      />
      <div>
        {Array.from({ length: cantidad }, (_, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <label htmlFor={`textfield1-${index}`}>Objeto {index + 1}: </label>
          <input 
            type="text" 
            id={`textfield1-${index}`} 
            placeholder={`Costo`}
            style={{ marginRight: '10px' }}
            value = {objetos[index][1]}
            onChange={ (e) => handleCambio(index, 1, e.target.value)}
          />
          <input 
            type="text" 
            id={`textfield2-${index}`} 
            placeholder={`Valor`}
            style={{ marginRight: '10px' }}
            value = {objetos[index][2]}
            onChange={ (e) => handleCambio(index, 2, e.target.value)}
          />
          <input 
            type="text" 
            id={`textfield2-${index}`} 
            placeholder={`Cantidad`}
            value = {objetos[index][3]}
            onChange={ (e) => handleCambio(index, 3, e.target.value)}
          />
        </div>  
        ))}
      </div>
      <button onClick={calcularTabla}>Calcular</button>
      <div style={{ display: 'flex', gap: '40px' }}>
        <div className='table-container'>
      <h3>Tabla Valores</h3>
        <table className='table'>
        <tbody>
        {datos.map((fila, filaIndex) => (
          <tr key={filaIndex}>
            {fila.map((celda, colIndex) => (
              <td
                key={colIndex}
                style={{
                  backgroundColor: (filaIndex > 0 && colIndex > 0) 
                  ? (Number(datos2[filaIndex][colIndex]) > 0 ? 'green' : 'red') 
                  : ''  // No color for headers
                }}
              >
                {celda}
              </td>
            ))}
          </tr>
        ))}
        </tbody>
        </table>
      </div>
      <div className='table-container'>
      <h3>Tabla Cantidades</h3>
        <table className='table'>
        <tbody>
        {datos2.map((fila, filaIndex) => (
          <tr key={filaIndex}>
            {fila.map((celda, colIndex) => (
              <td
                key={colIndex}
                style={{
                  backgroundColor: (filaIndex > 0 && colIndex > 0) 
                  ? (Number(datos2[filaIndex][colIndex]) > 0 ? 'green' : 'red') 
                  : ''  // No color for headers
                }}
              >
                {celda}
              </td>
            ))}
          </tr>
        ))}
        </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}

export default ProblemaMochila;