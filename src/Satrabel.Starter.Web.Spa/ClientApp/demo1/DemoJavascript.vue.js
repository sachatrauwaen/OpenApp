export default {
    name: 'demoJavascript',
    data() {
        return {
            msg: 'demoJavascript : javascript component' + abp.services.app.demo1Service()
        }
    }
}