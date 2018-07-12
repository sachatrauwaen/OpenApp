(function () {
    var timeComponent = {
        name: "timeComponent",
        template: '<el-time-picker v-model="model" ></el-time-picker>',
        props: {
            value: {},
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
    Vue.component('oa-time', timeComponent);
})();