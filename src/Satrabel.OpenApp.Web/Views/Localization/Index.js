(function () {

    var grid = {
        name: 'grid',
        template: '#gridTemplate',
        props: {

        },
        data: function () {
            return {
                model: [],
                filterModel: {},
                totalCount: 0,
                currentPage: 1,
                pageSize: 25,
            };
        },
        computed: {
            module: function () {
                return 'OpenApp'; //this.$route.params.module;
            },
            resource: function () {
                return 'localization'; //this.$route.params.resource;
            },
            service: function () {
                return abp.services.app[this.resource];
            },
            schema: function () {
                return jref.resolve(abp.schemas.app[this.resource].get.returnValue);
            },
            messages: function () {
                return abp.localization.values[this.module];
            },
            columns: function () {
                var fields = {};
                for (var key in this.schema.properties) {
                    if (key != 'id' &&
                        (!this.schema.properties[key].hasOwnProperty('x-ui-grid') || this.schema.properties[key]['x-ui-grid'])
                    ) {
                        fields[key] = this.schema.properties[key];
                    }
                }
                return fields;
            },

            gridActions: function () {
                var self = this;
                return [
                    {
                        name: self.translate('Edit'),
                        icon: 'el-icon-edit',
                        execute: function (row) {
                            self.$router.push({ name: 'edit', params: { resource: self.resource, id: row.id } });
                        }
                    },
                    {
                        name: self.translate('Delete'),
                        icon: 'el-icon-delete',
                        execute: function (row) {
                            self.$confirm('Confirm delete ?', self.translate('Delete'), {
                                confirmButtonText: 'OK',
                                cancelButtonText: 'Cancel',
                                type: 'warning'
                            }).then(function () {

                                self.deleteData(row, function () {
                                    self.$message({
                                        type: 'success',
                                        message: self.translate('Delete completed')
                                    });
                                });
                            }).catch(function () {

                            });

                        }
                    }
                ];
            },
            defaultAction: function () {
                return this.gridActions[0];
            },
            filterSchema: function () {
                var schema = { properties: {} };
                var parameters = abp.schemas.app[this.resource].getAll.parameters;
                var keys = Object.keys(parameters);
                if (keys.length == 1 && parameters[keys[0]].type == 'object') { // httppost
                    parameters = parameters[keys[0]].properties;
                }
                for (var key in parameters) {
                    if (key != 'skipCount' && key != 'maxResultCount') {
                        schema.properties[key] = parameters[key];
                    }
                }
                return schema;
            },
            hasFilter: function () {
                return Object.keys(this.filterSchema.properties).length > 0;
            },
            filterActions: function () {
                var self = this;
                return [
                    {
                        name: self.translate('Search'),
                        type: 'primary',
                        execute: function () {
                            self.fetchData();
                        }
                    },
                    {
                        name: self.translate('Reset'),
                        execute: function () {
                            self.$refs.filterform.resetForm();
                            self.fetchData();
                        }
                    }
                ];
            },
            totalPages: function () {
                return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage);
            }
        },
        methods: {
            currentPageChange: function (val) {
                this.fetchData();
            },
            fetchData: function (callback) {
                var self = this;
                self.filterModel.skipCount = (this.currentPage - 1) * this.pageSize;
                self.filterModel.maxResultCount = this.pageSize;
                //{ skipCount: 0, maxResultCount: 999 }
                abp.services.app[this.resource].getAll(self.filterModel).done(function (data) {
                    self.model = data.items;
                    self.totalCount = data.totalCount;
                    if (callback) callback();
                }).always(function () {
                    //abp.ui.clearBusy(_$app);
                });
            },
            //deleteData: function (data, callback) {
            //    var self = this;
            //    abp.services.app[this.resource].delete({ id: data.id }).done(function (data) {
            //        self.fetchData(callback);
            //    }).always(function () {

            //    });
            //},
            translate: function (text) {
                if (this.messages && this.messages[text])
                    return this.messages[text];
                else
                    return text;
            },
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
                    return cellValue ? this.messages['Yes'] : this.messages['No'];
                } else if (schema.format == 'date-time') {
                    if (!cellValue) return '';
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
            rowChanged: function (row) {
                Vue.set(row, 'changed', true);
            },
            save: function (row) {
                var self = this;
                abp.services.app[this.resource].save(row).done(function (data) {
                    row.changed = false;
                    self.$message({
                        type: 'success',
                        message: 'Save completed'
                    });
                }).always(function () {
                    //abp.ui.clearBusy(_$app);
                });
            }
        },
        created: function () {
            this.fetchData();

        },
        watch: {
            // call again the method if the route changes
            '$route': function () {
                this.fetchData();
            }
        }
    };

    Vue.use(VueRouter);
    function route(path, component, name, children) {
        return {
            exact: true,
            path,
            name,
            children,
            component: component
        };
    }

    //const crudForm = Vue.component('crud-form');

    const router = new VueRouter({
        routes: [

            route('/', grid, 'grid'),
            //route('/:module/:resource', crudGrid, 'grid'),
            //route('/:module/:resource/edit/:id', crudForm, 'edit'),
            //route('/:module/:resource/add', crudForm, 'add'),
            //route('/crud/:resource/:id/:action', 'CrudForm', 'action'),
            //route('/crud/:resource/:action', 'CrudForm', 'indexAction')

            // Global redirect for 404
            // { path: '*', redirect: '/error', query: {code: 404, message: 'Page Not Found.'} }
        ]
    });

    ELEMENT.locale(ELEMENT.lang.fr);
    new Vue({
        router: router,
        el: '#app',
        template: '#appTemplate',
        mounted: function () {

        },
        data: {
            loading: true
        },
        methods: {
        },
        computed: {
            pageTitle: function () {
                //if (this.$route.params.resource)
                //    return abp.localization.values['OpenApp'][this.$route.params.resource.capitalize() + 's'];
                //else
                return 'LocalizationManager';
            }
        }
    });

})();