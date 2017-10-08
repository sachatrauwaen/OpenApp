(function () {
    $(function () {
       
        Vue.use(VueRouter);
        function route(path, component, name, children) {
            return {
                exact: true,
                path,
                name,
                children,
                component: component
            }
        }
        const router = new VueRouter({
            //base: __dirname,
            //mode: 'hash',
            //scrollBehavior: () => ({ y: 0 }),
            routes: [
                //route('/login', 'Login', 'login'),
                //route('/error', 'Error', 'error'),

                route('/app/:resource', CrudGrid, 'grid'),
                route('/app/:resource/edit/:id', CrudForm, 'edit'),
                route('/app/:resource/add', CrudForm, 'add'),
                //route('/crud/:resource/:id/:action', 'CrudForm', 'action'),
                //route('/crud/:resource/:action', 'CrudForm', 'indexAction')

                // Global redirect for 404
                // { path: '*', redirect: '/error', query: {code: 404, message: 'Page Not Found.'} }
            ]
        });

        var initVue = function () {
            ELEMENT.locale(ELEMENT.lang.fr);
            new Vue({
                router: router,
                el: '#app',
                template: "#appTemplate",
                mounted: function () {
                    
                },
                data: {
                    loading: true
                },
                methods: {
                },
                computed: {
                    pageTitle() {
                        if (this.$route.params.resource)
                            return abp.localization.values['OpenApp'][this.$route.params.resource.capitalize()+'s'];
                        else
                            return "Crud app";
                    },
                }
            })

        }
        initVue();
        /*
        abp.services.app.role.getAllPermissions().done(function (data) {
            abp.schemas.app.role.create.input.properties.permissions.enum = data.items.map(function (p) {
                return p.name
            });
            abp.schemas.app.role.update.input.properties.permissions.enum = abp.schemas.app.role.create.input.properties.permissions.enum;

            abp.services.app.user.getRoles({ skipCount: 0, maxResultCount: 999 }).done(function (data) {

                roles = data.items;
                abp.schemas.app.user.create.input.properties.roleNames.enum = roles.map(function (role) {
                    return role.normalizedName;
                });
                abp.schemas.app.user.update.input.properties.roleNames.enum = abp.schemas.app.user.create.input.properties.roleNames.enum

                initVue();

            }).always(function () {
                //abp.ui.clearBusy(_$app);
            });
            
        }).always(function () {
            //abp.ui.clearBusy(_$app);
        });
        */
    });
})();