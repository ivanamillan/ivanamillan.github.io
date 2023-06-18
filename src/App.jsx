import { Outlet } from 'react-router'
import './App.css'
import { Link } from 'react-router-dom'

function App() {

  return (
    <>
      
      <nav className='bg-sky-200 text-black font-bold p-5 flex justify-center text-2xl'>
        <Link to='/' className='px-4 hover:text-sky-500'> Un Servidores</Link>
        <Link to='/VariosServidores' className='px-4 hover:text-sky-500'> Varios Servidores</Link>
      </nav>
      <Outlet/>
    </>
  )
}

export default App
