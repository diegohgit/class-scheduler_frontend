import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { SchoolProvider } from './context/SchoolProvider.jsx'
import { createRoot } from 'react-dom/client'
import router from './router'
import './index.css'


createRoot(document.getElementById('root')).render(
	<StrictMode>
		<SchoolProvider>
			<RouterProvider router = {router} />
		</SchoolProvider>
	</StrictMode>
)