﻿(function () {
    var RelationToManyComponent = {
        name: "RelationToManyComponent",
        template: '<div> \
                    <el-select multiple @input="updateModel" :value="model" :value-key="relationValueField" filterable clearable v-on:clear="clear" remote :remote-method="remoteMethod" :loading="loading" > \
                        <el-option v-for="item in computedOptions" :key="item.value.id" :label="item.label" :value="item.value"></el-option> \
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
                options: null,
            };
        },
        computed: {
            relationResource: function () {
                return this.schema["x-rel-to-many-app"];
            },
            relationAction: function () {
                return this.schema["x-rel-to-many-action"] || 'get' + this.prop.capitalize() + 's';
            },
            relationValueField: function () {
                return this.schema["x-rel-to-many-valuefield"] || 'id';
            },
            relationTextField: function () {
                return this.schema["x-rel-to-many-textfield"] || 'fullName';
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
            fullscreen: function () {
                return window.innerWidth < 700;
            },
            buttonIcon: function () {
                return this.isnew ? "el-icon-plus" : "el-icon-edit";
            },
            computedOptions: function () {
                var baseOptions = [];

                if (this.value) {
                    baseOptions = this.value.map(function (t) {
                        return { label: t[this.relationTextField], value: t };
                    }.bind(this));
                }
                if (this.options) {
                    var retval = baseOptions.concat(this.options);
                    // Remove duplicates
                    retval = retval.filter(function (item, index, arr) {
                        var firstIndex = arr.findIndex(function (element) {
                            return element.value[this.relationValueField] == item.value[this.relationValueField];
                        }.bind(this));
                        if (firstIndex == index) return item;
                    }.bind(this));
                    return retval;
                }

                if (baseOptions.length <= 0) return null;
                return baseOptions;
            }
        },
        //watch: {
        //    value: function (val, oldVal) {
        //        var self = this;
        //        if (val) {
        //            this.options= [{ label: self.value[self.relationTextField], value: val }];
        //        }    
        //    }
        //},
        methods: {
            remoteMethod: function (query) {
                var self = this;
                if (!query && self.value) {
                    //this.options.push({ label: self.value[self.relationTextField], value: this.value });
                    this.options = null;
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
                    this.options = null;
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
                    //this.options = [{ label: model[self.relationTextField], value: model }];
                    this.options = null;
                }
            },
            updateModel: function (value) {
                console.log(value);
                this.model = value;
                //this.$emit('input', value);
            },
            openDialog: function () {
                if (this.fullscreen) {
                    document.body.style.position = 'fixed'; // for ios cursor bug
                }
            },
            closeDialog: function () {
                if (this.fullscreen) {
                    document.body.style.position = ''; // for ios cursor bug
                }
            }
        }
    }
    Vue.component('oa-relation-to-many', RelationToManyComponent);
})();