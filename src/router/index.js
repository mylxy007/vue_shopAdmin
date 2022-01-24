import VueRouter from "vue-router"
import Login from '../view/Login'
import Home from '../view/Home'
import Welcome from '../view/Welcome'
//创建路由规则
const router = new VueRouter({
    routes: [{
            path: '/',
            //路由重定向
            redirect: '/login'
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [{
                path: '/welcome',
                component: Welcome
            }]
        }
    ]
})
//挂载全局路由守卫
//前置路由守卫 
router.beforeEach((to, from, next) => {
    //用户通过输入 url 进行跳转，只有 /login 可以直接跳转，其他页面都需要 token 
    if (to.path === '/login')
        return next();
    const token = sessionStorage.getItem('token');
    if (!token)
        return next('/login');
    next();
})
export default router