(function () {
    var checkboxGroupComponent = {
        name: "checkboxGroupComponent",
        template: '<el-checkbox-group v-model="model"><el-checkbox v-for="item in options" :label="item.value" :key="item.value">{{item.label}}</el-checkbox></el-checkbox-group>',
        props: {
            value: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            schema: {},
            prop: String,
        },
        data: function () {
            return {
                options: []
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
            resource: function () {
                return this.$route.params.resource;
            },
        },
        created: function () {
            var self = this;
            var enumAction = this.schema["x-enum-action"];
            if (enumAction) {
                var enumValueField = this.schema["x-enum-valuefield"];
                var enumTextField = this.schema["x-enum-textfield"] || this.schema["x-enum-valuefield"];
                var service = abp.services.app[self.resource][enumAction];
                service().done(function (data) {
                    self.options = data.items.map(function (p) {
                        return { value: p[enumValueField], label: p[enumTextField] };
                    });
                }).always(function () {
                    //abp.ui.clearBusy(_$app);
                });
            } else if (this.schema.enum) {
                this.options = this.schema.enum.map(function (val) {
                    return { value: val, label: val };
                });
            } else {
                return [];
            }
        }
    }
    Vue.component('checkbox-group-component', checkboxGroupComponent);
})();