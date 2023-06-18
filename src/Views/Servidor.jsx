import React, { useEffect, useState } from 'react'

import Formulario from '../components/Formulario'

const Servidor = () => {

  const[lambda,setLambda]=useState('')
  const[mu,setMu]=useState('')
  const[limite,setLimite]=useState('')
  const[datos,setDatos]=useState({})
  const[validacion,setValidacion]=useState(null)


// Ro
const averageUsageOfTheSystem = ( lambda, mu ) => {
  return lambda / mu
}

// Wq
const averageTimeOnQueue = ( lambda, mu ) => {
  return averageNumberOfClientsOnTheQueue( lambda, mu ) / lambda
}

// Ws
const averageTimeOnSystem = ( lambda, mu) => {
  return (1 / (mu - lambda))
}

// Lq
const averageNumberOfClientsOnTheQueue = ( lambda, mu ) => {
  return ((lambda ** 2) / (mu * (mu - lambda)));
}

// Ls
const averageNumberOfClientsOnTheSystem = ( lambda, mu ) => {
  return (lambda / (mu - lambda));
}

// Po
const chanceTheSystemIsEmpty = ({ usageOfTheSystem }) => {
  return 1 - usageOfTheSystem;
}

// Pn
const chanceTheyAreOnSystem = ({ clientsAmount, usageOfTheSystem }) => {

  return ((1 - usageOfTheSystem) * (usageOfTheSystem ** clientsAmount))
}

// n + Pn + Pn Accumulated 
const chanceTheyAreOnSystemDetails = ({ clientsAmount = 100, usageOfTheSystem }) => {
  const result = []
  let counter = 0;
  let accumulated = 0;
  while (counter < clientsAmount) {
    const chance = chanceTheyAreOnSystem({ clientsAmount: counter, usageOfTheSystem })
    accumulated += chance;
    result.push({ n: counter, Pn: chance, PnAccumulated: accumulated });
    counter++;

    if (Number(chance.toFixed(4)) === 0) break;
  }

  return result;
}


// Wq
const averageTimeOnQueueWithLimit = ({ usageOfTheSystem, limite, lambda, mu }) => {
  return (averageNumberOfClientsOnTheQueueWithLimit({ usageOfTheSystem, limite, lambda, mu }) / chanceToEnterTheSystem({ lambda, usageOfTheSystem, limite }))
}

// Ws
const averageTimeOnSystemWithLimit = ({ usageOfTheSystem, limite, lambda, mu }) => {
  return (averageTimeOnQueueWithLimit({ usageOfTheSystem, limite, lambda, mu }) + (1 / mu));
}

// Lq
const averageNumberOfClientsOnTheQueueWithLimit = ({ usageOfTheSystem, limite, lambda, mu }) => {
  return (averageNumberOfClientsOnTheSystemWithLimit({ usageOfTheSystem, limite }) - (chanceToEnterTheSystem({ lambda, usageOfTheSystem, limite }) / mu));
}

// λef
const chanceToEnterTheSystem = ({ lambda, usageOfTheSystem, limite }) => {
  return (lambda * (1 - chanceTheyAreOnSystemWithLimit({ clientsAmount: limite, usageOfTheSystem, limite })));
}

// Ls
const averageNumberOfClientsOnTheSystemWithLimit = ({ usageOfTheSystem, limite }) => {

  if (usageOfTheSystem !== 1) {
    return ((usageOfTheSystem * (1 - ((limite + 1) * (usageOfTheSystem ** limite)) + (limite * (usageOfTheSystem ** (limite + 1))))) / ((1 - usageOfTheSystem) * (1 - (usageOfTheSystem ** (limite + 1)))))
  }

  return (limite / 2);
}

// Po
const chanceTheSystemIsEmptyWithLimit = ({ usageOfTheSystem, limite }) => {
  if (usageOfTheSystem !== 1) {
    return ((1 - usageOfTheSystem) / (1 - (usageOfTheSystem ** (limite + 1))));
  }

  return (1 / (limite + 1));
}

// Pn
const chanceTheyAreOnSystemWithLimit = ({ clientsAmount, usageOfTheSystem, limite }) => {
  if (clientsAmount <= limite) {
    const chanceIsEmpty = chanceTheSystemIsEmptyWithLimit({ usageOfTheSystem, limite });

    return ((usageOfTheSystem ** clientsAmount) * chanceIsEmpty);
  }

  return 0;
}

// n + Pn + Pn Accumulated 
const chanceTheyAreOnSystemDetailsWithLimit = ({ usageOfTheSystem, limite }) => {
  const result = []


  if (usageOfTheSystem !== 1) {
    let counter = 0;
    let accumulated = 0;
    while (counter <= limite) {
      const chance = chanceTheyAreOnSystemWithLimit({ clientsAmount: counter, usageOfTheSystem, limite });
      accumulated += chance;
      result.push({ n: counter, Pn: chance, PnAccumulated: accumulated });
      counter++;
    }
  } else {
    const chance = (1 / (limite + 1));
    result.push({ n: 1, Pn: chance, PnAccumulated: chance });
  }

  return result;
}

const oneServerWithNoLimit = () => {
  const usageOfTheSystem = averageUsageOfTheSystem(lambda, mu );
  const timeOnSystem = averageTimeOnSystem( lambda, mu );
  const numberOfClientsOnTheQueue = averageNumberOfClientsOnTheQueue(lambda, mu );
  const timeOnQueue = averageTimeOnQueue( lambda, mu );
  const numberOfClientsOnTheSystem = averageNumberOfClientsOnTheSystem(lambda, mu );
  const chanceTheyAre = chanceTheyAreOnSystemDetails({ usageOfTheSystem });
  setDatos({
    ...datos,
    ρ:usageOfTheSystem.toFixed(6),
    Ws:timeOnSystem.toFixed(6),
    Lq:numberOfClientsOnTheQueue.toFixed(6),
    Wq:timeOnQueue.toFixed(6),
    Ls:numberOfClientsOnTheSystem.toFixed(6),
    Pn:chanceTheyAre,
  })
  
}

const oneServerWithLimit = () => {
  const usageOfTheSystem = averageUsageOfTheSystem( lambda, mu);
  const numberOfClientsOnTheSystem = averageNumberOfClientsOnTheSystemWithLimit({ usageOfTheSystem, limite });
  const numberOfClientsOnTheQueue = averageNumberOfClientsOnTheQueueWithLimit({ usageOfTheSystem, limite, lambda, mu });
  const timeOnSystem = averageTimeOnSystemWithLimit({ usageOfTheSystem, limite, lambda, mu });
  const timeOnQueue = averageTimeOnQueueWithLimit({ usageOfTheSystem, limite, lambda, mu });
  const chanceTheyAre = chanceTheyAreOnSystemDetailsWithLimit({ usageOfTheSystem, limite });

  setDatos({
    ...datos,
    ρ:usageOfTheSystem.toFixed(6),
    Ws:timeOnSystem.toFixed(6),
    Lq:numberOfClientsOnTheQueue.toFixed(6),
    Wq:timeOnQueue.toFixed(6),
    Ls:numberOfClientsOnTheSystem.toFixed(6),
    Pn:chanceTheyAre,
  })
}




  function handleNum1Change(event) {
    setLambda(Number(event.target.value));
  }

  function handleNum2Change(event) {
    setMu(Number(event.target.value));
  }

  function handleNum4Change(event) {
    setLimite(Number(event.target.value));
  }

  const handleClick=(e)=>{
    e.preventDefault()
    if(lambda===0 || mu===0 && (limite===0 || limite==='')){
      setValidacion('lambda o miu no pueden ser igual a 0')
  }else if(lambda===0 || mu===0){
    setValidacion('lambda o miu no pueden ser igual a 0')
  } else if(lambda>mu && (limite===0 || limite==='')){
    setValidacion('lambda no puede ser mayor que mu')
  }
  else{
    limite===0 || limite==='' ? oneServerWithNoLimit() : oneServerWithLimit()
  }
        
  }


  useEffect(() => {
    setValidacion(null)
  }, [datos])


  return (
    <div className='h-screen bg-slate-50'>
        <h2 className='text-center text-xl py-2'>Un servidor</h2>
        <div className='flex justify-center'>
          <div className='grid grid-cols-3 rounded p-4  bg-slate-400'>
            <div className='col-span-3 text-center pb-2 text-xl'><h2>Calculadora</h2></div>
            <input type='number' className='border mx-5 my-2 py-1 px-1 rounded' value={lambda} onChange={handleNum1Change} placeholder='lambda...' required/>
            <input type='number' className='border mx-5 my-2 py-1 px-1 rounded'  value={mu} onChange={handleNum2Change} placeholder='mu...' required/>
            <input type='number' className='border mx-5 my-2 py-1 px-1 rounded'  value={limite} onChange={handleNum4Change} placeholder='limite...' required/>
            <div className='flex justify-center col-span-3 py-2'><button onClick={handleClick} className='bg-sky-200 px-8 text-lg rounded text-black py-2'>Calculo</button></div>
          </div>
        </div>
        <div>
{          validacion ?  <p className='bg-red-300 text-red-950 text-3xl text-center font-bold py-4'>{validacion}</p>:  <div className='grid grid-cols-2 my-5'> <ul className='flex'>
            <li className='text-lg px-3 border border-black rounded h-min my-2 mx-4'>ρ: {datos.ρ}</li>
            <li className='text-lg px-3 border border-black rounded h-min my-2 mx-4'>Ws: {datos.Ws}</li>
            <li className='text-lg px-3 border border-black rounded h-min my-2 mx-4'>Wq: {datos.Wq}</li>
            <li className='text-lg px-3 border border-black rounded h-min my-2 mx-4'>Ls: {datos.Ls}</li>
            <li className='text-lg px-3 border border-black rounded h-min my-2 mx-4'>Lq: {datos.Lq}</li>
          </ul>
          <div className=' h-96 overflow-y-scroll  font-bold border border-black '>
                <div className='grid grid-cols-5 w-full bg-slate-200 text-center '>
                    <p className='col-span-1 border-black'>n</p>
                    <p className='col-span-2 border-black'>Pn</p>
                    <p className='col-span-2'>Accumulated</p>
                </div>
                <div className='flex flex-col w-full '>
                    {datos.Pn?.map((el)=><div key={el.n} className=' text-sm grid grid-cols-5 text-center border-b border-black'><p className='border-x col-span-1 border-black'>{el.n}</p> <p className='border-x col-span-2 overflow-hidden px-1 border-black'>{el.Pn.toFixed(3)}</p> <p className='col-span-2 overflow-hidden px-1'>{el.PnAccumulated.toFixed(3)}</p></div>)}
                </div> </div> </div>}
        </div>
        <h2 className='text-center text-2xl py-4'>Realizado por: Ivana Millan C.I 27.650.511</h2>
    </div>
  )
}

export default Servidor