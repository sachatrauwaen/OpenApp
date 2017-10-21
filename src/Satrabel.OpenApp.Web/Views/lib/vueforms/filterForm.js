
var filterform = {
    name: "filterform",
    template: '<el-form ref="form" :model="model" :rules="rules" label-position="right" label-width="150px" :inline="true"> \
                <comp v-for="(value, key) in fields" :key="key" :prop="key" :schema="properties[key]" v-model="model[key]" :messages="messages" ></comp> \
                <el-form-item> \
                    <el-button v-for="action in actions" :key="action.name" :type="action.type" @click="action.execute()">{{action.name}}</el-button> \
                </el-form-item> \
                </el-form>',
    props: {
        model: {},
        schema: {},
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
        
    },
    methods: {
        validate(callback) {
            this.$refs.form.validate((valid) => {
                if (callback) callback(valid);
            });
        },
        submitForm(formName) {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm() {
            this.$refs.form.resetFields();
        },
        label(name) {
            //var name = this.schema.properties[prop].title ? this.schema.properties[prop].title : prop.capitalize();
            if (this.messages && this.messages[name])
                return this.messages[name];
            else
                return name;
        }
    }
}
Vue.component('filterform', filterform);