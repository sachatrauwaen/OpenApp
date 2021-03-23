$(function () {
    $('#ReturnUrlHash').val(location.hash);

    var $loginForm = $('#VerifyTwoFactorForm');


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
            $('#VerifyTwoFactorArea'),
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

        //location.reload();
        ajaxSubmit();

    });


    $loginForm.find('input[type=text]:first-child').focus();
});
