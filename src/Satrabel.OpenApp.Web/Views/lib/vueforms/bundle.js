(function () {
    var addressComponent = {
        name: "addressComponent",
        template: '<div class="el-input"><input ref="autocompvare" type="text" class="el-input__inner" :id="id" :placeholder="placeholder" v-model="autocompleteText" v-on:focus="onFocus()" v-on:blur="onBlur()" v-on:change="onChange" v-on:keypress="onKeyPress" style="width : 500px" ></input></div>',
        props: {
            value: Object,
            schema: {},
            prop: String,
            schema: {},
            options: {},
            messages: {},
            id: {
                type: String,
                //required: true,
                default: function () {
                    return "address" + Math.floor((Math.random() * 1000) + 1);
                }
            },
            placeholder: {
                type: String,
                default: 'Start typing'
            },
            types: {
                type: String,
                default: 'address'
            },
            country: {
                type: [String, Array],
                default: null
            },
            enableGeolocation: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                /**
                 * The Autocomplete object.
                 *
                 * @type {Autocomplete}
                 * @link https://developers.google.com/maps/documentation/javascript/reference#Autocomplete
                 */
                autocomplete: null,
                /**
                 * Autocomplete input text
                 * @type {String}
                 */
                autocompleteText: '',
            }
        },
        watch: {
            autocompleteText: function (newVal, oldVal) {
                this.$emit('inputChange', { newVal: newVal, oldVal: oldVal });
            }
        },
        mounted: function () {
            var self = this;
            ensureGoogleMaps({
                libraries: ['places'],
                key: 'AIzaSyCe1exctmeJjIb4guyT6newSpyJ7kA3aLc',
                client: '',
                version: '3',
                loadGoogleApi: true
            }, function (xgoogle) {
                const options = {};
                if (self.types) {
                    options.types = [self.types];
                }
                if (self.country) {
                    options.componentRestrictions = {
                        country: self.country
                    };
                }
                self.autocomplete = new google.maps.places.Autocomplete(
                    document.getElementById(self.id),
                    options
                );
                self.autocomplete.addListener('place_changed', function () {
                    var place = self.autocomplete.getPlace();
                    if (!place.geometry) {
                        // User entered the name of a Place that was not suggested and
                        // pressed the Enter key, or the Place Details request failed.
                        self.$emit('no-results-found', place);
                        return;
                    }
                    var addressComponents = {
                        street_number: 'short_name',
                        route: 'long_name',
                        locality: 'long_name',
                        administrative_area_level_1: 'short_name',
                        country: 'long_name',
                        postal_code: 'short_name'
                    };
                    var returnData = {};
                    if (place.address_components !== undefined) {
                        // Get each component of the address from the place details
                        for (var i = 0; i < place.address_components.length; i++) {
                            var addressType = place.address_components[i].types[0];
                            if (addressComponents[addressType]) {
                                var val = place.address_components[i][addressComponents[addressType]];
                                returnData[addressType] = val;
                            }
                        }
                        returnData['latitude'] = place.geometry.location.lat();
                        returnData['longitude'] = place.geometry.location.lng();
                        // return returnData object and PlaceResult object
                        //this.$emit('placechanged', returnData, place, this.id);
                        // update autocompleteText then emit change event
                        self.autocompleteText = document.getElementById(self.id).value
                        self.onChange();

                        self.$emit('propChange', 'street', returnData.route + (returnData.street_number ? ' ' + returnData.street_number : ''));
                        self.$emit('propChange', 'postalCode', returnData.postal_code);
                        self.$emit('propChange', 'city', returnData.locality);
                        self.$emit('propChange', 'country', returnData.country);

                    }
                });

            });
        },
        methods: {
            /**
             * When the input gets focus
             */
            onFocus: function () {
                this.geolocate();
                this.$emit('focus');
            },
            /**
             * When the input loses focus
             */
            onBlur: function () {
                this.$emit('blur');
            },
            /**
             * When the input got changed
             */
            onChange: function () {
                this.$emit('change', this.autocompleteText);
            },
            /**
             * When a key gets pressed
             * @param  {Event} event A keypress event
             */
            onKeyPress: function (event) {
                this.$emit('keypress', event);
            },
            /**
             * Clear the input
             */
            clear: function () {
                this.autocompleteText = ''
            },
            /**
             * Focus the input
             */
            focus: function () {
                this.$refs.autocomplete.focus()
            },
            /**
             * Blur the input
             */
            blur: function () {
                this.$refs.autocomplete.blur()
            },
            // Bias the autocomplete object to the user's geographical location,
            // as supplied by the browser's 'navigator.geolocation' object.
            geolocate: function () {
                if (this.enableGeolocation) {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            var geolocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            var circle = new google.maps.Circle({
                                center: geolocation,
                                radius: position.coords.accuracy
                            });
                            this.autocomplete.setBounds(circle.getBounds());
                        });
                    }
                }
            },

        },

        computed: {
            model: {
                get: function () {
                    return this.value
                },
                set: function (val) {
                    this.$emit('input', val)
                }
            },
            properties: function () {
                return this.schema.properties;
            },
            fields: function () {
                var fields = {};
                for (var key in this.schema.properties) {
                    if (this.columns) {
                        if (this.columns.indexOf(key) > 0) {
                            fields[key] = this.schema.properties[key];
                        }
                    } else {
                        if (key != 'id' && !this.schema.properties[key].readOnly && !this.schema.properties[key]["x-rel-app"]) {
                            fields[key] = this.schema.properties[key];
                        }
                    }
                }
                return fields;
            },
        },

    }
    Vue.component('address-component', addressComponent);

    function ensureGoogleMaps(options, fn) {
        if (!options.loadGoogleApi) {
            fn(window.google.maps ? window.google.maps : window.google)
        } else if (Vue.google) {
            fn(Vue.google)
        } else {
            loadGoogleMapsAPI({
                key: options.key, client: options.client, libraries: options.libraries, v: options.version
            }, function (google) {
                Vue.google = google
                Vue.prototype.$google = google
                fn(google)
            });
        }
    }

    var CALLBACK_NAME = '__googleMapsApiOnLoadCallback';

    var OPTIONS_KEYS = ['client', 'key', 'language', 'region', 'v'];

    loadGoogleMapsAPI = function (options, callback) {
        options = options || {}


        // Exit if not running inside a browser.
        if (typeof window === 'undefined') {
            alert('Can only load the Google Maps API in the browser');
        }

        if (window[CALLBACK_NAME]) {
            oldCallBack = window[CALLBACK_NAME];
            window[CALLBACK_NAME] = function () {
                oldCallBack();
                if (callback) callback(window.google.maps);
            }
            return;
        }

        var timeoutId = setTimeout(function () {
            window[CALLBACK_NAME] = function () { } // Set the on load callback to a no-op.
            alert('Could not load the Google Maps API')
        }, options.timeout || 10000)

        // Hook up the on load callback.
        window[CALLBACK_NAME] = function () {
            if (timeoutId !== null) {
                clearTimeout(timeoutId)
            }
            if (callback) callback(window.google.maps)
            delete window[CALLBACK_NAME]
        }

        // Prepare the `script` tag to be inserted into the page.
        var scriptElement = document.createElement('script')
        var params = ['callback=' + CALLBACK_NAME]
        OPTIONS_KEYS.forEach(function (key) {
            if (options[key]) {
                params.push(key + '=' + options[key])
            }
        })
        if (options.libraries && options.libraries.length) {
            params.push('libraries=' + options.libraries.join(','))
        }
        scriptElement.src =
            'https://maps.googleapis.com/maps/api/js?' + params.join('&')

        // Insert the `script` tag.
        document.body.appendChild(scriptElement)

    }

})();
(function () {
    var checkboxGroupComponent = {
        name: "checkboxGroupComponent",
        template: '<el-checkbox-group v-model="model"><el-checkbox v-for="item in options" :label="item.value" :key="item.value">{{item.label}}</el-checkbox></el-checkbox-group>',
        props: {
            value: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            schema: {},
            prop: String,
        },
        data: function () {
            return {
                options: []
            }
        },
        computed: {
            model: {
                get: function () {
                    return this.value
                },
                set: function (val) {
                    this.$emit('input', val)
                }
            },
            resource: function () {
                return this.$route.params.resource;
            },
        },
        created: function () {
            var self = this;
            var enumAction = this.schema["x-enum-action"];
            if (enumAction) {
                var enumValueField = this.schema["x-enum-valuefield"];
                var enumTextField = this.schema["x-enum-textfield"] || this.schema["x-enum-valuefield"];
                var service = abp.services.app[self.resource][enumAction];
                service().done(function (data) {
                    self.options = data.items.map(function (p) {
                        return { value: p[enumValueField], label: p[enumTextField] };
                    });
                }).always(function () {
                    //abp.ui.clearBusy(_$app);
                });
            } else if (this.schema.enum) {
                this.options = this.schema.enum.map(function (val) {
                    return { value: val, label: val };
                });
            } else {
                return [];
            }
        }
    }
    Vue.component('checkbox-group-component', checkboxGroupComponent);
})();
(function () {
    var datetimeComponent = {
        name: "datetimeComponent",
        template: '<el-date-picker v-model="model" type="datetime" format="dd/MM/dd HH:mm" ></el-date-picker>',
        props: {
            value: {},
            schema: {},
            prop: String,
            options: {

            },
        },
        computed: {
            model: {
                get: function () {
                    return this.value
                },
                set: function (val) {
                    this.$emit('input', val)
                }
            }
        },
    }
    Vue.component('datetime-component', datetimeComponent);
})();
(function () {

    var daterangeComponent = {
        name: "daterangeComponent",
        template: '<el-date-picker v-model="model"  type="daterange" :picker-options="pickerOptions" ></el-date-picker>',
        data: function () {
            return {
                pickerOptions: {
                    shortcuts: [{
                        text: 'Last week',
                        onClick: function (picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'Last month',
                        onClick: function (picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'Last 3 months',
                        onClick: function (picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
            };
        },
        props: {
            value: Array,
            schema: {},
            prop: String,
            options: {

            },
        },
        computed: {
            model: {
                get: function () {
                    return this.value
                },
                set: function (val) {
                    this.$emit('input', val)
                }
            }
        },
    }
    Vue.component('daterange-component', daterangeComponent);
})();
(function () {
    var inputComponent = {
        name: "inputComponent",
        template: '<el-input v-model="model"></el-input>',
        props: {
            value: String,
            schema: {},
            prop: String,
            options: {

            },
        },
        computed: {
            model: {
                get: function () {
                    return this.value
                },
                set: function (val) {
                    this.$emit('input', val)
                }
            }
        },
    }
    Vue.component('input-component', inputComponent);
})();
(function () {
    var inputNumberComponent = {
        name: "inputNumberComponent",
        template: '<el-input-number v-model="model" ></el-input-number>',
        props: {
            value: Number,
            schema: {},
            prop: String,
            options: {

            },
        },
        computed: {
            model: {
                get: function () {
                    return this.value
                },
                set: function (val) {
                    this.$emit('input', val)
                }
            }
        }
    }
    Vue.component('input-number-component', inputNumberComponent);
})();

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
(function () {
    var selectComponent = {
        name: "selectComponent",
        template: '<el-select v-model="model" placeholder="Select"> \
                    <el-option v-if="!hideNone" :label="noneLabel" :value="noneValue" ></el-option> \
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option> \
                </el-select>',
        props: {
            value: {},
            schema: {},
            messages: Object,
            prop: String,
            service: {},
            
            
        },
        data: function () {
            return {
                options: [],
                hideNone: false,
                noneLabel: "None",
                noneValue: undefined
            }
        },
        computed: {
            model: {
                get: function () {
                    return this.value
                },
                set: function (val) {
                    this.$emit('input', val)
                }
            },

        },
        created: function () {
            var self = this;
            var sch = this.schema.oneOf && this.schema.oneOf[0] ? this.schema.oneOf[0] : this.schema;
            if (sch.enum) {
                for (var i = 0; i < sch.enum.length; i++) {
                    var label = sch['x-enumNames'] ? sch['x-enumNames'][i] : this.prop + '_' + sch.enum[i];
                    if (this.messages && this.messages[label]) {
                        label = this.messages[label];
                    }
                    this.options.push({ value: sch.enum[i], label: label });
                }
            }
            else if (sch["x-enum-action"]) {
                var enumAction = this.schema["x-enum-action"];
                var enumValueField = this.schema["x-enum-valuefield"] || 'id';
                var enumTextField = this.schema["x-enum-textfield"] || 'fullName';
                self.service[enumAction]().done(function (data) {
                    self.options = data.map(function (p) {
                        return { value: p[enumValueField], label: p[enumTextField] };
                    });
                }).always(function () {
                });
            }
            if (sch["x-enum-nonelabel"]) {
                this.noneLabel = sch["x-enum-nonelabel"];
                if (this.messages && this.messages[this.noneLabel]) {
                    this.noneLabel = this.messages[this.noneLabel];
                }
            }
        }
    }
    Vue.component('select-component', selectComponent);
})();
(function () {
    var switchComponent = {
        name: "switchComponent",
        template: '<el-switch v-model="model" on-text="" off-text=""></el-switch>',
        props: {
            value: Boolean,
            schema: {},
            prop: String,
            options: {

            },
        },
        computed: {
            model: {
                get: function () {
                    return this.value
                },
                set: function (val) {
                    this.$emit('input', val)
                }
            }
        },
    }
    Vue.component('switch-component', switchComponent);
})();
(function () {
    var textareaComponent = {
        name: "textareaComponent",
        template: '<el-input type="textarea" autosize v-model="model"></el-input>',
        props: {
            value: String,
            schema: {},
            prop: String,
            options: {

            },
        },
        computed: {
            model: {
                get: function () {
                    return this.value
                },
                set: function (val) {
                    this.$emit('input', val)
                }
            }
        },
    }
    Vue.component('textarea-component', textareaComponent);
})();
(function () {
    var comp = {
        name: "comp",
        template: '<el-form-item v-if="addFormItem" :label="label" :prop="prop"> \
                    <component v-bind:is="currentView" v-model="model" v-bind="$props" @propChange="propChange" ></component> \
                </el-form-item> \
                <component v-else v-bind:is="currentView" :label="label" :prop="prop" v-model="model" v-bind="$props" @propChange="propChange" ></component>',
        props: {
            value: {},
            schema: {},
            prop: String,
            messages: Object,
            service: {},
        },
        components: {
            inputComponent: Vue.component('input-component'),
            textareaComponent: Vue.component('textarea-component'),
            selectComponent: Vue.component('select-component'),
            switchComponent: Vue.component('switch-component'),
            checkboxGroupComponent: Vue.component('checkbox-group-component'),
            datetimeComponent: Vue.component('datetime-component'),
            daterangeComponent: Vue.component('daterange-component'),
            inputNumberComponent: Vue.component('input-number-component'),
            addressComponent: Vue.component('address-component'),
            relationComponent: Vue.component('relation-component')
        },
        computed: {
            currentView: function () {
                var sch = this.schema.oneOf && this.schema.oneOf[0] ? this.schema.oneOf[0] : this.schema;
                var type = Array.isArray(sch.type) ? (sch.type[0] == "null" ? sch.type[1]:sch.type[0] ) : sch.type;
                if (sch["x-type"]) {
                    type = sch["x-type"];
                }
                if (sch["x-rel-action"]) {
                    return 'relationComponent';
                } else if (sch.enum || sch["x-enum-action"]) {
                    if (type == 'array') {
                        return 'checkboxGroupComponent';
                    } else {
                        return 'selectComponent';
                    }
                } else if (type == 'boolean') {
                    return 'switchComponent';
                } else if (type == 'integer' || type == 'number') {
                    return 'inputNumberComponent';
                } else if (type == 'array' && this.schema.items.format == 'date-time') {
                    return 'daterangeComponent';
                } else if (sch.format == 'date-time') {
                    return 'datetimeComponent';
                } else if (sch['x-ui-multiline']) {
                    return 'textareaComponent';
                } else if (type == 'address') {
                    return 'addressComponent';
                } else {
                    return 'inputComponent';
                }
            },
            addFormItem: function () {
                return true;//this.currentView != 'relationComponent';
            },
            model: {
                get: function () {
                    return this.value
                },
                set: function (val) {
                    this.$emit('input', val)
                }
            },
            label: function () {
                var name = this.schema.title ? this.schema.title : this.prop.capitalize();
                if (this.messages && this.messages[name])
                    return this.messages[name];
                else
                    return this.schema.title ? this.schema.title : name;
            },
        },
        methods: {
            propChange: function (key, value) {
                this.$emit('propChange', key, value);
            }
        }
    }

    Vue.component('comp', comp);
})();
(function () {
    var formitem = {
        name: "formitem",
        template: '<el-form-item :label="label" :prop="prop"> \
                    <slot></slot> \
                </el-form-item> \
                <slot name="footer" ></slot>',
        props: {
            label: {},
            prop: String,
            messages: Object,
        },
        components: {
        },
        computed: {
        },
        methods: {
        }
    }
    Vue.component('formItem', formitem);
})();
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
(function () {
    var form = {
        name: "formcomp",
        template: '<el-form ref="form" :model="model" :rules="rules" label-position="right" label-width="120px" :label-position="labelPosition" > \
                <el-tabs v-if="Object.keys(tabs).length > 1" :value="Object.keys(tabs)[0]">\
                    <el-tab-pane v-for="(gvalue, gkey) in tabs" :key="gkey" :label="label(gkey)" :name="gkey"> \
                        <comp v-for="(value, key) in gvalue" :key="key" :prop="key" :schema="properties[key]" v-model="model[key]" :messages="messages" @propChange="propChange" :service="service" ></comp> \
                    </el-tab-pane> \
                </el-tabs> \
                <comp v-else v-for="(value, key) in fields" :key="key" :prop="key" :schema="properties[key]" v-model="model[key]" :messages="messages" @propChange="propChange" :service="service" ></comp> \
                <el-form-item> \
                    <el-button v-for="action in actions" :key="action.name" size="small" :type="action.type" @click="action.execute()">{{action.name}}</el-button> \
                </el-form-item> \
                </el-form>',
        props: {
            model: {},
            schema: {},
            options: {},
            messages: {},
            actions: {},
            columns: {

            },
            service: {}
        },
        data: function () {
            return {};
        },
        computed: {
            properties: function () {
                return this.schema.properties;
            },
            fields: function () {
                if (this.options) {
                    return this.options.fields;
                }
                else {
                    var fields = {};
                    for (var key in this.schema.properties) {
                        if (this.columns) {
                            if (this.columns.indexOf(key) > 0) {
                                fields[key] = this.schema.properties[key];
                            }
                        } else {
                            if (key != 'id' && !this.schema.properties[key].readOnly && !this.schema.properties[key]["x-rel-app"]) {
                                fields[key] = this.schema.properties[key];
                            }
                        }
                    }
                    return fields;
                }
            },
            rules: function () {
                var rules = {};
                for (var key in this.schema.properties) {
                    var prop = this.schema.properties[key];
                    var itemRules = [];
                    if (prop.required && prop.type != 'object') {
                        itemRules.push({ required: true, message: 'Please input a value' });
                        rules[key] = itemRules;
                    }

                }
                if (this.schema.required) {
                    for (var i = 0; i < this.schema.required.length; i++) {
                        var prop = this.schema.required[i];
                        var itemRules = rules[prop];
                        if (!itemRules) {
                            itemRules = [];
                            rules[prop] = itemRules;
                        }
                        if (!itemRules) {
                            itemRules = [];
                            rules[key] = itemRules;
                        }
                        itemRules.push({ required: true, message: 'Please input a value' });
                    }
                }
                return rules;
            },
            tabs: function () {

                var groups = {};
                for (var key in this.fields) {
                    var el = this.fields[key];
                    var group = el['x-ui-group'];
                    if (group in groups == false) {
                        groups[group] = {};
                    }
                    groups[group][key] = el;
                };
                return groups;
                return Object.keys(groups).map(function (key) {
                    return {
                        key: key,
                        values: groups[key]
                    };
                });

                /*
                for (var key in this.properties) {
                    var group = this.properties[key]['x-ui-group'];
                    if (group) {
                        if (tabs.indexOf(group))
                    }
                }*/
            },
            isMobile: function () {
                return window.matchMedia("only screen and (max-width: 760px)").matches
            },
            labelPosition: function () {
                return this.isMobile ? 'top' : 'right';
            }
        },
        methods: {
            validate: function (callback) {
                this.$refs.form.validate(function (valid) {
                    if (callback) callback(valid);
                });
            },
            submitForm: function (formName) {
                this.$refs.form.validate(function (valid) {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm: function () {
                this.$refs.form.resetFields();
            },
            label: function (name) {
                //var name = this.schema.properties[prop].title ? this.schema.properties[prop].title : prop.capitalize();
                if (this.messages && this.messages[name])
                    return this.messages[name];
                else
                    return name;
            },
            propChange: function (key, value) {
                this.$set(this.model, key, value);
            }
        }
    }
    Vue.component('formcomp', form);
})();
(function () {
    var filterform = {
        name: "filterform",
        template: '<el-form ref="form" :model="model" :rules="rules" label-position="right" :label-width="labelwidth" :inline="!isMobile" :label-position="labelPosition"> \
                <comp v-for="(value, key) in fields" :key="key" :prop="key" :schema="properties[key]" v-model="model[key]" :messages="messages" :service="service" ></comp> \
                <el-form-item> \
                    <el-button v-for="action in actions" :key="action.name" size="small" :icon="action.icon" :type="action.type" @click="action.execute()">{{action.name}}</el-button> \
                </el-form-item> \
                </el-form>',
        props: {
            model: {},
            schema: {},
            service: {},
            options: {},
            messages: {},
            actions: {},
            columns: {

            }
        },
        data: function () {
            return {};
        },
        computed: {
            properties: function () {
                return this.schema.properties;
            },
            fields: function () {
                if (this.options) {
                    return this.options.fields;
                }
                else {
                    var fields = {};
                    for (var key in this.schema.properties) {
                        if (key != 'id' && !this.schema.properties[key].readOnly && !this.schema.properties[key]["x-rel-app"]) {
                            fields[key] = this.schema.properties[key];
                        }
                    }
                    return fields;
                }
            },
            rules: function () {
                var rules = {};
                for (var key in this.schema.properties) {
                    var prop = this.schema.properties[key];
                    var itemRules = [];
                    rules[key] = itemRules;
                }
                return rules;
            },
            isMobile: function () {
                return window.matchMedia("only screen and (max-width: 760px)").matches
            },
            labelPosition: function () {
                return this.isMobile ? 'top' : 'right';
            },
            labelwidth: function () {
                return this.isMobile ? '100px' : '';
            }
        },
        methods: {
            validate: function (callback) {
                this.$refs.form.validate(function (valid) {
                    if (callback) callback(valid);
                });
            },
            submitForm: function (formName) {
                this.$refs.form.validate(function (valid) {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm: function () {
                this.$refs.form.resetFields();
            },
            label: function (name) {
                //var name = this.schema.properties[prop].title ? this.schema.properties[prop].title : prop.capitalize();
                if (this.messages && this.messages[name])
                    return this.messages[name];
                else
                    return name;
            }
        },
        /*
        created: function(){

            for (key in this.fields) {
                if (this.fields[key].type == "string"){
                    Vue.set(this.model, key, "");
                } else if (this.fields[key].type == "int") {
                    Vue.set(this.model, key, 0);
                }
            }
        
        }
        */
    }
    Vue.component('filterform', filterform);
})();
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
(function () {
    var grid = {
        name: "gridcomp",
        template: '<el-table :data="model" @row-click="rowClick" style="width: 100%" :row-style="{cursor: \'pointer\'}"  > \
                <el-table-column v-for="(value, key) in columns" :key="key" :prop="key" :label="label(key)" :formatter="formatter" class-name="crudcell" ></el-table-column> \
                <el-table-column align="right" min-width="120px"> \
                    <template slot-scope="scope"><el-button v-for="action in actions" :key="action.name" :icon="action.icon" size="small" @click="action.execute(scope.row, scope.$index)"></el-button></template> \
                </el-table-column> \
                </el-table>',
        props: {
            model: {},
            schema: {},
            messages: {},
            actions: {},
            defaultAction: {}
        },
        computed: {
            columns: function () {
                var fields = {};
                for (var key in this.schema.properties) {
                    if (key != 'id' && this.schema.properties[key].type != "array" &&
                        (!this.schema.properties[key].hasOwnProperty("x-ui-grid") || this.schema.properties[key]["x-ui-grid"])
                    ) {
                        fields[key] = this.schema.properties[key];
                    }
                }
                return fields;
            }
        },
        methods: {
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
                    return cellValue ? this.messages["Yes"] : this.messages["No"];
                } else if (schema.format == 'date-time') {
                    if (!cellValue) return "";
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
            rowClick: function (row, event, column) {
                if (column.label) {
                    this.defaultAction.execute(row, event, column);
                }
            }
        }
    }
    Vue.component('gridcomp', grid);
})();
(function () {
    var CrudGrid = {
        name: "CrudGrid",
        template: '<div> \
                <filterform v-if="hasFilter" ref="filterform" :model="filterModel" :schema="filterSchema" :service="service" :actions="filterActions" :messages="messages"></filterform> \
                <gridcomp :model="model" :schema="schema" :messages="messages" :options="options" :actions="gridActions" :default-action="gridActions[0]"></gridcomp><br /> \
                <el-button v-for="action in actions" :key="action.name" :icon="action.icon" size="small" :type="action.type" @click="action.execute()">{{action.name}}</el-button> \
                <div style="float:right"><el-pagination @current-change="currentPageChange" :current-page.sync="currentPage" :page-size="pageSize"  layout="total, prev, pager, next" :total="totalCount"></el-pagination></div> \
                </div>',
        props: {

        },
        data: function () {
            return {
                model: [],
                filterModel: {},
                totalCount: 0,
                currentPage: 1,
                pageSize: 10,
            };
        },
        computed: {
            module: function () {
                return this.$route.params.module;
            },
            resource: function () {
                return this.$route.params.resource;
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
            gridActions: function () {
                var self = this;
                return [
                    {
                        name: self.translate('Edit'),
                        icon: 'el-icon-edit',
                        execute: function (row) {
                            self.$router.push({ name: 'edit', params: { resource: self.resource, id: row.id } })
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
                                })
                            }).catch(function () {

                            });

                        }
                    }
                ]
            },
            defaultAction: function () {
                return this.gridActions[0];
            },
            actions: function () {
                var self = this;
                return [
                    {
                        //name: self.translate('Add'),
                        icon: 'el-icon-plus',
                        type: 'primary',
                        execute: function () {
                            self.$router.push({ name: 'add', params: { resource: self.resource } })
                        }
                    }
                ]
            },
            filterSchema: function () {
                var schema = { properties: {} };
                var action = abp.schemas.app[this.resource].getAll.parameters;
                for (var key in action) {
                    if (key != 'skipCount' && key != 'maxResultCount') {
                        schema.properties[key] = action[key];
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
                        //name: self.translate('Search'),
                        icon: 'el-icon-search',
                        type: 'primary',
                        execute: function () {
                            self.fetchData();
                        }
                    },
                    {
                        //name: self.translate('Reset'),
                        icon: 'el-icon-close',
                        execute: function () {
                            self.$refs.filterform.resetForm();
                            self.fetchData();
                        }
                    }
                ]
            },
            options: function () {
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
                self.service.getAll(self.filterModel).done(function (data) {
                    self.model = data.items;
                    self.totalCount = data.totalCount;
                    if (callback) callback();
                    //this.pagination.totalItems = data.total;
                }).always(function () {
                    //abp.ui.clearBusy(_$app);
                });
            },
            deleteData: function (data, callback) {
                var self = this;
                self.service.delete({ id: data.id }).done(function (data) {
                    self.fetchData(callback);
                }).always(function () {
                    //abp.ui.clearBusy(_$app);
                });
            },
            translate: function (text) {
                if (this.messages && this.messages[text])
                    return this.messages[text];
                else
                    return text;
            }
        },
        created: function () {
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
    Vue.component('crud-grid', CrudGrid);
})();
(function () {
    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    Array.prototype.groupBy = function (keyFunction) {
        var groups = {};
        this.forEach(function (el) {
            var key = keyFunction(el);
            if (key in groups == false) {
                groups[key] = [];
            }
            groups[key].push(el);
        });
        return Object.keys(groups).map(function (key) {
            return {
                key: key,
                values: groups[key]
            };
        });
    };

    jref = require('json-ref-lite');
})();