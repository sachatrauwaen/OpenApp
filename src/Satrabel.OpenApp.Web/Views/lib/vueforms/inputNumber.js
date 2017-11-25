(function () {
    var inputNumberComponent = {
        name: "inputNumberComponent",
        template: '<el-input-number v-model="model" ></el-input-number>',
        props: {
            value: Number,
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
        }
    }
    Vue.component('input-number-component', inputNumberComponent);
})();
