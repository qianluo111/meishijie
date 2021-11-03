import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state:{
    userInfo: {},
    gwclist:[],
    geshu:0,
  },
  getters:{
    isLogin(state){
      return !!Object.keys(state.userInfo).length;
    }
  },
  mutations:{
    chageUserInfo(state, data){
      state.userInfo = data;
    },
    SET_LIST(state,data){//第一步将data中的数据放在state中
      state.gwclist=data.gwclist
      state.geshu=data.geshu
    },
    SET_GWC(state,data){//第二步将购物车数据存起来
      let {img,name,title,commentsLen,id}=data//将data中的数据解构出来
      state.geshu++//state中的个数增加
      let index= state.gwclist.findIndex(item=>item.id==id)//返回元素的索引位置，如果没有符合条件的元素返回 -1
      if(index==-1){//返回-1说明购物车里没有这个商品，则push进去，如果返回下标，则让此商品的数量加1
        state.gwclist.push({
          img,name,title,commentsLen,id,num:1
        })
      }else{
        state.gwclist[index].num++
      }
      localStorage.setItem('gwclist',JSON.stringify(state.gwclist))
      localStorage.setItem('geshu',JSON.stringify(state.geshu))
    },
    SET_JISHU(state,data){
      let {id,type}=data
      if(type=='jia'){
        state.gwclist.map(item=>{
          if(item.id==id){
            item.num++
            state.geshu++
          }
        })
      }else{
        state.gwclist.map(item=>{
          if(item.id==id){
            if(item.num==1){
              item.num=1
            }else{
              item.num--
              state.geshu--
            }
          }
        })
      }
      let aj=0
      state.gwclist.map(item=>{
        aj+=(item.price*item.num)
      })
      localStorage.setItem('gwclist',JSON.stringify(state.gwclist))
      localStorage.setItem('geshu',JSON.stringify(state.geshu))
    }
  },
  actions:{
    set_list({commit}){//将数据提交到本地存储
      commit('SET_LIST',{
        gwclist:JSON.parse(localStorage.getItem('gwclist')) || [],
        geshu:JSON.parse(localStorage.getItem('geshu')) || 0
      })
    },
    set_gwc({commit},data){
      commit('SET_GWC',data)
    },
    set_jiajian({commit},data){
      commit('SET_JISHU',data)
    }
  }
})

export default store;