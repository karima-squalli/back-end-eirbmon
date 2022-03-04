<template>
  <div>
    <table class="table table-bordered">
      <thead>
        <tr>
        <th>ID</th>
        <th>Nickname</th>
        <th>Email</th>
        <th>password</th>
        </tr>
      </thead>
      <tbody style="color: #D1CDC8 ;">
        <tr v-for="user in users" :key="user.id">
          <td>{{user.id}}</td>
          <td>{{user.user_name}}</td>
          <td>{{user.user_mail}}</td>
          <td>{{user.user_password}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "Show",
  data() {
    return {
      users: {}
    }
  },
  mounted(){
    this.loadUsersTable();
  },
  methods: {
    loadUsersTable: function(){
      axios.get("/api/students").then((res) => {
        this.users = res.data;
      })
      .catch(()=>{
        console.log("Something Went Wrong");
      })
    }
  }
};
</script>
