(function () {
    var textareaComponent = {
        name: "textareaComponent",
        template: '<el-input type="textarea" autosize v-model="model"></el-input>',
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
    Vue.component('textarea-component', textareaComponent);
})();