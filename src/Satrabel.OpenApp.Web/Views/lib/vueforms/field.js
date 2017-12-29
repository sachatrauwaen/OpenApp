(function () {
    var field = {
        name: "oaField",
        template: ' <el-form-item :label="label" :prop="prop"> \
                    <component v-bind:is="currentView" v-model="model" v-bind="$props" @propChange="propChange" ></component> \
                    </el-form-item>',
        props: {
            value: {},
            schema: {},
            prop: String,
            messages: Object,
            service: {},
        },       
        computed: {
            currentView: function () {
                var sch = this.schema.oneOf && this.schema.oneOf[0] ? this.schema.oneOf[0] : this.schema;
                var type = Array.isArray(sch.type) ? (sch.type[0] == "null" ? sch.type[1]:sch.type[0] ) : sch.type;
                if (sch["x-type"]) {
                    type = sch["x-type"];
                } else if (sch["x-rel-action"]) {
                    type = 'relation';
                } else if (sch.enum || sch["x-enum-action"]) {
                    if (type == 'array') {
                        type = 'checkbox-group';
                    } else {
                        type = 'select';
                    }
                } else if (type == 'boolean') {
                    type = 'switch';
                } else if (type == 'integer' || type == 'number') {
                    type = 'input-number';
                } else if (type == 'array' && this.schema.items.format == 'date-time') {
                    type = 'daterange';
                } else if (sch.format == 'date-time') {
                    type = 'datetime';
                } else if (sch['x-ui-multiline']) {
                    type = 'textarea';
                } else if (type == 'address') {
                    type = 'address';
                } else {
                    type = 'input';
                }
                var compName = 'oa-' + type;
                var comp = Vue.component(compName);
                if (!comp) {
                    comp = function (resolve, reject) {
                        Vue.$loadComponent({
                            name: compName,
                            path: abp.appPath+'lib/vueforms/'+type+'.js',
                            onLoad: resolve,
                            onError: reject
                        });
                    }
                }
                return comp;
            },
            model: {
                get: function () {
                    return this.value
                },
                set: function (val) {
                    this.$emit('input', val)
                }
            },
            label: function () {
                var name = this.schema.title ? this.schema.title : this.prop.capitalize();
                if (this.messages && this.messages[name])
                    return this.messages[name];
                else
                    return this.schema.title ? this.schema.title : name;
            },
        },
        methods: {
            propChange: function (key, value) {
                this.$emit('propChange', key, value);
            }
        }
    }

    Vue.component('oa-field', field);
})();