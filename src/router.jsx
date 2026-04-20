import { createBrowserRouter } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './views/Home'
import Content from './views/Content'
import StudentList from './views/StudentList'
import EditStudent from './views/EditStudent'
import CreateStudent from './views/CreateStudent'
import StudentProgress from './views/StudentProgress'

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
            element: <EditStudent />,
          },{
            path: ':id/progress',
            element: <StudentProgress />
          },
          {
            path: 'create_student',
            element: <CreateStudent />
          },
        ]
      },
      {
        path: 'content',
        element: <Content />
      },
    ]
  },
], {future: {v7_startTransition: true,},}
)

export default router