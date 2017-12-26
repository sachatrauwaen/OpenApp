(function () {
    var filterform = {
        name: "filterform",
        template: '<el-form ref="form" :model="model" :rules="rules" label-position="right" :label-width="labelwidth" :inline="!isMobile" :label-position="labelPosition"> \
                <comp v-for="(value, key) in fields" :key="key" :prop="key" :schema="properties[key]" v-model="model[key]" :messages="messages" :service="service" ></comp> \
                <el-form-item> \
                    <el-button v-for="action in actions" :key="action.name" size="small" :icon="action.icon" :type="action.type" @click="action.execute()">{{action.name}}</el-button> \
                </el-form-item> \
                </el-form>',
        props: {
            model: {},
            schema: {},
            service: {},
            options: {},
            messages: {},
            actions: {},
            columns: {

            }
        },
        data: function () {
            return {};
        },
        computed: {
            properties: function () {
                return this.schema.properties;
            },
            fields: function () {
                if (this.options) {
                    return this.options.fields;
                }
                else {
                    var fields = {};
                    for (var key in this.schema.properties) {
                        if (key != 'id' && !this.schema.properties[key].readOnly && !this.schema.properties[key]["x-rel-app"]) {
                            fields[key] = this.schema.properties[key];
                        }
                    }
                    return fields;
                }
            },
            rules: function () {
                var rules = {};
                for (var key in this.schema.properties) {
                    var prop = this.schema.properties[key];
                    var itemRules = [];
                    rules[key] = itemRules;
                }
                return rules;
            },
            isMobile: function () {
                return window.matchMedia("only screen and (max-width: 760px)").matches
            },
            labelPosition: function () {
                return this.isMobile ? 'top' : 'right';
            },
            labelwidth: function () {
                return this.isMobile ? '100px' : '';
            }
        },
        methods: {
            validate: function (callback) {
                this.$refs.form.validate(function (valid) {
                    if (callback) callback(valid);
                });
            },
            submitForm: function (formName) {
                this.$refs.form.validate(function (valid) {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm: function () {
                this.$refs.form.resetFields();
            },
            label: function (name) {
                //var name = this.schema.properties[prop].title ? this.schema.properties[prop].title : prop.capitalize();
                if (this.messages && this.messages[name])
                    return this.messages[name];
                else
                    return name;
            }
        },
        /*
        created: function(){

            for (key in this.fields) {
                if (this.fields[key].type == "string"){
                    Vue.set(this.model, key, "");
                } else if (this.fields[key].type == "int") {
                    Vue.set(this.model, key, 0);
                }
            }
        
        }
        */
    }
    Vue.component('filterform', filterform);
})();