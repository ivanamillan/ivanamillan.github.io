import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Servidor from './Views/Servidor.jsx'
import VariosServidores from './Views/VariosServidores.jsx'


const router=createBrowserRouter([{
  path:"/",
  element:<App/>,
  children:[
    {
    path:"/",
    element:<Servidor/>,
    index:true
   },
   {
    path:"/variosServidores",
    element:<VariosServidores/>
   }
]
}])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
