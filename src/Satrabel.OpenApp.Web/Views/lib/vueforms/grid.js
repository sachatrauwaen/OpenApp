(function () {
    var grid = {
        name: "oa-grid",
        template: '<div> \
                    <el-table v-if="!isMobile" :data="model" @row-click="rowClick" style="width: 100%" :row-style="{cursor: \'pointer\'}"  > \
                        <el-table-column v-for="(value, key) in columns" :key="key" :prop="key" :label="label(key)" :formatter="formatter" class-name="crudcell" ></el-table-column> \
                        <el-table-column align="right" min-width="120px"> \
                        <template slot-scope="scope"><el-button v-for="action in actions" :key="action.name" :icon="action.icon" size="small" v-show="actionVisible(action, scope.row, scope.$index)" @click="action.execute(scope.row, scope.$index)"></el-button></template> \
                        </el-table-column> \
                    </el-table> \
                    <el-card v-else style="margin-bottom:10px;" v-for="row in model" :key="row.id" > \
                        <el-row :gutter="10" v-for="(value, key) in columns" :key="key" > \
                            <el-col :span="12">{{label(key)}}</el-col> \
                            <el-col :span="12">{{row[key]}}</el-col> \
                        </el-row> \
                        <div style="padding-top:10px;"> \
                        <el-button v-for="action in actions" :key="action.name" :icon="action.icon" size="small" v-show="actionVisible(action, row)" @click="action.execute(row)"></el-button> \
                        </div> \
                    </el-card> \
                </div>',
        props: {
            model: {},
            schema: {},
            messages: {},
            actions: {},
            defaultAction: {}
        },
        computed: {
            columns: function () {
                var fields = {};
                for (var key in this.schema.properties) {
                    if (key != 'id' && this.schema.properties[key].type != "array" &&
                        (!this.schema.properties[key].hasOwnProperty("x-ui-grid") || this.schema.properties[key]["x-ui-grid"])
                    ) {
                        fields[key] = this.schema.properties[key];
                    }
                }
                return fields;
            },
            isMobile: function () {
                return window.matchMedia("only screen and (max-width: 760px)").matches
            },
        },
        methods: {
            label: function (prop) {
                var name = this.schema.properties[prop].title ? this.schema.properties[prop].title : prop.capitalize();
                if (this.messages && this.messages[name])
                    return this.messages[name];
                else
                    return name;
            },
            formatter: function (row, column, cellValue) {
                var schema = this.schema.properties[column.property];
                if (schema.type == 'boolean') {
                    return cellValue ? this.messages["Yes"] : this.messages["No"];
                } else if (schema.format == 'date-time') {
                    if (!cellValue) return "";
                    return moment(cellValue).locale('fr').format('lll');
                } else if (schema.enum) {
                    var i = schema.enum.indexOf(cellValue);
                    return this.messages[schema['x-enumNames'][i]];
                } else if (schema.oneOf && schema.oneOf.length > 0 && schema.oneOf[0].enum) {
                    var i = schema.oneOf[0].enum.indexOf(cellValue);
                    return this.messages[schema.oneOf[0]['x-enumNames'][i]];
                }
                return cellValue;
            },
            rowClick: function (row, event, column) {
                if (column.label) {
                    this.defaultAction.execute(row, event, column);
                }
            },
            actionVisible: function (action, row, index) {
                if (action.visible) {
                    return action.visible(row, index);                
                } else {
                    return true;
                }
            }
        }
    }
    Vue.component('oa-grid', grid);
})();