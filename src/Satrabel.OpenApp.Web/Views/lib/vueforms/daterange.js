(function () {

    var daterangeComponent = {
        name: "daterangeComponent",
        template: '<div><el-date-picker v-if="!isMobile" v-model="model"  type="daterange" format="dd/MM/yyyy" value-format="yyyy-MM-dd" ></el-date-picker>\
                    <el-date-picker v-if="isMobile" v-model="model1"  type="date" format="dd/MM/yyyy" value-format="yyyy-MM-dd" placeholder="Begin" ></el-date-picker>\
                    <el-date-picker v-if="isMobile" v-model="model2"  type="date" format="dd/MM/yyyy" value-format="yyyy-MM-dd" placeholder="End" ></el-date-picker></div>',
        data: function () {
            return {
                pickerOptions: {
                    shortcuts: [{
                        text: 'Last week',
                        onClick: function (picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'Last month',
                        onClick: function (picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'Last 3 months',
                        onClick: function (picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
            };
        },
        props: {
            value: Array,
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
            },
            model1: {
                get: function () {
                    return this.value && this.value.length > 0 ? this.value[0] : null;
                },
                set: function (val) {
                    if (this.value && this.getTime(this.value[1]) > this.getTime(val))
                        this.model = [val, this.value[1]]
                    else
                        this.model = [val, val]
                }
            },
            model2: {
                get: function () {
                    return this.value && this.value.length > 1 ? this.value[1] : null;
                },
                set: function (val) {
                    if (this.value && this.getTime(this.value[0]) < this.getTime(val)) 
                        this.model = [this.value[0], val];
                    else 
                        this.model = [val, val]
                }
            },
            isMobile: function () {
                return VueForms.isMobile();
            }
        },
        methods: {
            getTime: function (str) {
                return (new Date(str)).getTime();
            }

        }
    }
    Vue.component('oa-daterange', daterangeComponent);
})();