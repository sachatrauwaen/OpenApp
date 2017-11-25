(function () {
    var inputComponent = {
        name: "inputComponent",
        template: '<el-input v-model="model"></el-input>',
        props: {
            value: String,
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
    Vue.component('input-component', inputComponent);
})();