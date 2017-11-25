(function () {
    var form = {
        name: "formcomp",
        template: '<el-form ref="form" :model="model" :rules="rules" label-position="right" label-width="120px" :label-position="labelPosition" > \
                <el-tabs v-if="Object.keys(tabs).length > 1" :value="Object.keys(tabs)[0]">\
                    <el-tab-pane v-for="(gvalue, gkey) in tabs" :key="gkey" :label="label(gkey)" :name="gkey"> \
                        <comp v-for="(value, key) in gvalue" :key="key" :prop="key" :schema="properties[key]" v-model="model[key]" :messages="messages" @propChange="propChange" :service="service" ></comp> \
                    </el-tab-pane> \
                </el-tabs> \
                <comp v-else v-for="(value, key) in fields" :key="key" :prop="key" :schema="properties[key]" v-model="model[key]" :messages="messages" @propChange="propChange" :service="service" ></comp> \
                <el-form-item> \
                    <el-button v-for="action in actions" :key="action.name" size="small" :type="action.type" @click="action.execute()">{{action.name}}</el-button> \
                </el-form-item> \
                </el-form>',
        props: {
            model: {},
            schema: {},
            options: {},
            messages: {},
            actions: {},
            columns: {

            },
            service: {}
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
                        if (this.columns) {
                            if (this.columns.indexOf(key) > 0) {
                                fields[key] = this.schema.properties[key];
                            }
                        } else {
                            if (key != 'id' && !this.schema.properties[key].readOnly && !this.schema.properties[key]["x-rel-app"]) {
                                fields[key] = this.schema.properties[key];
                            }
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
                    if (prop.required && prop.type != 'object') {
                        itemRules.push({ required: true, message: 'Please input a value' });
                        rules[key] = itemRules;
                    }

                }
                if (this.schema.required) {
                    for (var i = 0; i < this.schema.required.length; i++) {
                        var prop = this.schema.required[i];
                        var itemRules = rules[prop];
                        if (!itemRules) {
                            itemRules = [];
                            rules[prop] = itemRules;
                        }
                        if (!itemRules) {
                            itemRules = [];
                            rules[key] = itemRules;
                        }
                        itemRules.push({ required: true, message: 'Please input a value' });
                    }
                }
                return rules;
            },
            tabs: function () {

                var groups = {};
                for (var key in this.fields) {
                    var el = this.fields[key];
                    var group = el['x-ui-group'];
                    if (group in groups == false) {
                        groups[group] = {};
                    }
                    groups[group][key] = el;
                };
                return groups;
                return Object.keys(groups).map(function (key) {
                    return {
                        key: key,
                        values: groups[key]
                    };
                });

                /*
                for (var key in this.properties) {
                    var group = this.properties[key]['x-ui-group'];
                    if (group) {
                        if (tabs.indexOf(group))
                    }
                }*/
            },
            isMobile: function () {
                return window.matchMedia("only screen and (max-width: 760px)").matches
            },
            labelPosition: function () {
                return this.isMobile ? 'top' : 'right';
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
            },
            propChange: function (key, value) {
                this.$set(this.model, key, value);
            }
        }
    }
    Vue.component('formcomp', form);
})();