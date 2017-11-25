(function () {
    var switchComponent = {
        name: "switchComponent",
        template: '<el-switch v-model="model" on-text="" off-text=""></el-switch>',
        props: {
            value: Boolean,
            schema: {},
            prop: String,
            options: {

            },
        },
        computed: {
            model: {
                get: function () {
                    return this.value
                },
                set: function (val) {
                    this.$emit('input', val)
                }
            }
        },
    }
    Vue.component('switch-component', switchComponent);
})();