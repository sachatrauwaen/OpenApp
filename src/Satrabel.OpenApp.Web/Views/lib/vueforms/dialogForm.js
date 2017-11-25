(function () {
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
                messages: abp.localization.values['JobManager'],
                model: {},
                actions: [
                    {
                        name: 'Save',
                        type: 'primary',
                        execute: function () {
                            self.$refs.form.validate(function (valid) {
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
            id: function () {
                return this.value ? this.value[this.relationValueField] : null;
            },
            isnew: function () {
                return !this.value;
            },
            relationValueField: function () {
                return this.schema["x-rel-valuefield"] || 'id';
            },
            schema: function () {
                if (this.isnew)
                    return jref.resolve(abp.schemas.app[this.resource].create.parameters.input);
                else
                    return jref.resolve(abp.schemas.app[this.resource].update.parameters.input);
            }
        },
        methods: {
            fetchData: function () {
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
            saveData: function (data, callback) {
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
        mounted: function () {
            this.fetchData();
        },
    }
    Vue.component('DialogForm', DialogForm);
})();