import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { SchoolProvider } from './context/SchoolProvider.jsx'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastContainer } from "react-toastify";
import router from './router'
import './index.css'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SchoolProvider>
        <RouterProvider router = {router} />
    	  <ToastContainer />
      </SchoolProvider>
      <ReactQueryDevtools initialIsOpen = {false} />
    </QueryClientProvider>
  </StrictMode>
)