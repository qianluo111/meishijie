import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import {userInfo}from '@/service/api.js'
import Home from '@/views/home/Home.vue'
import Store  from '@/store'
const Recipe=()=>import('@/views/recipe/recipe');
const Create=()=>import('@/views/create/create');
const Edit=()=>import('@/views/user-space/edit');
const Menulist=()=>import(/*webpackChunkName:"space"*/ "@/views/user-space/menu-list" )
const Fans=()=>import(/*webpackChunkName:"space"*/ "@/views/user-space/fans" )
const Space=()=>import('@/views/user-space/space');
const Detail=()=>import('@/views/detail/detail');
const Login=()=>import('@/views/user-login/index');
const Cart=()=>import('@/views/cart/cart');
const router = new Router({
    mode:"history",
    routes:[
        {
            path:'/',
            name:"Home",
            title:"首页",
            component:Home
        },
        {
            path:'/login', 
            name:"login",
            title:"登录页",
            component:Login,
            meta:{
                login: true
            },
        },
        {
            path:'/cart', 
            name:"cart",
            title:"登录页",
            component:Cart,
            meta:{
                cart: true
            },
        },
        {
            path:'/edit', 
            name:"edit",
            title:"编辑个人资料",
            component:Edit,
            meta:{
                login: true
            },
        },
        {
            path:'/menulist', 
            name:"menulist",
            title:"菜谱编辑",
            component:Menulist,
            meta:{
                login: true
            },
        },
        {
            path:'/create', 
            name:"create",
            title:"发布菜谱",
            component:Create,
            meta:{
                login: true
            },
        },
        {
            path:'/recipe', 
            name:"recipe",
            title:"发布菜谱",
            component:Recipe,
            meta:{
                login: true
            },
        },
        {
            path:'/detail', 
            name:"detail",
            title:"菜谱编辑",
            component:Detail,
            meta:{
                login: true
            },
        },
        // ...viewsRoute,
        {
            path:"*",
            name:"noFound",
            title:"未找到",
            redirect:{
                name:"Home"
    
            }
        },
        {
            path:'/space', 
            name:"space",
            title:"个人空间",
            component:Space,
            redirect:{
                name:'works'
            },
            meta:{
                login: true
            },
            children : [
            {
                path:'works',
                name:'works',
                title:'作品',
                component:Menulist,
                meta:{
                    login:true
                },
            },
            {
                path:'fans',
                name:'fans',
                title:'我的粉丝',
                component:Fans,
                meta:{
                    login:true
                },
    
            },
            {
                path:"following",
                name:'following', 
                title:'我的关注',
                component:Fans,
                meta:{
                    login: true
                },
            },
            {
                path:'collection', 
                name:"collection",
                title:'收藏',
                component: Menulist,
                meta:{
                    login:true
                },
            }, 
        ]
    },
    ]
});
//路由守卫
router.beforeEach(async(to,from,next)=>{
    const token=localStorage.getItem('token');
    const isLogin= !!token;
    const data=await userInfo();
    Store.commit('chageUserInfo',data.data);
    if (isLogin) {
        if (data.error === 400) {//没有登录
            next({name:'login'});
            localStorage.removeItem('token')//移出本地存储中login里的数据
            return;//并返回
        }
        if (to.name==='login') {//登录之后跳往home主页
            next({name:'home'})
        }else{
            next();
        }
        next();
        return;
    }

    if (!isLogin && to.name==='login') {//没有登陆，仍需要去登录页
        next();
    }
    if (!isLogin && to.name !=='login') {//没有登录去往登录页
        next({name:'login'})
    }else{
        next();
    }
   
})

export default router;
