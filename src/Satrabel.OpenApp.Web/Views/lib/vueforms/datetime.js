(function () {
    var datetimeComponent = {
        name: "datetimeComponent",
        template: '<el-date-picker v-model="model" type="datetime" format="dd/MM/dd HH:mm" ></el-date-picker>',
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
    Vue.component('datetime-component', datetimeComponent);
})();