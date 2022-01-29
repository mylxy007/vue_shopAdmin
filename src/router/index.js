import VueRouter from "vue-router"
import Login from '../component/Login'
import Home from '../component/Home'
import Welcome from '../component/Welcome'
import Users from '../component/user/Users'
import Rights from '../component/power/Rights'
import Roles from '../component/power/Roles'
import Cate from '../component/goods/Cate'
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
                },
                {
                    path: '/users',
                    component: Users
                },
                {
                    path: '/rights',
                    component: Rights
                },
                {
                    path: '/roles',
                    component: Roles
                },
                {
                    path: '/categories',
                    component: Cate
                }
            ]
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