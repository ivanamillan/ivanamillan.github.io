import React, { useState,useEffect } from 'react'

const VariosServidores = () => {

  const[lambda,setLambda]=useState('')
  const[mu,setMu]=useState('')
  const[servidores,setServidores]=useState('')
  const[limite,setLimite]=useState('')
  const[datos,setDatos]=useState({})
  const[validacion,setValidacion]=useState(null)

  const factorial = n => n ? (n * factorial(n - 1)) : 1;

  // Ro
  const averageUsageOfTheSystem = (lambda, mu ) => {
    return lambda / mu
  }
  
  // Wq
  const averageTimeOnQueue = ({ lambda, mu, usageOfTheSystem, servidores }) => {
    return (averageNumberOfClientsOnTheQueue({ lambda, mu, usageOfTheSystem, servidores }) / lambda)
  }
  
  // Ws
  const averageTimeOnSystem = ({ lambda, mu, usageOfTheSystem, servidores }) => {
    return (averageTimeOnQueue({ lambda, mu, usageOfTheSystem, servidores }) + (1 / mu));
  }
  
  // Lq
  const averageNumberOfClientsOnTheQueue = ({ lambda, mu, usageOfTheSystem, servidores }) => {
    return (((servidores * usageOfTheSystem) / ((servidores - usageOfTheSystem) ** 2)) * chanceTheyAreOnTheSystem({ clientsAmount: servidores, lambda, mu, usageOfTheSystem, servidores }))
  }
  
  // Ls
  const averageNumberOfClientsOnTheSystem = ({ lambda, mu, usageOfTheSystem, servidores }) => {
    return (averageNumberOfClientsOnTheQueue({ lambda, mu, usageOfTheSystem, servidores }) + usageOfTheSystem)
  }
  
  // Po
  const chanceTheSystemIsEmpty = ({ lambda, mu, usageOfTheSystem, servidores }) => {
    let counter = 0;
    const CONSTANT_CHANCE = (((usageOfTheSystem ** servidores) / (factorial(servidores) * (1 - (usageOfTheSystem / servidores)))));
    let totalSumChance = 0;
    while (counter < servidores) {
      totalSumChance += ((usageOfTheSystem ** counter) / factorial(counter));
      counter++;
    }
  
    const result = (totalSumChance + CONSTANT_CHANCE) ** -1;
    return result;
  }
  
  // Pn
  const chanceTheyAreOnTheSystem = ({ clientsAmount, lambda, mu, usageOfTheSystem, servidores }) => {
  
    if (clientsAmount > servidores) {
      return (((usageOfTheSystem ** clientsAmount)) / ((servidores ** (clientsAmount - servidores)) * factorial(servidores)) * chanceTheSystemIsEmpty({ lambda, mu, usageOfTheSystem, servidores }))
    }
  
    return (((usageOfTheSystem ** clientsAmount)) / (factorial(clientsAmount)) * chanceTheSystemIsEmpty({ lambda, mu, usageOfTheSystem, servidores }))
  
  }
  
  // n + Pn + Pn Accumulated 
  const chanceTheyAreOnSystemDetails = ({ clientsAmount = 100, lambda, mu, usageOfTheSystem, servidores }) => {
    const result = []
    let counter = 0;
    let accumulated = 0;
    while (counter < clientsAmount) {
      const chance = chanceTheyAreOnTheSystem({ clientsAmount: counter, lambda, mu, usageOfTheSystem, servidores })
      accumulated += chance;
      result.push({ n: counter, Pn: chance, PnAccumulated: accumulated });
      counter++;
  
      if (Number(chance.toFixed(4)) === 0) break;
    }
  
    return result;
  }


// Wq
const averageTimeOnQueueWithLimit = ({ lambda, mu, usageOfTheSystem, servidores, limite }) => {
  return (averageNumberOfClientsOnTheQueueWithLimit({ lambda, mu, servidores, limite, usageOfTheSystem }) / lambda);
}

// Ws
const averageTimeOnSystemWithLimit = ({ lambda, mu, usageOfTheSystem, servidores, limite }) => {
  return (averageTimeOnQueueWithLimit({ lambda, mu, servidores, limite, usageOfTheSystem }) + (1 / mu));
}

// Lq
const averageNumberOfClientsOnTheQueueWithLimit = ({ lambda, mu, usageOfTheSystem, servidores, limite }) => {
  if (usageOfTheSystem / servidores === 1) {
    return (chanceTheSystemIsEmptyWithLimit({ lambda, mu, servidores, limite, usageOfTheSystem }) * (((usageOfTheSystem ** servidores) * (limite - servidores) * (limite - servidores + 1)) / (2 * factorial(servidores))))
  }

  return (chanceTheSystemIsEmptyWithLimit({ lambda, mu, servidores, limite, usageOfTheSystem }) * ((usageOfTheSystem ** (servidores + 1)) / (factorial(servidores - 1) * ((servidores - usageOfTheSystem) ** 2))))
}

// Ls
const averageNumberOfClientsOnTheSystemWithLimit = ({ lambda, mu, usageOfTheSystem, servidores, limite }) => {
  return (averageNumberOfClientsOnTheQueueWithLimit({ lambda, mu, servidores, limite, usageOfTheSystem }) + (chanceToEnterTheSystem({ lambda, mu, servidores, limite, usageOfTheSystem }) / mu))
}

// λef
const chanceToEnterTheSystem = ({ lambda, mu, usageOfTheSystem, servidores, limite }) => {
  return (lambda * (1 - (chanceTheyAreOnTheSystemWithLimit({ lambda, mu, servidores, limite, usageOfTheSystem, clientsAmount: limite }))))
}

// Po
const chanceTheSystemIsEmptyWithLimit = ({ lambda, mu, usageOfTheSystem, servidores, limite }) => {
  let CONSTANT_CHANCE = 0;
  if (usageOfTheSystem / servidores === 1) {
    CONSTANT_CHANCE = (((usageOfTheSystem ** servidores) / factorial(servidores)) * (limite - servidores + 1));
  } else {
    CONSTANT_CHANCE = (((usageOfTheSystem ** servidores) * ((1 - (usageOfTheSystem / servidores) ** (limite - servidores + 1))) / (factorial(servidores) * (1 - (usageOfTheSystem / servidores)))))
  }

  let counter = 0;
  let totalSumChance = 0;
  while (counter < servidores) {
    totalSumChance += ((usageOfTheSystem ** counter) / factorial(counter))
    counter++;
  }

  return (totalSumChance + CONSTANT_CHANCE) ** -1;
}

// Pn
const chanceTheyAreOnTheSystemWithLimit = ({ clientsAmount, lambda, mu, usageOfTheSystem, servidores, limite }) => {
  if (clientsAmount >= 0 && clientsAmount <= servidores) {
    return (((usageOfTheSystem ** clientsAmount) / (factorial(clientsAmount))) * chanceTheSystemIsEmptyWithLimit({ lambda, mu, usageOfTheSystem, servidores, limite }))
  } else {
    return (((usageOfTheSystem ** clientsAmount) / ((factorial(servidores)) * (servidores ** (clientsAmount - servidores)))) * chanceTheSystemIsEmptyWithLimit({ lambda, mu, usageOfTheSystem, servidores, limite }))
  }
}

// Pw
const chanceToWaitOutside = ({ lambda, mu, usageOfTheSystem, servidores, limite }) => {
  return ((1 / factorial(servidores)) * (usageOfTheSystem ** servidores) * (servidores / (servidores - usageOfTheSystem)) * chanceTheSystemIsEmptyWithLimit({ lambda, mu, usageOfTheSystem, servidores, limite }))
}


// n + Pn + Pn Accumulated 
const chanceTheyAreOnSystemDetailsWithLimit = ({ clientsAmount = 100, lambda, mu, usageOfTheSystem, servidores, limite }) => {
  const result = []
  let counter = 0;
  let accumulated = 0;
  while (counter <= clientsAmount) {
    const chance = chanceTheyAreOnTheSystemWithLimit({ clientsAmount: counter, lambda, mu, usageOfTheSystem, servidores, limite })
    accumulated += chance;
    result.push({ n: counter, Pn: chance, PnAccumulated: accumulated });
    counter++;

    // if (Number(chance.toFixed(4)) === 0) break;
  }

  return result;
}

  const multipleservidoresWithNoLimit = () => {
    const usageOfTheSystem = averageUsageOfTheSystem(lambda, mu );
    const timeOnSystem = averageTimeOnSystem({ lambda, mu, usageOfTheSystem, servidores });
    const numberOfClientsOnTheQueue = averageNumberOfClientsOnTheQueue({ lambda, mu, usageOfTheSystem, servidores });
    const timeOnQueue = averageTimeOnQueue({ lambda, mu, usageOfTheSystem, servidores });
    const numberOfClientsOnTheSystem = averageNumberOfClientsOnTheSystem({ lambda, mu, usageOfTheSystem, servidores });
    const chanceTheyAreOnDetails = chanceTheyAreOnSystemDetails({ lambda, mu, usageOfTheSystem, servidores });
  
    setDatos({
      ...datos,
      ρ:usageOfTheSystem.toFixed(6),
      Ws:timeOnSystem.toFixed(6),
      Lq:numberOfClientsOnTheQueue.toFixed(6),
      Wq:timeOnQueue.toFixed(6),
      Ls:numberOfClientsOnTheSystem.toFixed(6),
      Pn:chanceTheyAreOnDetails,
    })
  }
  
  const multipleservidoresWithLimit = () => {
    const usageOfTheSystem = averageUsageOfTheSystem( lambda, mu );
    const timeOnSystem = averageTimeOnSystemWithLimit({ lambda, mu, usageOfTheSystem, servidores, limite });
    const numberOfClientsOnTheQueue = averageNumberOfClientsOnTheQueueWithLimit({ lambda, mu, usageOfTheSystem, servidores, limite });
    const timeOnQueue = averageTimeOnQueueWithLimit({ lambda, mu, usageOfTheSystem, servidores, limite });
    const numberOfClientsOnTheSystem = averageNumberOfClientsOnTheSystemWithLimit({ lambda, mu, usageOfTheSystem, servidores, limite });
    const chanceTheyAreOnDetails = chanceTheyAreOnSystemDetailsWithLimit({ clientsAmount: limite, lambda, mu, usageOfTheSystem, servidores, limite });
    const chanceToWait = chanceToWaitOutside({ lambda, mu, usageOfTheSystem, servidores, limite});
  
    setDatos({
      ...datos,
      ρ:usageOfTheSystem.toFixed(6),
      Ws:timeOnSystem.toFixed(6),
      Lq:numberOfClientsOnTheQueue.toFixed(6),
      Wq:timeOnQueue.toFixed(6),
      Ls:numberOfClientsOnTheSystem.toFixed(6),
      Pn:chanceTheyAreOnDetails,
      Pw:chanceToWait.toFixed(6)
    })
  }
  

  
  const handleClick=(e)=>{
    e.preventDefault()
    if(lambda===0 || mu===0 || servidores===0){
      setValidacion('lambda,mu o los servidores no pueden ser igual a 0')
  } else if(lambda>mu){
    setValidacion('lambda no puede ser mayor a mu ')
  }
        limite===0 ? multipleservidoresWithNoLimit() : multipleservidoresWithLimit()
  }


  useEffect(() => {
    setValidacion(null)
  }, [datos])




  function handleNum1Change(event) {
    setLambda(Number(event.target.value));
  }

  function handleNum2Change(event) {
    setMu(Number(event.target.value));
  }

  function handleNum3Change(event) {
    setServidores(Number(event.target.value));
  }

  function handleNum4Change(event) {
    setLimite(Number(event.target.value));
  }

  return (
    <div>
        <h2 className='text-center text-xl py-2'>Varios Servidores</h2>
        <div className='flex justify-center'>
          <div className='grid grid-cols-2 rounded p-4  bg-slate-400'>
            <div className='col-span-2 text-center pb-2 text-xl'><h2>Calculadora</h2></div>
            <input type='number' className='border mx-5 my-2 py-1 px-1 rounded' value={lambda} onChange={handleNum1Change} placeholder='lambda...' required/>
            <input type='number' className='border mx-5 my-2 py-1 px-1 rounded'  value={mu} onChange={handleNum2Change} placeholder='mu...' required/>
            <input type='number' className='border mx-5 my-2 py-1 px-1 rounded'  value={servidores} onChange={handleNum3Change}  placeholder='servidores...' required/> 
            <input type='number' className='border mx-5 my-2 py-1 px-1 rounded'  value={limite} onChange={handleNum4Change} placeholder='limite...' required/>
            <div className='flex justify-center col-span-2 py-2'><button onClick={handleClick} className='bg-sky-200 px-8 text-lg rounded text-black py-2'>Calculo</button></div>
          </div>
        </div>
        <div>
        {          validacion ?  <p className='bg-red-300 text-red-950 text-3xl text-center font-bold py-4'>{validacion}</p>:  <div className='grid grid-cols-2 my-5'> <ul className='flex'>
            <li className='text-lg px-3 border border-black rounded h-min my-2 mx-2'>ρ: {datos.ρ}</li>
            <li className='text-lg px-3 border border-black rounded h-min my-2 mx-2'>Ws: {datos.Ws}</li>
            <li className='text-lg px-3 border border-black rounded h-min my-2 mx-2'>Wq: {datos.Wq}</li>
            <li className='text-lg px-3 border border-black rounded h-min my-2 mx-2'>Ls: {datos.Ls}</li>
            <li className='text-lg px-3 border border-black rounded h-min my-2 mx-2'>Lq: {datos.Lq}</li>
            <li className='text-lg px-3 border border-black rounded h-min my-2 mx-2'>Pw: {datos.Pw}</li>
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

export default VariosServidores