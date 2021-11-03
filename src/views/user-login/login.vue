<template>
  <div class="login-section">
    <!-- :rules="rules" -->
    <el-form
      label-position="top"
      label-width="100px" class="demo-ruleForm"
      :rules="rules"
      :model="rulesForm"
      status-icon
      ref="ruleForm"
    >
      <el-form-item label="用户名" prop="name">
        <el-input type="text" v-model="rulesForm.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="rulesForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {login} from '@/service/api';

export default {
  data() {
    return {
      rulesForm: {//注意s     ruleForm
          name: '',
          password: '',
        },
        rules: {
          name: [
            { required: true,message: '请输入用户名', trigger: 'blur' },
            {min: 1,max:5,message: '最小为3最大为5',trigger: 'blur'}

          ],
          password: [
            { required: true,message: '请输入用户名', trigger: 'blur' },
            {min: 3,max:5,message: '最小为3最大为5',trigger: 'blur'}

          ],
        }
    };
  },
  methods: {
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            login({
              name:this.rulesForm.name,
              password:this.rulesForm.password,
            }).then((data) => {
                console.log(data);
                if (data.code ===0) {//登录成功
                  localStorage.setItem('token',data.data.token);
                  window.location.href='/';
                }
                if (data.code ===1) {
                  
                  this.message.error(data.mes)
                }
            })
          
         } else {
           console.log('error submit!!');
           return false;
         }
       });
     },
    //  resetForm(formName) {
    //    this.$refs[formName].resetFields();
    // }
  }
}
</script>

<style lang="stylus">
.login-section
  padding 0px 20px
</style>
