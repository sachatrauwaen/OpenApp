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
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
}