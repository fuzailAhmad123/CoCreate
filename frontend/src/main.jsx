import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import rootReducer from "./reducer/index.js"
import { configureStore } from '@reduxjs/toolkit'
import {BrowserRouter} from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';

const store = configureStore({
  reducer:rootReducer
})
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
    
  
)
