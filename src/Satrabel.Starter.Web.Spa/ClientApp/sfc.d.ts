declare module "*.vue" {
    import Vue from 'vue'
    export default Vue
}

declare namespace abp {
    namespace security {
        namespace antiForgery { 
            function getToken(): string
        }
    }

    namespace services {

        namespace app {

            //namespace demo1Service {

            //    function getMyGreeting(): string;

            //}
        }
    }

    namespace localization {
        function localize(arg1: any, arg2: any): string;
        const values: any;
    }
}