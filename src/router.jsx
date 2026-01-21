import { createBrowserRouter } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './views/Home'
import Students from './views/Students'
import Topics from './views/Topics'
import StudentList from './views/StudentList'

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
				element: <StudentList />
			}
		]
	},
	{
		path: '/topics',
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Topics />
			}
		]
	},
	{future: {
    v7_startTransition: true,
  },}
])

export default router