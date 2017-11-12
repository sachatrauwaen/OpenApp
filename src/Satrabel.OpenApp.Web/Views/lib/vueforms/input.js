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
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
}