<template>
  <div class="cart">
      <div class="top-to">
           <a>购物车</a>
      </div>
     <el-col
      style="flex:none;"
      v-for="(item,index) in gwclist" 
      :key='item.id'
    >
      <el-card :body-style="{ padding: '0px' }">
          <!-- <el-checkbox  name="type" v-model="isgwcxz"></el-checkbox> -->
        <router-link class="cartPart" :to="{name:'cart',query:{menuId:item.menuId}}">
           <div class="kuang">
                    <input type="checkbox" v-model="isgwcxz" @click="radio()">
           </div>
          <img :src="item.img" class="image" style="width: 232px;height: 232px;">
          <div  class="menu-cardPs">
            <strong class="info"> 名称 {{item.title}}</strong>
            <router-link :to="{name:'space',query:{userId:item.userId}}" tag="em">
             作者 {{item.name}}
            </router-link>
          </div>
          <div class="right">
              <span @click="jijia(item.id,'jia')" class="add">+</span>
              <span class="num">{{item.num}}</span>
              <span @click="jijia(item.id,'jian')" class="reduce">-</span>
              <span @click="addremove(index)" class="remove">删除</span>
          </div>
        </router-link> 
      </el-card>
    </el-col>
    <p class="bottom">
        <button class="floor_btn" @click="all()">全选</button>
        <button class="floor_btn" @click="del()">全部删除</button>
    </p>
  </div>
</template>

<script>
export default {
    data(){
        return {
            isgwcxz:false,
        }
    },
    computed:{
       gwclist(){
           return this.$store.state.gwclist
       }
    },
    created(){
        this.$store.dispatch('set_list')
        console.log(this.isgwcxz);
    },
    methods:{
      jijia(id,type){
          this.$store.dispatch('set_jiajian',{id,type})
      },
      addremove(index){
          this.gwclist.splice(index,1)
      },
      all(){
         
          this.isgwcxz=!this.isgwcxz;
      },
      radio(){
          console.log(1111);
         this.isgwcxz=true
      },
      del(){
          this.$store.state.gwclist=[]
      }
    },
   watch:{
       gwclist:{
           handler(value){
            localStorage.setItem('gwclist',JSON.stringify(value));
           }
       }
   }
}
</script>

<style  scoped>
    .cart{
        width: 100%;
        height: 100%;
        color: #ccc;
    }
        
    .cartPart{
        display: flex;
    }
        

       .kuang{
           width: 100px;
            height: 50px;
            text-align: center;
            line-height:225px;
       }
        

    .right{
         width: 200px;
       
        display: flex;
        margin-left: 100px;
        margin-top: 100px;
        height: 30px;
        font-size:16px;
    }
       

    .add {
         width: 50px;
        height: 50px;
        background: yellow;
        font-size:20px;
        text-align:center;
        line-height:50px;
    }
       
    .num{
        width: 50px;
        height: 50px;
        background: yellow;
        font-size:20px;
        text-align:center;
        line-height:50px;
    }
    .remove{
    line-height:30px;
    }
    .reduce {
        width: 50px;
        height: 50px;
        background: yellow;
        font-size:20px;
        text-align:center;
        line-height:50px;
    }
    .info{
        width: 300px;
        height: 100px;
        text-align: center;
        line-height:190px;
        }
    .cartPart{
        display: flex;
        justify-content: space-between;
        position:relative;
        } 
    .menu-cardPs{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 15px;
    }
    span{
        width:50px;
        height:50px;
        margin: 0 10px;
        font-size:16px;
    }     
    
       
    .bottom{
        display: flex;
        justify-content: space-between;
        width: 100%;
        color: #333;
        background-color: pink;
     }
      
</style>
   
