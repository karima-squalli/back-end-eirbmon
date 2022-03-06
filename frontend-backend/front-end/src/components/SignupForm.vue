<template>
    <form @submit.prevent="registerUser">
        <label>Username:</label>
        <input type="text" required v-model="username">

        <label>Email:</label>
        <input type="email" required v-model="email">

        <label>Password:</label>
        <input type="password" required v-model="password">
        <div v-if="passwordError" class="error">{{passwordError}}</div>

        <label>Confirm password:</label>
        <input type="password" required v-model="cpassword">
        <div v-if="cpasswordError" class="error">{{cpasswordError}}</div>

        <div class="submit">
            <button>Submit</button>
        </div>
    </form>
</template>

<script>
import axios from 'axios'
export default {
    name : "signupForm",
    data(){
        return{
            username:'',
            email:'',
            password:'',
            cpassword:'',
            emailError:'',
            passwordError:'',
            cpasswordError:'',
        }
    },


    methods: {
        registerUser: function() {
            axios.post('/register', {
                username: this.username,
                email: this.email,
                password: this.password,
                cpassword: this.cpassword
            }).then((req) => {
                if (req.session.register_error) alert(req.session.register_error);
                
                this.passwordError = this.password.length>5 ? '' : 'Un mot de passe doit contenir au moins 6 caractères';
                this.cpasswordError = this.password===this.cpassword ? '' :'Les mots de passe doivent correspondre'
        }).catch(()=>{
            alert("Something Went Wrong!");
        })
        }
    }
}
</script>

<style>
/*https://youtu.be/ixOcve5PX-Q?t=2411*/
/*https://vueschool.io/lessons/vuejs-form-validation-diy?friend=vuejs*/
    form{
        max-width: 420px;
        margin : 30px auto;
        background: white;
        text-align: left;
        padding: 40px;
        border-radius: 10px;
    }

    label{
        color: #aaa;
        display: inline-block;
        margin: 25px 0 15px;
        font-size:0.6 em;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: bold;
    }

    input{
        display: block;
        padding: 10px 6px;
        width:100%;
        box-sizing: border-box;
        border:none;
        border-bottom: 1px solid #ddd;
        color: #555;
    }

    button{
        background: #0b6dff;
        border:0;
        padding: 10px 20px;
        margin-top: 20px;
        color:white;
        border-radius:20px;
        cursor:pointer;
    }

    .submit{
        text-align: center;
    }

    .error{
        color:#ff0062;
        font-size:0.8em;
        margin-top:10px;
    }

</style>