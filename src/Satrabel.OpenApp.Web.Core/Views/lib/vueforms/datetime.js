var datetimeComponent = {
    name: "datetimeComponent",
    template: '<el-date-picker v-model="model" type="datetime" ></el-date-picker>',
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