VueForms = {};

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

    // load 'json-ref-lite'
    jref = require('json-ref-lite');
    // override .resolve function to prevent stack-overflow issue
    var _originalResolvefn = jref.resolve;
    jref.resolve = function (json) {
        var clone = JSON.parse(JSON.stringify(json)); // create clone because jref.resolve changes the input value; which results (sometimes) in an stack-overflow error if presented a second time 
        return _originalResolvefn(clone);
    };

    Vue.$loadComponent = function (opts) {
        var script = document.createElement('script');

        opts.onLoad = opts.onLoad || function () { };
        opts.onError = opts.onError || function () { };

        script.src = opts.path;
        script.async = true;

        script.onload = function () {
            var component = Vue.component(opts.name);

            if (component) {
                opts.onLoad(component);
            } else {
                opts.onError();
            }
        };
        script.onerror = opts.onError;

        document.body.appendChild(script);
    }

    VueForms.jsonSchema = {};
    VueForms.jsonSchema.getNotNull = function (schema) {
        if (schema.oneOf) {
            var lst = schema.oneOf.filter(function (s) { s.type != "null" });
            if (lst.length > 0) {
                return lst[0];
            } else {
                return schema;
            }
        } else {
            return schema;
        }
    };
    VueForms.isMobile = function () {
        return window.matchMedia("only screen and (max-width: 760px)").matches;
    };
    
})();