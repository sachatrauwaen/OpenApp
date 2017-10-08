
var grid = {
    name: "gridcomp",
    template: '<el-table :data="model" style="width: 100%" > \
                <el-table-column v-for="(value, key) in columns" :key="key" :prop="key" :label="label(key)"  :formatter="formatter" ></el-table-column><el-table-column> \
                <template scope="scope"><el-button v-for="action in actions" :key="action.name" :icon="action.icon" size="small" @click="action.execute(scope.row, scope.$index)">{{action.name}}</el-button></template> \
                </el-table-column></el-table>',
    props: {
        model: {},
        schema: {},
        options: {},
        messages: {},
        actions: {},
        pageSize: {
            type: Number,
            default: function () { return 20 }
        },
        paginationAlign: {
            type: String,
            default: function () { return 'center' },
            validator: val => ['left', 'right', 'center'].includes(val)
        }
    },
    data: function () {
        var self = this;
        return {

        };
    },
    computed: {
        columns: function () {
            if (this.options) {
                return this.options.fields;
            }
            else {
                var fields = {};
                for (var key in this.schema.properties) {
                    if (key != 'id' &&
                        (!this.schema.properties[key].hasOwnProperty("x-ui-grid") || this.schema.properties[key]["x-ui-grid"])
                    ) {
                        fields[key] = this.schema.properties[key];
                    }
                }
                return fields;
            }
        },
    },
    methods: {
        label(prop) {
            var name = this.schema.properties[prop].title ? this.schema.properties[prop].title : prop.capitalize();
            if (this.messages && this.messages[name])
                return this.messages[name];
            else
                return name;
        },
        formatter(row, column, cellValue) {
            if (typeof (cellValue) === "boolean") {
                return cellValue ? 'Yes' : 'No';
            } else {
                return cellValue;
            }
            
        }
    }
}
Vue.component('gridcomp', grid);