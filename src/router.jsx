import { createBrowserRouter } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './views/Home'
import Students from './views/Students'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Home />
			}
		]
	},
	{
		path: '/students',
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Students />
			}
		]
	}
])

export default router