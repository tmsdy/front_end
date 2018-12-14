<template>
    <div class="m-box">
      <div class="l-box">
        <img class="level-img" @click="chooseLevel(3)" src="./../assets/images/level01.png" />
        <img class="level-img" @click="chooseLevel(4)" src="./../assets/images/level02.png" />
        <img class="level-img" @click="chooseLevel(5)" src="./../assets/images/level03.png" />
      </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "three-level",
      mounted(){

      },
      methods:{
          chooseLevel(courseType){
            let token = this.$store.state.token ;
            axios.get('/api/haidong-emcee/course/TYCourse',{
              params:{courseType:String(courseType)}
            }).then(res=>{
              console.log(res)
              if(res.data.success){
                this.$store.commit('save_ex_course',res.data.data.coursewareList[0]) ;
                this.$router.push({
                  path:'/Index'
                });
              }
            })
          }
      }
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

  .m-box{background: #fff}
  .l-box{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .level-img{
      width: 656/@rem;
      height: 200/@rem;
      margin-top: 90/@rem;
    }
    .level-img:nth-of-type(1){
      margin-top: 210/@rem;
    }
  }


</style>
