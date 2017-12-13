(function () {
    var RelationComponent = {
        name: "RelationComponent",
        template: '<div> \
                    <el-select v-model="model" :value-key="relationValueField" filterable clearable v-on:clear="clear" remote :remote-method="remoteMethod" :loading="loading" > \
                        <el-option v-for="item in options" :key="item.value.id" :label="item.label" :value="item.value"></el-option> \
                    </el-select> \
                <el-button  v-if="relationResource" :icon="buttonIcon" v-on:click="edit"></el-button> \
                 <slot name="footer"></slot> \
                <el-dialog v-if="relationResource" ref="customerDialog" title="Client" :visible.sync="dialogVisible" :size="dialogSize" :before-close="handleClose" :append-to-body="true"> \
                    <dialog-form ref="form" :resource="relationResource" v-model="model" v-on:close="close" ></dialog-form> \
                </el-dialog > \
                </div>',
        props: {
            value: {},
            schema: {},
            service: {},
            prop: String,
            label: String
        },
        data: function () {
            var self = this;
            return {
                form: {},
                messages: abp.localization.values['JobManager'],
                loading: false,
                dialogVisible: false,
                options: [],
            };
        },
        computed: {
            relationResource: function () {
                return this.schema["x-rel-app"];
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
            isnew: function () {
                return !this.value;
            },
            //schema: function() {
            //    if (this.isnew)
            //        return jref.resolve(abp.schemas.app[this.resource].create.input).properties[this.prop];
            //    else
            //        return jref.resolve(abp.schemas.app[this.resource].update.input).properties[this.prop];
            //},
            model: {
                get: function () {
                    return this.value
                },
                set: function (val) {
                    this.$emit('input', val)
                }
            },
            dialogSize: function () {
                return window.innerWidth < 700 ? 'full' : 'small';
            },
            buttonIcon: function () {
                return this.isnew ? "el-icon-plus" : "el-icon-edit";
            }

        },
        watch: {
            value: function (val, oldVal) {
                var self = this;
                if (val) {
                    this.options= [{ label: self.value[self.relationTextField], value: val }];
                }    
            }
        },
        methods: {
            remoteMethod: function (query) {
                var self = this;
                if (!query && self.value) {
                    this.options.push({ label: self.value[self.relationTextField], value: this.value });
                } else if (query && query !== '' && (!self.value || query != self.value[self.relationTextField])) {
                    self.loading = true;
                    self.service[self.relationAction](query).done(function (data) {
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
        created: function () {
            var self = this;
            if (this.value) {
                this.options = [{ label: self.value[self.relationTextField], value: this.value }];
            }   
        }
    }
    Vue.component('relation-component', RelationComponent);
})();