'use strict';

$(function () {
    let ctrl = new UIController;

    $('input[type="text"], input[type="password"]').focus(ctrl.reset.bind(ctrl));

    $('#login-button')
        .click(function (event) {
            event.preventDefault();
            let $this = $(this);
            if (checkBlank()) {
                ctrl.toggle();
                let originPassword = encrypt();
                $.post('/api/login', getFormData($('form').eq(0)))
                 .then(function (data) {
                     ctrl.toggle();
                     if (data === 'ok')
                         location.reload();
                     else {
                         ctrl.setError('用户名或密码错误');
                         $('input[type="password"]').val(originPassword);
                     }
                 });
            } else
                ctrl.setError('用户名与密码不能为空');
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

class UIController {
    constructor() {
        this.button = $('#login-button');
    }

    setError(msg) {
        this.button
            .text(msg)
            .removeClass('blue')
            .addClass('red')
            .attr('disabled', 'true');
        this.timeflag = setTimeout(this.reset.bind(this), 1000);
        return this;
    }

    reset() {
        if (this.timeflag) clearTimeout(this.timeflag);
        this.button
            .text('登录')
            .removeClass('red')
            .addClass('blue')
            .removeAttr('disabled');
        return this;
    }

    toggle() {
        this.button.toggleClass('loading');
        return this;
    }
}