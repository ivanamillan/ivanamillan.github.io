import React, { useState } from 'react'
import multipleServersWithNoLimit from '../helpers/ServidoresSinLimite'

const Formulario = ({varios}) => {

  const[lambda,setLambda]=useState(0)
  const[mu,setMu]=useState(0)
  const[servidores,setServidores]=useState(0)
  const[limite,setLimite]=useState(0)




  
  return (
    <div>
      <div>
        <input type='number' placeholder='lambda...' required/>
        <input type='number' placeholder='mu...' required/>
        {!varios ? <input type='number'  placeholder='servidores...' required/> : null}
        <input type='number' placeholder='limite...' required/>
        <button>Calculo</button>
      </div>
    </div>
  )
}

export default Formulario