import { createBrowserRouter } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './views/Home'
import Content from './views/Content'
import StudentList from './views/StudentList'
import EditStudent from './views/EditStudent'
import CreateStudent from './views/CreateStudent'
import StudentProgress from './views/StudentProgress'
import Login from './layouts/Login'
import ProtectedRoute from './layouts/ProtectedRoute'
import ForgotPassword from './views/ForgotPassword'
import ResetPassword from './views/ResetPassword'

const basename = import.meta.env.VITE_BASE_PATH.replace(/\/$/, '')

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children:[
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
    }]
  },{
    path: 'login',
    element: <Login />
  },{
    path: 'forgot-password',
    element: <ForgotPassword />
  },{
    path: 'reset-password',
    element: <ResetPassword />
  },
], {

    //This basename is to use this project as a subdirectory
    //example.com/class.scheduler-daniel
    basename: basename,
    future: {
      v7_startTransition: true,
    },
  }
)

export default router