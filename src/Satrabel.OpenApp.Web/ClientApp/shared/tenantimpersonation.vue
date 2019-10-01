<template>
    <el-tooltip content="Impersonate" placement="top">
        <el-button icon="el-icon-share" size="small" @click="impersonate"></el-button>
        </el-tooltip>
</template>
<script>
import Vue from 'vue';

export default {
        name: 'oa-userimpersonation',
        props: {
            id: {},
            tenantId: {}
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
            impersonate() {
                abp.services.app.impersonate.impersonateTenant(this.id).done(function (data) {
                    window.location = data;                    
                }).always(function () {
                    self.loading = false;
                });
            }
        }
}
</script>

<style>
  
</style>