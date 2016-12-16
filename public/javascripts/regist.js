'use strict';

function errHandler(msg) {
    this.next()
        .text(msg);
    this.parents('.ui.field')
        .addClass('error')
}

function reset() {
    let $this = $(this);
    if (this.runningAjax) this.runningAjax.abort();
    $this.parents('.ui.field')
         .removeClass('error')
         .removeClass('success');
}

$(function () {
    let input = $('input[type="text"], input[type="password"]');
    input.focus(reset);
    input.blur(function () {
        let $this = $(this);
        if (!$this.val()) return;
        checkMethod[$this.attr('name')]($this.val())
            .then(() => {
                $this.parents('.ui.field').addClass('success');
                if ($('.ui.field.success').length === 6) $('#regist-button').removeClass('disabled');
            })
            .catch(function (msg) {
                errHandler.call($this, msg);
            });
    });
    $('#reset-button').click((function () {
        let $inputs = $('input[type="text"], input[type="password"]');
        return function () {
            $inputs.each(function () {
                reset.call(this);
                if (this.runningAjax)
                    this.runningAjax.abort();
            });
            $('#submit-button').addClass('disabled');
        };
    })());
    $('input[type="submit"]').click(encrypt);
});

function encrypt() {
    $('input[type="password"]').each(function () {
        let $input = $(this);
        let password = $input.val();
        password = Crypto.MD5(password).toString();
        password = Crypto.MD5(password).toString();
        $input.val(password);
    });
}