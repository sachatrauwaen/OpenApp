export default {
    name: 'demoJavascript',
    data: function () {
        return {
            msg: 'demoJavascript : javascript component: ' + abp.services.app.demo1Service.getMyGreeting()
        }
    }
}