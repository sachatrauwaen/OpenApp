(function () {
    $('.dropdown-languages a')
        .click(function (e) {
            e.preventDefault();

            var anchorValue='';
            var url = document.location;
            var strippedUrl = url.toString().split("#");
            if (strippedUrl.length > 1)
                anchorValue = strippedUrl[1];

            var href = $(this).attr('href');
            if (anchorValue) href = href + "#" + anchorValue;
            window.location = href;
        });
})();