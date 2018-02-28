﻿(function () {
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

    
})();