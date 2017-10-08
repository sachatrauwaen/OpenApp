var comp = {
    name: "comp",
    template: '<el-form-item :label="label" :prop="prop"> \
                    <component v-bind:is="currentView" v-model="model" v-bind="$props" ></component> \
                </el-form-item>',
    props: {
        value: {},
        schema: {},
        prop: String,
        messages: Object
    },
    components: {
        inputComponent: inputComponent,
        textareaComponent: textareaComponent,
        selectComponent: selectComponent,
        switchComponent: switchComponent,
        checkboxGroupComponent: checkboxGroupComponent,
        datetimeComponent: datetimeComponent,
        inputNumberComponent: inputNumberComponent
    },
    computed: {
        currentView: function () {
            var type = Array.isArray(this.schema.type) ? this.schema.type[0] : this.schema.type;
            if (this.schema["x-rel-app"]) {

            } else if (this.schema.enum || this.schema["x-enum-action"]) {
                if (type == 'array') {
                    return 'checkboxGroupComponent';
                } else {
                    return 'selectComponent';
                }
            } else if (type == 'boolean') {
                return 'switchComponent';
            } else if (type == 'integer' || type == 'number') {
                return 'inputNumberComponent';
            } else if (this.schema.format == 'date-time') {
                return 'datetimeComponent';
            } else if (this.schema['x-ui-multiline']) {
                return 'textareaComponent';
            } else {
                return 'inputComponent';
            }
        },
        model: {
            get() {
                return this.value
            },
            set(val) {
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
    }
}

Vue.component('comp', comp);