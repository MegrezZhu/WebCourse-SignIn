'use strict';

$(function () {
    let logger = new ErrorLogger;

    $('input[type="text"], input[type="password"]').focus(logger.reset.bind(logger));

    let $submit = $('input[type="submit"]');
    $submit.click(function (event) {
        event.preventDefault();
        let $this = $(this);
        if (checkBlank()) {
            $this.attr("disabled", "true")
                 .toggleClass('loading');
            let originPassword = encrypt();
            $.post('/api/login', getFormData($('form').eq(0)))
             .then(function (data) {
                 logger.reset();
                 if (data === 'ok')
                     location.reload();
                 else {
                     logger.setError('用户名或密码错误');
                     $('input[type="password"]').val(originPassword);
                 }
             });
        } else
            logger.setError('用户名与密码不能为空');
        $('.ui.dimmable').toggleClass('dimmed');
    });
});

function encrypt() {
    let $input = $('input[type="password"]')
    let password = $input.val(),
        _password = password;
    password = Crypto.MD5(password).toString();
    password = Crypto.MD5(password).toString();
    $input.val(password);
    console.log("password encrypted.");
    return _password;
}

function getFormData(form) {
    let $form = $(form);
    let data = {isAjax: true};
    $form.find('input[type="text"], input[type="password"]')
         .each(function () {
             let $this = $(this);
             data[$this.attr('name')] = $this.val();
         });
    //console.log(data);
    return data;
}

function checkBlank() {
    return !!$('input[type="text"]').val() && !!$('input[type="password"]').val();
}

class ErrorLogger {
    constructor() {
        this.elem = $('input[type="submit"]');
    }

    setError(msg) {
        this.elem
            .val(msg)
            .removeClass('blue')
            .addClass('red')
            .attr('disabled', 'true');
        this.timeflag = setTimeout(this.reset.bind(this), 1000);
    }

    reset() {
        if (this.timeflag) clearTimeout(this.timeflag);
        this.elem
            .val('登录')
            .removeClass('red')
            .addClass('blue')
            .removeAttr('disabled');
    }
}