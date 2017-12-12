(function () {
    var comp = {
        name: "comp",
        template: '<el-form-item v-if="addFormItem" :label="label" :prop="prop"> \
                    <component v-bind:is="currentView" v-model="model" v-bind="$props" @propChange="propChange" ></component> \
                </el-form-item> \
                <component v-else v-bind:is="currentView" :label="label" :prop="prop" v-model="model" v-bind="$props" @propChange="propChange" ></component>',
        props: {
            value: {},
            schema: {},
            prop: String,
            messages: Object,
            service: {},
        },
        components: {
            inputComponent: Vue.component('input-component'),
            textareaComponent: Vue.component('textarea-component'),
            selectComponent: Vue.component('select-component'),
            switchComponent: Vue.component('switch-component'),
            checkboxGroupComponent: Vue.component('checkbox-group-component'),
            datetimeComponent: Vue.component('datetime-component'),
            daterangeComponent: Vue.component('daterange-component'),
            inputNumberComponent: Vue.component('input-number-component'),
            addressComponent: Vue.component('address-component'),
            relationComponent: Vue.component('relation-component')
        },
        computed: {
            currentView: function () {
                var sch = this.schema.oneOf && this.schema.oneOf[0] ? this.schema.oneOf[0] : this.schema;
                var type = Array.isArray(sch.type) ? (sch.type[0] == "null" ? sch.type[1]:sch.type[0] ) : sch.type;
                if (sch["x-type"]) {
                    type = sch["x-type"];
                }
                if (sch["x-rel-action"]) {
                    return 'relationComponent';
                } else if (sch.enum || sch["x-enum-action"]) {
                    if (type == 'array') {
                        return 'checkboxGroupComponent';
                    } else {
                        return 'selectComponent';
                    }
                } else if (type == 'boolean') {
                    return 'switchComponent';
                } else if (type == 'integer' || type == 'number') {
                    return 'inputNumberComponent';
                } else if (type == 'array' && this.schema.items.format == 'date-time') {
                    return 'daterangeComponent';
                } else if (sch.format == 'date-time') {
                    return 'datetimeComponent';
                } else if (sch['x-ui-multiline']) {
                    return 'textareaComponent';
                } else if (type == 'address') {
                    return 'addressComponent';
                } else {
                    return 'inputComponent';
                }
            },
            addFormItem: function () {
                return true;//this.currentView != 'relationComponent';
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

    Vue.component('comp', comp);
})();