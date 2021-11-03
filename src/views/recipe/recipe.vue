<template>
    <div class="recipe">
        <!-- v-model="activeName" -->
        <!-- 菜谱分类 start -->
        <el-tabs @tab-click="tabClick" v-model="classifyName"  type="border-card" >
            <el-tab-pane 
                v-for="item in classify"  
                :key="item.parent_type"
                :label="item.parent_name"
                :name="item.parent_type"
            > 
                <div class="recipe-link">
                    <router-link :to="{query:{...$router.query,classify:option.type,page:1}}" 
                    
                        v-for="option in item.list"
                        :key="option.type"
                        :class="{active:classifyType === option.type}"
                    
                    >
                        {{option.name}}
                    </router-link>
                   
                </div>
            </el-tab-pane>
           
        </el-tabs>
        <!-- 菜谱分类 end -->
        <h2>家常好味道，给你家一般的温暖</h2>
        <!-- 容器 -->
            <!-- 左侧列表 -->
            <!-- 右侧显示 -->
        <!-- 容器 -->
       <el-container>
            <el-aside width="220px" class="recipe-aside">
                <div class="filter-box">
                    <h4>筛选</h4>
                    <!-- v-model="activeName" -->
                    <!-- 筛选 start -->
                    <el-collapse v-model="propertiesActivName">
                        <el-collapse-item
                            v-for="item in properties"
                            :key="item.parent_type"
                            :title="item.parent_name"
                            :name="item.parent_type"
                        >
                            <div class="filter-tags">
                                <el-tag type="info"
                                v-for="option in item.list"
                                :key="option.type"
                                @click="selectedTag(option)"
                                :class="{'tag-selected': propertyType[option.title] === option.type}"
                                >
                                {{option.name}}
                                </el-tag>
                            </div>
                        </el-collapse-item>

                    </el-collapse>
                    <!-- 筛选 end -->
                </div>
            </el-aside>
            <el-main class="filter-menus-box" >
               <div class="menu-empty" v-show="!list.length && !loading">暂时没有过滤出菜谱信息，请选择其他的筛选条件</div>
                <menu-card  style="min-height: 75%;" :info="list"></menu-card>
                    <!-- 分页展示 -->
                <div style="text-align: right;" v-show="!loading">
                    <el-pagination
                            style="display: inline-block;"
                            :page-size="5"
                            layout="total, prev, pager, next"
                            :total="total"
                            :current-page.sync="page"
                            @current-change="handlerSelect"
                            :hide-on-single-page="true"
                          >
                    </el-pagination>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
<script>
    import MenuCard from '@/components/menu-card.vue'
    import {getClassify, getProperty, getMenus} from '@/service/api';
    // import { callbackify } from 'util';
    export default {
        components: {MenuCard},
        data() {
            return {
                classify:[],//存储tab切换的所有数据
                classifyType:"1-1",//tab切换的选中项(二级路由)，里面存的谁，谁就是点击项让谁发生改变
                classifyName:'1',//定义刷新tab时的值（一级路由）
            //    属性：
               properties:[],//存储属性中的所有数据
               propertyType:{},//存储属性的分类，例如：{craft：1-4，flavor=2-1}
               propertiesActivName:[] , //记录所有的属性分类
               
                list:[],//
                total:0,//总页数
                loading:false,//是否显示遮罩层
                page:1
           }
        },
        watch: {
            $route: {
                handler(){
                    const {classify,page} = this.$route.query;//lu
                    if (classify) {
                        this.classifyType = classify;//存好的二级在这里 1-1
                        this.classifyName =classify[0];//这样就变为一级 1
                        this.page = Number(page);
                    }
                     this.getMenuss()//这里需要改
                }, 
                immediate:true
            }
        },
        mounted() {
            getClassify().then(({data})=>{
                    // console.log(data);
                    this.classify = data;
                    if (!this.$route.query.classify) {
                        this.classifyType = this.classify[0].list[0].type;//存好的二级在这里 1-1
                        this.classifyName =classify[0].parent_type;//1
                        this.$route.push({
                            query:{
                                classify:this.classifyType,
                                page:1
                            }
                        })
                    }
            });
            getProperty().then(({data})=>{
                // console.log(data);
                this.properties = data;
                const {query} = this.$route;  // {craft:'1-1',flavor: '2-1',hard: '3-2' }
                //传递空对象，来保存每次的参数值
                this.propertyType = this.properties.reduce((o, item) => {
                   //item.title 工艺，难度，口味，人数
                   o[item.title] = query[item.title] ? query[item.title] : '';
                    if(o[item.title]){
                            this.propertiesActivName.push(o[item.title][0]);
                                //记录所有的属性分类
                    }
                    return o;
                },{});
                // console.log(this.propertyType);
            })
           
        },
        methods: {
            selectedTag(option){
                 let query = {...this.$route.query};
                 //判断是否点击，如果点击过：取消，否则，选中
                 if (this.propertyType[option.title] === option.type) {
                     this.propertyType[option.title]="";
                     delete query[option.title];
                 }else{
                     this.propertyType[option.title]=option.type;
                     query[option.title]=option.type;
                 }
                  // 地址栏记录选中的属性
                this.$router.push({
                    query
                })
            },
            getMenuss(){
                const query = {...this.$route.query};
                const params={
                    page:query.page || "1",
                    classify:query.classify
                };
                delete query.page;
                delete query.classify
                if (Object.keys(query).length) {
                    params.property = {
                        ...query
                    }
                }
                this.loading=true;//挂载之前显示
                let loading=null;//
                this.$nextTick(()=>{
                    loading=this.$loading({
                        target:'.filter-menus-box',
                        text:'Loading...',
                        spinner:'el-icon-loading',
                        background:'rgba(0,0,0,0.7)'
                    }) 
                });
                this.list=[];//挂载之后将list数据存储展示
                //请求右侧数据
                getMenus(params).then(({data})=>{
                    if (this.loading) {
                        loading.close();//数据加载之后将loading事件进行关闭
                    }
                    this.loading=false;
                    // console.log(data);
                    this.list =data.list;
                    this.total =data.total;
                    this.page=data.current_page;

                })
            },
            //点击改变当前页
            handlerSelect(){
                console.log("改变页码");
                this.$router.push({
                    query:{
                        ...this.$route.query,
                        page:this.page
                    }
                })
            },
            tabClick(){
                const classifName=this.classifyName;
                const item=this.classify.find(item => item.parent_type === classifName);
                // console.log(item);
                //item 是当前被点击到的一级路由（整体数据）
                if (item) {
                    this.classifyName=item.parent_type//一级路由
                    this.classifyType=item.list[0].type
                    this.$route.push({
                        query:{
                            ...this.$route.query,
                            classify:this.classifyType
                        }
                    })
                }
           }
        }
    }
    //显示主体，分页器，遮罩层，
    //
// parent_type: "1"          编号(Id)
// parent_name: "家常菜谱"    文字提示
// 子类：    item.name     ||    item.type
// name: "家常菜",     type: "1-1"
</script>
<style lang="stylus">
    .recipe-link
        font-size 0;
        margin-top 5px

        a
            display inline-block
            font-size 12px
            padding 0px 8px
            height 28px
            line-height 28px

        .active
            background #ff3232
            color #fff

    .recipe
        h2
            text-align center
            line-height 150px

        .el-main
            padding 0

        .filter-box
            background #fff
            padding 10px
            width 100%
            float left
            box-sizing border-box

    .filter-tags
        display flex
        flex-wrap wrap
        justify-content space-around

        .tag-selected
            background-color #ff3232  !important
            color #fff

    .menu-empty
        width 100%
        text-align center
        font-size 20px
</style>

