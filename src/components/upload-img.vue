<template>
  <el-upload
    class="avatar-uploader"
      :action="action"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarSUpload">
      <img v-if="imageUrl" style="width:200px;"  :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>
<script>
export default {
  props:{
      action: String,
      maxSize:{
        type:Number,
        default:2
      },
      imageUrl:{
        type:String,
        default:''
      },
      imgMaxWidth:{
        type:[Number,String],
        default:'auto'
      }
  },
  data(){
    return {

    }
  },
  methods: {
      //图片上传成功之后
      handleAvatarSuccess(res, file) {
        console.log(file);//图片所有信息
        
        // if (res.code === 1) {//看一下请求状态
        //   this.$message({
        //     message:res.mes,
        //     type:"warning"
        //   });
        //   return;
        // }
        this.imageUrl = URL.createObjectURL(file.raw);//图片路径处理成一个字符串
        this.$emit('res-url',{
          resImgUrl:this.imageUrl
        })
 },
      //图片上传之前
      beforeAvatarSUpload(file) {
        // //限制图片的类型
        // const isJPG = file.type === 'image/jpeg';
        // //限制图的内存大小
        // const isLt2M = file.size / 1024 / 1024 < 2;

        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!');
        // }
        // return isJPG && isLt2M;
      }
  }
}
</script>