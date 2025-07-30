import Index from './pages/Index'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import ContactUs from './pages/ContactUs/ContactUs'
import Courses from './pages/Courses/Courses'
import Articles from './pages/Articles/Articles'
import ArticlesDetailes from './pages/ArticlesDetailes/ArticlesDetailes'
import CoursesDetailes from './pages/CoursesDetailes/CoursesDetailes'
import SessionDetailes from './pages/SessionDetailes/SessionDetailes'



import AdminIndex from './pages/AdminPanel/index'
import AdminUsers from './pages/AdminPanel/AdminUsers/AdminUsers'
import AdminComments from './pages/AdminPanel/AdminComments/AdminComments'
import AdminCourses from './pages/AdminPanel/AdminCourses/AdminCourses'
import AdminCategory from './pages/AdminPanel/AdminCategory/AdminCategory'
import AdminContact from './pages/AdminPanel/AdminContact/AdminContact'
import AdminNewaLetter from './pages/AdminPanel/AdminNewaLetter/AdminNewaLetter'
import AdminNotif from './pages/AdminPanel/AdminNotif/AdminNotif'
import AdminSessions from './pages/AdminPanel/AdminSessions/AdminSessions'
import AdminOffs from './pages/AdminPanel/AdminOffs/AdminOffs'
import AdminTickets from './pages/AdminPanel/AdminTickets/AdminTickets'
import AdminMenu from './pages/AdminPanel/AdminMenu/AdminMenu'
import AdminArticles from './pages/AdminPanel/AdminArticles/AdminArticles'
import AdminPrivate from './components/Private/Private'



import UserPanel from '../src/pages/UserPanel/Index'
import UserPanelIndex from '../src/pages/UserPanel/Index/Index'
import UserPanelOrder from './pages/UserPanel/Order/Order'
import UserPanelEditAccount from './pages/UserPanel/EditAccount/EditAccount'
import UserPanelTickets from './pages/UserPanel/Tickets/Tickets'
import SendTicket from './pages/UserPanel/Tickets/SendTicket'
import UserPanelTicketAnswer from './pages/UserPanel/Tickets/AnswerTicket'
import UserPanelCourses from './pages/UserPanel/Courses/Courses'



const routes = [
    { path: '/', element: <Index /> },
    { path: '/register', element: <Register /> },
    { path: '/login', element: <Login /> },
    { path: '/contactus', element: <ContactUs /> },
    { path: '/courses', element: <Courses /> },
    { path: '/articles', element: <Articles /> },
    { path: '/articles/:shortName', element: <ArticlesDetailes /> },
    { path: '/courses/:shortName', element: <CoursesDetailes /> },
    { path: "/courses/:shortName/:sessionID", element: <SessionDetailes /> },




    {
        path: '/p-admin/*',
        element: (
            <AdminPrivate>
                <AdminIndex />
            </AdminPrivate>
        ),
        children: [
            { path: 'users', element: <AdminUsers /> },
            { path: 'comments', element: <AdminComments /> },
            { path: 'courses', element: <AdminCourses /> },
            { path: 'category', element: <AdminCategory /> },
            { path: 'contact', element: <AdminContact /> },
            { path: 'newsLetter', element: <AdminNewaLetter /> },
            { path: 'notif', element: <AdminNotif /> },
            { path: 'session', element: <AdminSessions /> },
            { path: 'off', element: <AdminOffs /> },
            { path: 'ticket', element: <AdminTickets /> },
            { path: 'menu', element: <AdminMenu /> },
            { path: 'article', element: <AdminArticles /> },
        ]
    },

    {
        path: "/my-account/*",
        element: <UserPanel />,
        children: [
            { path: "", element: <UserPanelIndex /> },
            { path: "orders", element: <UserPanelOrder /> },
            { path: "buyed", element: <UserPanelCourses /> },
            { path: "tickets", element: <UserPanelTickets /> },
            { path: "send-ticket", element: <SendTicket /> },
            { path: "tickets/answer/:id", element: <UserPanelTicketAnswer /> },
            { path: "edits", element: <UserPanelEditAccount /> },
        ],
    },
]




export default routes