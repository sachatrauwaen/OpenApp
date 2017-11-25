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