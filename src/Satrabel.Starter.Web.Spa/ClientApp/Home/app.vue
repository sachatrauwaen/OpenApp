<template>
    <div class="hello">
      
        <h1>{{ msg }}</h1>
    </div>
</template>

<script>
    import Vue from 'vue'

    export default {
        name: 'App',
        data() {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1 {
        font-weight: normal;
        color: dodgerblue;
    }
</style>