<template>
    <div class="login-box">
        <div class="title">
            <h2>登录</h2>
        </div>
        <div class="content">
            <label>
                <div class="form-item">
                    <input placeholder="用户名" type="text" v-model="username" />
                </div>
            </label>

            <label>
                <div class="form-item">
                    <input placeholder="密码" type="password" v-model="password" />
                </div>
            </label>

            <div class="button" @click="doLogin">登录</div>
        </div>
    </div>
</template>

<script>
    import '@/assets/css/login.css';

    export default {
        name: 'Login',
        data() {
            return {
                username: '',
                password: ''
            }
        },
        methods: {
            doLogin() {
                this.$store.dispatch('login', {
                    username: this.username,
                    password: this.password
                }).then( res => {
                    if (res.data.code) {
                        alert(res.data.data);
                    } else {
                        alert('登录成功');
                        this.$router.push({name: 'Index'});
                    }
                } )
            }
        }
    }
</script>
