<template>
  <div class="menu-detail">
    <detail-header :info="menuInfo"></detail-header>
    <detail-content :info="menuInfo"></detail-content>
    <Comment :info="menuInfo"></Comment>
  </div>
</template>
<script>
import DetailHeader from "./detail-header";
import DetailContent from "./detail-content";
import Comment from "./comment";
import { menuInfo } from "@/service/api";
export default {
  components: { DetailHeader, DetailContent, Comment },
  data() {
    return {
      menuInfo: {
        userInfo: {},
        raw_material: {
          main_material: [],
          accessories_material: [],
        },
        steps: [],
      },
    };
  },
  watch: {
    $route: {
      async handler() {
        //来判断路由是否有信息
        let { menuId } = this.$route.query;
        if(menuId){
          menuInfo({menuId}).then(({data})=>{
            this.menuInfo=data.info;
          })
        }else{
          this.$message({
            showClose:true,
            message:'请重新进入',
            type:'warning'
          })
        }


        // const { data } = await menuInfo({ menuId });


        // (this.menuInfo = data), (this.info = data.info);
        // console.log(data);
        // console.log(this.menuInfo);


        //可以留存上一次tab留存的信息
      },
      immediate: true,
    },
  },
};
</script>