
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({   
    props: {
        propMessage: String
    },
    components: {
        
    }
})
export default class App extends Vue {
    // props have to be declared for typescript
    propMessage: string;

    // inital data
    greeting: string = "";
    msg: number = 123;
    
    get helloMsg() {
        return 'Hello, ' + this.propMessage + ': ' + this.greeting;
    }

    // lifecycle hook
    mounted() {
        this.greet();
    }

    // computed
    get computedMsg() {
        return 'computed ' + this.msg;
    }

    // method
    async greet() {
        this.greeting = await abp.services.app.demo1Service.getMyGreeting();
    }

}
