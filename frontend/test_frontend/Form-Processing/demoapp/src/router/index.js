import { createWebHistory, createRouter } from 'vue-router'
import Show from "../components/Show"
import SignupForm from '../components/SignupForm.vue';
const routes = [
    {
        path: "/signup",
        component: SignupForm,
    },
    {
        path: "/show",
        component: Show
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
