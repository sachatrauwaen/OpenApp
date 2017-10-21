var selectComponent = {
    name: "selectComponent",
    template: '<el-select v-model="model" placeholder="Select"><el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option ></el-select >',
    props: {
        value: {},
        schema: {},
        prop: String,
    },
    computed: {
        model: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        },
        options: function () {
            var lst = [];
            for (var i = 0; i < this.schema.enum.length; i++) {
                lst.push({ value: this.schema.enum[i], label: this.schema['x-enumNames'].toString() ? this.schema['x-enumNames'][i] : this.schema.enum.toString() })
            }
            return lst;
            //return this.schema.enum.map(function (val) {
            //    return { value: val, label: val };
            //});;
        },
    }
}