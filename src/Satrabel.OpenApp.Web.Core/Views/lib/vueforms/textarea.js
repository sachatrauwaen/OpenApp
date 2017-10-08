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
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
}