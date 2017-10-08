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