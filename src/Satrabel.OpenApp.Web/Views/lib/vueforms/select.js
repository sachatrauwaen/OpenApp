(function () {
    var selectComponent = {
        name: "selectComponent",
        template: '<el-select v-model="model" placeholder="Select"> \
                    <el-option v-if="!hideNone" :label="noneLabel" :value="noneValue" ></el-option> \
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option> \
                </el-select>',
        props: {
            value: {},
            schema: {},
            messages: Object,
            prop: String,
            hideNone: {
                type: Boolean,
                default: function () {
                    return false;
                }
            },
            noneLabel: {
                default: function () {
                    return "None";
                }
            },
            noneValue: {
                default: function () {
                    return undefined;
                }
            }
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
            options: function () {
                var lst = [];
                var sch = this.schema.enum ? this.schema : this.schema.oneOf[0];
                for (var i = 0; i < sch.enum.length; i++) {
                    var label = sch['x-enumNames'] ? sch['x-enumNames'][i] : this.prop + '_' + sch.enum[i];
                    if (this.messages && this.messages[label]) {
                        label = this.messages[label];
                    }
                    lst.push({ value: sch.enum[i], label: label })
                }
                return lst;
            }
        }
    }
    Vue.component('select-component', selectComponent);
})();