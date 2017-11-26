(function () {
    var CrudForm = {
        name: "CrudForm",
        template: '<formcomp ref="form" :model="model" :schema="schema" :actions="actions" :service="service" :messages="messages"></formcomp>',
        props: {
        },
        data: function () {
            var self = this;
            return {
                
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
            module: function () {
                return this.$route.params.module;
            },
            resource: function () {
                return this.$route.params.resource;
            },
            messages: function () {
                return abp.localization.values[this.module];
            },
            id: function () {
                return this.$route.params.id;
            },
            isnew: function () {
                return !this.id;
            },
            schema: function () {
                if (this.isnew)
                    return jref.resolve(abp.schemas.app[this.resource].create.parameters.input);
                else
                    return jref.resolve(abp.schemas.app[this.resource].update.parameters.input);
            },
            options: function () {
                /*
                if (abp.forms.app[this.resource] && abp.forms.app[this.resource].options)
                    return abp.forms.app[this.resource].options;
                else
                */
                return null;
            },
            service: function () {
                return abp.services.app[this.resource];
            }
        },
        methods: {
            fetchData: function () {
                var self = this;
                if (!this.isnew) {
                    self.service.get({ id: self.id }).done(function (data) {
                        self.model = data;
                        //this.pagination.totalItems = data.total;
                    }).always(function () {
                        //abp.ui.clearBusy(_$app);
                    });
                }
            },
            saveData: function (data, callback) {
                var self = this;
                if (self.isnew) { // add
                    self.service.create(data).done(function (newdata) {
                        if (callback) callback();
                        //this.pagination.totalItems = data.total;
                    }).always(function () {
                        //abp.ui.clearBusy(_$app);
                    });
                } else { // update
                    data.id = self.id;
                    self.service.update(data).done(function (newdata) {
                        if (callback) callback();
                        //this.pagination.totalItems = data.total;
                    }).always(function () {
                        //abp.ui.clearBusy(_$app);
                    });
                }
            },
        },
        created: function () {
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
    Vue.component('crud-form', CrudForm);
})();