
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