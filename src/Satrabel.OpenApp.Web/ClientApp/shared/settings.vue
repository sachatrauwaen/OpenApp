<template>
    <el-card>
        <el-row v-for="f in value" :key="f.name" style="margin-bottom:10px;">
            <el-col :span="9">
                {{f.displayName ? f.displayName : f.name}}
            </el-col>
            <el-col :span="15">
                <el-input v-model="f.value"></el-input>
            </el-col>
        </el-row>        
    </el-card>
</template>
<script>
    import Vue from 'vue';

    export default {
        name: 'oa-features',
        props: {
            value: Array,
            schema: {},
            prop: String,
            options: {}
        },
        data() {
            return {

            };
        },
        created() {

        },
        computed: {

        },
        methods: {

        }
    }
</script>

<style>
</style>