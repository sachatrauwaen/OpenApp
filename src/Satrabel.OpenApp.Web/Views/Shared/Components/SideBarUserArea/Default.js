(function () {
    $('.inpersonate-component a')
        .click(function (e) {
            e.preventDefault();
            abp.services.app.impersonate.backToImpersonator().done(function (data) {
                window.location = data;
            }).always(function () {
                self.loading = false;
            });
        });
})();