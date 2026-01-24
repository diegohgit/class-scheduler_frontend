import { createBrowserRouter } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './views/Home'
import Topics from './views/Topics'
import StudentList from './views/StudentList'
import EditStudent from './views/EditStudent'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'students',
        children: [
          {
            index: true,
            element: <StudentList />
          },
          {
            path: ':id',
            element: <EditStudent />
          },
        ]
      },
      {
        path: 'topics',
        element: <Topics />
      },
    ]
  },
], {future: {v7_startTransition: true,},}
)

export default router