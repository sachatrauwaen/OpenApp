<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <demo-javascript></demo-javascript>
        <demo-typescript propMessage="demoTypescript"></demo-typescript>

        <el-alert title="Title."
                  type="info"
                  description="This is a description.">
        </el-alert>

    </div>
</template>

<script>

    import DemoJavascript from './DemoJavascript.vue'; 
    import DemoTypescript from './DemoTypescript.vue';

    import Vue from 'vue'
    import ElementUI from 'element-ui';
    Vue.use(ElementUI)

export default {
  name: 'App',
  data() {
        return {
          msg: 'Welcome to Your Vue.js App'
        }
    },
    components: {
        demoJavascript: DemoJavascript,
        demoTypescript: DemoTypescript
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1 {
      font-weight: normal;
      color:dodgerblue;
    }
  
</style>