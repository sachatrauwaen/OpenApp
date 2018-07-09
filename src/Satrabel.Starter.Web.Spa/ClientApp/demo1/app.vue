<template>
    <div>
        <!-- Breadcrumb -->
        <ol class="breadcrumb">
            <li class="breadcrumb-item active">Home</li>
            <!-- Breadcrumb Menu-->
            <li class="breadcrumb-menu d-md-down-none">
                <div class="btn-group" role="group" aria-label="Button group">
                    <a class="btn" href="/"><i class="icon-calendar"></i> &nbsp;Dashboard</a>
                </div>
            </li>
        </ol>
        <div class="container-fluid">
            <h1>{{ propMessage }}</h1>
            <demo-javascript></demo-javascript>
            <demo-typescript propMessage="demoTypescript"></demo-typescript>

            <el-alert title="Title."
                      type="info"
                      description="This is a description.">
            </el-alert>

            <el-button @click="sendNotification">Send Notification</el-button>

        </div>
    </div>
</template>

<script>
    import DemoJavascript from './DemoJavascript.vue';
    import DemoTypescript from './DemoTypescript.vue';

    import Vue from 'vue'
    import ElementUI from 'element-ui'; // see http://element.eleme.io/#/en-US/component 
    Vue.use(ElementUI)

    export default {
        name: 'App',
        props: {
            propMessage: String
        },
        data: function() {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        },
        components: {
            demoJavascript: DemoJavascript,
            demoTypescript: DemoTypescript
        },
        methods: {
            sendNotification() {
                abp.services.app.demo1Service.sendNotification("helloooo");
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