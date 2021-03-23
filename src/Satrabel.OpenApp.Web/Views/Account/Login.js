$(function () {
    $('#ReturnUrlHash').val(location.hash);

    var $loginForm = $('#LoginForm');
    if (abp.session.tenantId) {
        abp.services.app.session.getCurrentLoginInformations().done(function (result) {
            $loginForm.find('input[name=TenancyName]').val(result.tenant.tenancyName);
        });
    }

    $loginForm.validate({
        highlight: function (input) {
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.input-group').append(error);
        }
    });

    var ajaxSubmit = function () {
        abp.ui.setBusy(
            $('#LoginArea'),
            abp.ajax({
                contentType: 'application/x-www-form-urlencoded',
                url: $loginForm.attr('action'),
                data: $loginForm.serialize()
            })
        );
    };

    $loginForm.submit(function (e) {
        e.preventDefault();

        if (!$loginForm.valid()) {
            return;
        }

        var tenancyName = $loginForm.find('input[name=TenancyName]').val();

        if (!tenancyName) {
            abp.multiTenancy.setTenantIdCookie(null);
            //location.reload();
            ajaxSubmit();
            return;
        }

        var _accountService = abp.services.app.account;
        _accountService.isTenantAvailable({
            tenancyName: tenancyName
        }).done(function (result) {
            switch (result.state) {
                case 1: //Available
                    abp.multiTenancy.setTenantIdCookie(result.tenantId);                    
                    //location.reload();
                    ajaxSubmit();
                    return;
                case 2: //InActive
                    abp.message.warn(abp.utils.formatString(abp.localization
                        .localize("TenantIsNotActive", "OpenApp"),
                        tenancyName));
                    break;
                case 3: //NotFound
                    abp.message.warn(abp.utils.formatString(abp.localization
                        .localize("ThereIsNoTenantDefinedWithName{0}", "OpenApp"),
                        tenancyName));
                    break;
            }
        });
    });

    $('a.social-login-link').click(function () {
        var $a = $(this);
        var $form = $a.closest('form');
        $form.find('input[name=provider]').val($a.attr('data-provider'));
        $form.submit();
    });

    $('#resend-email-button').click(function () {
        var $a = $(this);
        var $form = $a.closest('form');
        $form.find('input[name=provider]').val($a.attr('data-provider'));
        $form.submit();
    });

    $loginForm.find('input[type=text]:first-child').focus();
});
