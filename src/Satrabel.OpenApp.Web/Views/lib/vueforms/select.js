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
            service: {},
            
            
        },
        data: function () {
            return {
                options: [],
                hideNone: false,
                noneLabel: "None",
                noneValue: undefined
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

        },
        created: function () {
            var self = this;
            var sch = this.schema.oneOf && this.schema.oneOf[0] ? this.schema.oneOf[0] : this.schema;
            if (sch.enum) {
                for (var i = 0; i < sch.enum.length; i++) {
                    var label = sch['x-enumNames'] ? sch['x-enumNames'][i] : this.prop + '_' + sch.enum[i];
                    if (this.messages && this.messages[label]) {
                        label = this.messages[label];
                    }
                    this.options.push({ value: sch.enum[i], label: label });
                }
            }
            else if (sch["x-enum-action"]) {
                var enumAction = this.schema["x-enum-action"];
                var enumValueField = this.schema["x-enum-valuefield"] || 'id';
                var enumTextField = this.schema["x-enum-textfield"] || 'fullName';
                self.service[enumAction]().done(function (data) {
                    self.options = data.map(function (p) {
                        return { value: p[enumValueField], label: p[enumTextField] };
                    });
                }).always(function () {
                });
            }
            if (sch["x-enum-nonelabel"]) {
                this.noneLabel = sch["x-enum-nonelabel"];
                if (this.messages && this.messages[this.noneLabel]) {
                    this.noneLabel = this.messages[this.noneLabel];
                }
            }
        }
    }
    Vue.component('select-component', selectComponent);
})();