import { createWebHistory, createRouter } from 'vue-router'
import SignupForm from '../components/SignupForm'
//import Login from "../components/Login"

const routes = [
    {
        path: "/register",
        component: SignupForm,
    }/*,
    {
        path: "/",
        component: Login
    }*/
];



const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;