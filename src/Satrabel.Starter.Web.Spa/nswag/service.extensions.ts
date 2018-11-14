export class ClientBase {
    authToken?: string;

    protected transformOptions(options: any) {
        const xsrfToken = this.getCookie('XSRF-TOKEN');

        if(this.authToken)
            options.headers["Authorization"] = `Bearer ${this.authToken}`;

        if(xsrfToken)
            options.headers["X-XSRF-TOKEN"] = xsrfToken;

        return Promise.resolve(options);
    }

    public withToken(authToken?: string) {
        this.authToken = authToken;
        return this;
    }

    private getCookie(name) {
        if (!document.cookie) return null;

        const cookiesWithName = document.cookie.split(';')
            .map(c => c.trim())
            .filter(c => c.startsWith(name + '='));
    
        if (cookiesWithName.length === 0) return null;
    
        return decodeURIComponent(cookiesWithName[0].split('=')[1]);
    }
}