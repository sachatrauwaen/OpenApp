(function () {
    var RelationComponent = {
        name: "RelationComponent",
        template: '<div> \
                    <el-input v-if="isMobile" slot="reference" v-model="searchInput" v-on:blur="search" placeholder="search" clearable >\
                    </el-input>\
                    <el-select ref="select" v-model="model" :value-key="relationValueField" :filterable="!isMobile" :automatic-dropdown="isMobile" :clearable="!isMobile" v-on:clear="clear" remote :remote-method="remoteMethod" :loading="loading" > \
                        <el-option v-for="item in options" :key="item.value.id" :label="item.label" :value="item.value"></el-option> \
                    </el-select> \
                    <el-button  v-if="relationResource" :icon="buttonIcon" v-on:click="edit"></el-button> \
                    <slot name="footer"></slot> \
                    <el-dialog v-if="relationResource" ref="customerDialog" title="Client" :visible.sync="dialogVisible" :fullscreen="fullscreen" :before-close="handleClose" :append-to-body="true" @open="openDialog" @close="closeDialog"> \
                        <oa-dialog-form ref="form" :resource="relationResource" v-model="model" v-on:close="close" ></oa-dialog-form> \
                    </el-dialog > \
                </div>',
        props: {
            value: {},
            schema: {},
            messages: Object,
            service: {},
            prop: String,
            label: String
        },
        data: function () {
            var self = this;
            return {
                form: {},                
                loading: false,
                dialogVisible: false,
                options: [],
                popoverVisible: false,
                searchInput:''
            };
        },
        computed: {
            sch: function () {
                return this.schema.oneOf && this.schema.oneOf[0] ? this.schema.oneOf[0] : this.schema;
            },
            relationResource: function () {
                return this.sch["x-rel-app"];
            },
            relationAction: function () {
                return this.sch["x-rel-action"] || 'get' + this.prop.capitalize() + 's';
            },
            relationValueField: function () {
                return this.sch["x-rel-valuefield"] || 'id';
            },
            relationTextField: function () {
                return this.sch["x-rel-textfield"] || 'fullName';
            },
            id: function () {
                return this.value ? this.value[this.relationValueField] : null;
            },
            isnew: function () {
                return !this.value;
            },
            isMobile: function () {
                return VueForms.isMobile();
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
            isMobile: function () {
                return window.matchMedia("only screen and (max-width: 760px)").matches
            },
            fullscreen: function () {
                return this.isMobile;
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
                    this.options = [];
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
            },
            openDialog: function () {
                if (this.fullscreen) {
                    //document.body.style.position = 'fixed'; // for ios cursor bug
                    document.body.classList.add("dialog-open");
                }
            },
            closeDialog: function () {
                if (this.fullscreen) {
                    //document.body.style.position = ''; // for ios cursor bug
                    document.body.classList.remove("dialog-open");
                }
            },
            search: function () {
                this.remoteMethod(this.searchInput);
                this.$refs.select.focus();
            }
        },
        created: function () {
            var self = this;
            if (this.value) {
                this.options = [{ label: self.value[self.relationTextField], value: this.value }];
            }   
        }
    }
    Vue.component('oa-relation', RelationComponent);
})();