(function () {
    var timeComponent = {
        name: "timeComponent",
        template: '<el-time-select v-model="model" :picker-options="{start: start, step: step, end: end }" ></el-time-select>',
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
                    return this.value;
                },
                set: function (val) {
                    this.$emit('input', val);
                }
            },
            start: function () {
                return this.schema['x-ui-start'] ? this.schema['x-ui-start'] : '00:00';
            },
            step: function () {
                return this.schema['x-ui-step'] ? this.schema['x-ui-step'] : '00:30';
            },
            end: function () {
                return this.schema['x-ui-end'] ? this.schema['x-ui-end'] : '23:30';
            }
        },
    }
    Vue.component('oa-time', timeComponent);
})();