﻿(function () {
    var formitem = {
        name: "oaFormItem",
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
    Vue.component('oa-form-item', formitem);
})();