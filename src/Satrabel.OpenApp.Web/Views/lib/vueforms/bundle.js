(function () {
    var calendar = {
        name: "calendar",
        template: '<div></div>',
        props: {
            resources:{}
        },
        data: function () {
            var self = this;
            return {
                
            };
        },
        computed: {
            
        },
        methods: {
            option: function (name, value) {
                $(this.$el).fullCalendar('option', name, value);
            } 
        },
        watch: {
            'resources': function () {
                this.option('resources', this.resources);
            }
        },
        mounted() {
            let options = {
                schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                //slotDuration :'01:00:00',
                defaultView: 'agendaDay',
                //defaultDate: '2017-09-07',
                editable: true,
                selectable: true,
                eventLimit: true, // allow "more" link when too many events
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'agendaDay,agendaWeek,month'
                },
                views: {
                    agendaTwoDay: {
                        type: 'agenda',
                        duration: { days: 2 },

                        // views that are more than a day will NOT do this behavior by default
                        // so, we need to explicitly enable it
                        groupByResource: true

                        //// uncomment this line to group by day FIRST with resources underneath
                        //groupByDateAndResource: true
                    }
                },
			    allDaySlot: false,
                timezone: 'local',
                locale: 'fr',
                customButtons: {
                    addButton: {
                        text: 'Ajouter un job',
                        click: function () {
                            //alert('clicked the custom button!');
                            window.location.href = "/jobs#/events/add";
                        }
                    }
                },
                resources: this.resources,
                resources: function (callback) {
                    vm.$emit('resources', callback);
                },
                editable: false,
                height: $(window).height() - 220,
                events: function (start, end, timezone, callback) {
                    vm.$emit('events', start, end, timezone, callback);
                },
                /*
                eventRender: function (event, element) {
                    if (event.description){
                        //$(element).tooltip({ title: event.description });
                    }
                },
                */
                eventRender: function (event, element) {

                    let dateformat = "DD/MM/YYYY";

                    let start = event.start.format(dateformat);
                    let end = '';
                    if (event.end) {
                        start = event.start.format(dateformat);
                        end = event.end.format(dateformat);
                        if (event.allDay) {
                            end = event.end.clone().add(-1, 'day').format(dateformat);
                        }
                    }

                    let place = '';
                    if (event.location) {
                        place = " - " + event.location;
                    }
                    let placement = 'right';
                    if (event.start.day() === 0) {
                        placement = 'left';
                    }
                    element.text(event.title + place + " - " + start + (start == end ? '' : ' - ' + end));

                },
                
                eventClick: function (calEvent, jsEvent, view) {
                    //alert('Event: ' + calEvent.title);
                    //alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
                    //alert('View: ' + view.name);
                    vm.$emit('eventclick', calEvent, jsEvent, view);
                },
                viewRender: function (view) {
                    $('.fc-addButton-button').html('<i class="fa fa-plus-circle" aria-hidden="true"></i>');
                },
                dayClick: function (date, jsEvent, view, resourceObj) {
                    //alert('Clicked on: ' + date.format());
                    vm.$emit('dayclick', date, jsEvent, view, resourceObj);
                }
            };

            let vm = this;
            $(this.$el)
                // init select2
                .fullCalendar(options);


            //.val(this.value)
            //.trigger('change')
            // emit event on change.
            //.on('change', function () {
            //vm.$emit('input', this.value)
            //})

        },

        destroyed() {
            //$(this.$el).off().fullCalendar('destroy');
        }
    }
    Vue.component('fullcalendar', calendar);
})();
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
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        },

        resource() {
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
var datetimeComponent = {
    name: "datetimeComponent",
    template: '<el-date-picker v-model="model" type="datetime" ></el-date-picker>',
    props: {
        value: String,
        schema: {},
        prop: String,
        options: {

        },
    },
    computed: {
        model: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
}
var inputComponent = {
    name: "inputComponent",
    template: '<el-input v-model="model"></el-input>',
    props: {
        value: String,
        schema: {},
        prop: String,
        options: {

        },
    },
    computed: {
        model: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
}
var inputNumberComponent = {
    name: "inputNumberComponent",
    template: '<el-input-number v-model="model" ></el-input-number>',
    props: {
        value: Number,
        schema: {},
        prop: String,
        options: {

        },
    },
    computed: {
        model: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
}
var selectComponent = {
    name: "selectComponent",
    template: '<el-select v-model="model" placeholder="Select"><el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option ></el-select >',
    props: {
        value: {},
        schema: {},
        prop: String,
    },
    computed: {
        model: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        },
        options: function () {
            var lst = [];
            for (var i = 0; i < this.schema.enum.length; i++) {
                lst.push({ value: this.schema.enum[i], label: this.schema['x-enumNames'].toString() ? this.schema['x-enumNames'][i] : this.schema.enum.toString() })
            }
            return lst;
            //return this.schema.enum.map(function (val) {
            //    return { value: val, label: val };
            //});;
        },
    }
}
var switchComponent = {
    name: "switchComponent",
    template: '<el-switch v-model="model" on-text="" off-text=""></el-switch>',
    props: {
        value: Boolean,
        schema: {},
        prop: String,
        options: {

        },
    },
    computed: {
        model: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
}
var textareaComponent = {
    name: "textareaComponent",
    template: '<el-input type="textarea" autosize v-model="model"></el-input>',
    props: {
        value: String,
        schema: {},
        prop: String,
        options: {

        },
    },
    computed: {
        model: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
}
var DialogForm = {
    name: "DialogForm",
    template: '<formcomp ref="form" :model="model" :schema="schema" :actions="actions" :messages="messages"></formcomp>',
    props: {
        resource: {},
        value: {}
    },
    data: function () {
        var self = this;
        return {
            messages: abp.localization.values['OpenApp'],
            model: {},
            actions: [
                {
                    name: 'Save',
                    type: 'primary',
                    execute: function () {
                        self.$refs.form.validate((valid) => {
                            if (valid) {
                                self.saveData(self.model, function () {
                                    self.$message({
                                        type: 'success',
                                        message: 'Save completed'
                                    });
                                    self.$emit('close', self.model);
                                });
                            } else {
                                console.log('error submit!!');
                                return false;
                            }
                        });
                    }
                },
                {
                    name: 'Cancel',
                    execute: function () {
                        self.$emit('close');
                    }
                }
            ]
        };
    },
    computed: {
        id() {
            return this.value ? this.value[this.relationValueField] : null;
        },
        isnew() {
            return !this.value;
        },
        relationValueField: function () {
            return this.schema["x-rel-valuefield"] || 'id';
        },
        schema() {
            if (this.isnew)
                return jref.resolve(abp.schemas.app[this.resource].create.input);
            else
                return jref.resolve(abp.schemas.app[this.resource].update.input);
        }
    },
    methods: {
        fetchData() {
            var self = this;
            self.$refs.form.resetForm();
            if (!this.isnew) {
                abp.services.app[this.resource].get({ id: self.id }).done(function (data) {
                    self.model = data;
                    //this.pagination.totalItems = data.total;
                }).always(function () {
                    //abp.ui.clearBusy(_$app);
                });
            } else {
                self.model = {};
            }
        },
        saveData(data, callback) {
            var self = this;
            if (self.isnew) { // add
                abp.services.app[this.resource].create(data).done(function (newdata) {
                    self.model = newdata;
                    self.$emit('input', newdata[this.relationValueField]);
                    if (callback) callback();
                }).always(function () {
                    //abp.ui.clearBusy(_$app);
                });
            } else { // update
                data.id = self.id;
                abp.services.app[this.resource].update(data).done(function (newdata) {
                    self.model = newdata;
                    self.$emit('input', newdata.id);
                    if (callback) callback();
                }).always(function () {
                    //abp.ui.clearBusy(_$app);
                });
            }
        },
    },
    mounted() {
        this.fetchData();
    },

}
Vue.component('DialogForm', DialogForm);
var RelationComponent = {
    name: "RelationComponent",
    template: '<div><el-select v-model="model" :value-key="relationValueField" filterable clearable v-on:clear="clear" remote :remote-method="remoteMethod" :loading="loading"> \
                        <el-option v-for="item in options" :key="item.value.id" :label="item.label" :value="item.value"></el-option> \
                    </el-select> \
                <el-button icon="edit" v-on:click="edit"></el-button> \
                <el-dialog ref="customerDialog" title="Client" :visible.sync="dialogVisible" :size="dialogSize" :before-close="handleClose"> \
                <dialog-form ref="form" :resource="relationResource" v-model="model" v-on:close="close" ></dialog-form> \
                </el-dialog ></div>',
    props: {
        value: {},
        resource: {},
        prop: String,
    },
    data: function () {
        var self = this;
        return {
            form: {},
            messages: abp.localization.values['OpenApp'],
            loading: false,
            dialogVisible: false,
            options: [],
        };
    },
    computed: {
        relationResource: function () {
            return this.schema["x-rel-app"] || this.prop;
        },
        relationAction: function () {
            return this.schema["x-rel-action"] || 'get' + this.prop.capitalize() + 's';
        },
        relationValueField: function () {
            return this.schema["x-rel-valuefield"] || 'id';
        },
        relationTextField: function () {
            return this.schema["x-rel-textfield"] || 'fullName';
        },
        id: function () {
            return this.value ? this.value[this.relationValueField] : null;
        },
        isnew() {
            return !this.value;
        },
        schema() {
            if (this.isnew)
                return jref.resolve(abp.schemas.app[this.resource].create.input).properties[this.prop];
            else
                return jref.resolve(abp.schemas.app[this.resource].update.input).properties[this.prop];
        },
        model: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        },
        dialogSize: function () {
            return window.innerWidth < 700 ? 'large' : 'small';
        }
    },
    methods: {
        remoteMethod: function (query) {
            var self = this;
            if (!query && self.value) {
                this.options.push({ label: self.value[self.relationTextField], value: this.value });
            } else if (query && query !== '' && (!self.value || query != self.value[self.relationTextField])) {
                self.loading = true;
                abp.services.app[this.resource][self.relationAction](query).done(function (data) {
                    self.options = data.items.map(function (t) {
                        //return { label: t.firstname + " " + t.lastname, value: t.id };
                        return { label: t[self.relationTextField], value: t };
                    });
                    self.loading = false;
                }).always(function () {
                    //abp.ui.clearBusy(_$app);
                });
            } else if (query == '') {
                this.options = [];
            }
        },
        clear: function () {
            //this.form.customerId = null;
            this.model = null;
        },
        edit: function () {
            this.dialogVisible = true;
            if (this.$refs.form) this.$refs.form.fetchData();
        },
        handleClose: function (done) {
            done();
        },
        close: function (model) {
            var self = this;
            this.dialogVisible = false;
            if (model) {
                this.model = model;
                this.options = [{ label: model[self.relationTextField], value: model }];
            }
        }
    },
    created() {
    }
}
Vue.component('RelationComponent', RelationComponent);
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

var form = {
    name: "formcomp",
    template: '<el-form ref="form" :model="model" :rules="rules" label-position="right" label-width="150px"> \
                <el-tabs v-if="Object.keys(tabs).length > 1" :value="Object.keys(tabs)[0]">\
                    <el-tab-pane v-for="(gvalue, gkey) in tabs" :key="gkey" :label="label(gkey)" :name="gkey"> \
                        <comp v-for="(value, key) in gvalue" :key="key" :prop="key" :schema="properties[key]" v-model="model[key]" :messages="messages" ></comp> \
                    </el-tab-pane> \
                </el-tabs> \
                <comp v-else v-for="(value, key) in fields" :key="key" :prop="key" :schema="properties[key]" v-model="model[key]" :messages="messages" ></comp> \
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
                if (prop.required) {
                    itemRules.push({ required: true, message: 'Please input a value', trigger: 'blur' });
                }
                rules[key] = itemRules;
            }
            if (this.schema.required) {
                for (var i = 0; i < this.schema.required.length; i++) {
                    var prop = this.schema.required[i];
                    var itemRules = rules[prop];
                    if (!itemRules) {
                        itemRules = [];
                        rules[key] = itemRules;
                    }
                    itemRules.push({ required: true, message: 'Please input a value', trigger: 'blur' });
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
        }
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
Vue.component('formcomp', form);

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
var CrudForm = {
    name: "CrudForm",
    template: '<formcomp ref="form" :model="model" :schema="schema" :actions="actions" :messages="messages"></formcomp>',
    props: {
    },
    data: function () {
        var self = this;
        return {
            messages: abp.localization.values['OpenApp'],
            model: {},
            actions: [
                {
                    name: 'Save',
                    type: 'primary',
                    execute: function () {
                        self.$refs.form.validate((valid) => {
                            if (valid) {
                                self.saveData(self.model, function () {
                                    self.$message({
                                        type: 'success',
                                        message: 'Save completed'
                                    });
                                    self.$router.push({ name: 'grid', params: { resource: self.resource } });
                                });
                            } else {
                                console.log('error submit!!');
                                return false;
                            }
                        });
                    }
                },
                {
                    name: 'Cancel',
                    execute: function () {
                        self.$router.push({ name: 'grid', params: { resource: self.resource } })
                    }
                }
            ]
        };
    },
    computed: {
        resource() {
            return this.$route.params.resource;
        },
        id() {
            return this.$route.params.id;
        },
        isnew() {
            return !this.id;
        },
        schema() {
            if (this.isnew)
                return jref.resolve(abp.schemas.app[this.resource].create.input);
            else
                return jref.resolve(abp.schemas.app[this.resource].update.input);
        },
        options() {
            /*
            if (abp.forms.app[this.resource] && abp.forms.app[this.resource].options)
                return abp.forms.app[this.resource].options;
            else
            */
            return null;
        },
    },
    methods: {
        fetchData() {
            var self = this;
            if (!this.isnew) {
                abp.services.app[this.resource].get({ id: self.id }).done(function (data) {
                    self.model = data;
                    //this.pagination.totalItems = data.total;
                }).always(function () {
                    //abp.ui.clearBusy(_$app);
                });
            }
        },
        saveData(data, callback) {
            var self = this;
            if (self.isnew) { // add
                abp.services.app[this.resource].create(data).done(function (newdata) {
                    if (callback) callback();
                    //this.pagination.totalItems = data.total;
                }).always(function () {
                    //abp.ui.clearBusy(_$app);
                });
            } else { // update
                data.id = self.id;
                abp.services.app[this.resource].update(data).done(function (newdata) {
                    if (callback) callback();
                    //this.pagination.totalItems = data.total;
                }).always(function () {
                    //abp.ui.clearBusy(_$app);
                });
            }
        },
    },
    created() {
        //this.$store.commit('setPageTitle', global.helper.i.titleize(global.helper.i.pluralize(this.resource)))
        //this.fetchGrid().then(() => { })
        this.fetchData();
    },
    watch: {
        // call again the method if the route changes
        '$route': function () {
            this.fetchData();
        }
    },
}
Vue.component('CrudForm', CrudForm);

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

var CrudGrid = {
    name: "CrudGrid",
    template: '<div> \
                <filterform v-if="hasFilter" ref="filterform" :model="filterModel" :schema="filterSchema" :actions="filterActions" :messages="messages"></filterform> \
                <gridcomp :model="model" :schema="schema" :messages="messages" :options="options" :actions="gridActions"></gridcomp><br /> \
                <el-button v-for="action in actions" :key="action.name" :icon="action.icon" size="small" :type="action.type" @click="action.execute()">{{action.name}}</el-button> \
                <div style="float:right"><el-pagination @current-change="currentPageChange" :current-page.sync="currentPage" :page-size="pageSize"  layout="total, prev, pager, next" :total="totalCount"></el-pagination></div> \
                </div>',
    props: {

    },
    data: function () {
        return {
            model: [],
            filterModel: { },
            totalCount: 0,
            currentPage: 1,
            pageSize:10,
        };
    },
    computed: {
        resource() {
            return this.$route.params.resource;
        },
        schema() {
            return abp.schemas.app[this.resource].get.returnValue;
        },
        messages: function () {
            return abp.localization.values['OpenApp'];
        },
        gridActions: function () {
            var self = this;
            return [
                {
                    name: self.translate('Edit'),
                    execute: function (row) {
                        self.$router.push({ name: 'edit', params: { resource: self.resource, id: row.id } })
                    },
                    icon:'edit'
                },
                {
                    name: self.translate('Delete'),
                    icon:'delete',
                    execute: function (row) {
                        self.$confirm('Confirm delete ?', this.translate('Delete'), {
                            confirmButtonText: 'OK',
                            cancelButtonText: 'Cancel',
                            type: 'warning'
                        }).then(() => {

                            self.deleteData(row, function () {
                                self.$message({
                                    type: 'success',
                                    message: this.translate('Delete completed')
                                });
                            })
                        }).catch(() => {

                        });

                    }
                }
            ]
        },
        actions: function () {
            var self = this;
            return [
                {
                    name: self.translate('Add'),
                    icon:'plus',
                    type: 'primary',
                    execute: function () {
                        self.$router.push({ name: 'add', params: { resource: self.resource } })
                    }
                }
            ]
        },
        filterSchema() {
            var schema = { properties: {}};
            var action = abp.schemas.app[this.resource].getAll;
            for (var key in action) {
                if (key != 'returnValue' && key != 'skipCount' && key != 'maxResultCount') {
                    schema.properties[key] = this.schema.properties[key];
                }
            }
            return schema;
        },
        hasFilter: function () {
            return Object.keys(this.filterSchema.properties).length > 1;
        },
        filterActions: function () {
            var self = this;
            return [
                {
                    name: this.translate('Reset'),
                    execute: function () {
                        self.$refs.filterform.resetForm();
                        self.fetchData();
                    }
                },
                {
                    name: this.translate('Search'),
                    type: 'primary',
                    execute: function () {
                        self.fetchData();
                    }
                }
            ]
        },
        options() {
            /*
            if (abp.grids.app[this.resource] && abp.grids.app[this.resource].options)
                return abp.grids.app[this.resource].options;
            else
                return null;
            
            var cols = [];
            for (var key in this.schema.properties) {
                cols.push(key);
            }
            */
            return null;
        },
        totalPages() {
            return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage);
        }
    },
    methods: {
        currentPageChange: function (val) {
            this.fetchData();
        },
        fetchData(callback) {
            var self = this;
            self.filterModel.skipCount = (this.currentPage-1) * this.pageSize;
            self.filterModel.maxResultCount = this.pageSize;
            //{ skipCount: 0, maxResultCount: 999 }
            abp.services.app[this.resource].getAll(self.filterModel).done(function (data) {
                self.model = data.items;
                self.totalCount = data.totalCount;
                if (callback) callback();
                //this.pagination.totalItems = data.total;
            }).always(function () {
                //abp.ui.clearBusy(_$app);
            });
        },
        deleteData(data, callback) {
            var self = this;
            abp.services.app[this.resource].delete({ id: data.id }).done(function (data) {
                self.fetchData(callback);
            }).always(function () {
                //abp.ui.clearBusy(_$app);
            });
        },
        translate:function (text) {
            if (this.messages && this.messages[text])
                return this.messages[text];
            else
                return text;
        }
    },
    created() {
        //this.$store.commit('setPageTitle', global.helper.i.titleize(global.helper.i.pluralize(this.resource)))
        //this.fetchGrid().then(() => { })
        this.fetchData()
    },
    watch: {
        // call again the method if the route changes
        '$route': function () {
            this.fetchData();
        }
    },
}
Vue.component('CrudGrid', CrudGrid);
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

Array.prototype.groupBy = function (keyFunction) {
    var groups = {};
    this.forEach(function (el) {
        var key = keyFunction(el);
        if (key in groups == false) {
            groups[key] = [];
        }
        groups[key].push(el);
    });
    return Object.keys(groups).map(function (key) {
        return {
            key: key,
            values: groups[key]
        };
    });
};

jref = require('json-ref-lite');
//console.dir(jref.resolve(abp.schemas.app.job.get.returnValue));