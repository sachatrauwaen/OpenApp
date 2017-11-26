(function () {
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
		var CrudGrid = Vue.component('crud-grid');
		var CrudForm = Vue.component('crud-form');
		
        var router = new VueRouter({
            //scrollBehavior: () => ({ y: 0 }),
            routes: [

                route('/:module/:resource', CrudGrid, 'grid'),
                route('/:module/:resource/edit/:id', CrudForm, 'edit'),
                route('/:module/:resource/add', CrudForm, 'add'),
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
			template: "#appTemplate",
			mounted: function () {
				
			},
			data: {
				loading: true
			},
			methods: {
			},
			computed: {
				pageTitle: function() {
					if (this.$route.params.resource)
						return abp.localization.values['OpenApp'][this.$route.params.resource.capitalize()+'s'];
					else
						return "Crud app";
				},
			}
		})

})();