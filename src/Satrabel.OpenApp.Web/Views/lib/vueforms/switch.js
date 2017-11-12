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
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
}