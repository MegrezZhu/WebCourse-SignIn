'use strict';

let checkMethod = {
    id: function (id) {
        if (!id) return Promise.resolve();
        if (!isNaN(id)) {
            if (id.length !== 8) return Promise.reject("学号应为8位数字");
            else {
                if (id[0] === '0') return Promise.reject("学号不能以0开头");
                else
                    return ajaxCheck("id", id).catch(() => Promise.reject("学号已注册"));
            }
        } else
            return Promise.reject("学号应为8位数字");
    },
    phone: function (phone) {
        if (!phone) return Promise.resolve();
        if (!isNaN(phone)) {
            if (phone.length !== 11) return Promise.reject("电话应为11位数字");
            else {
                if (phone[0] === '0') return Promise.reject("电话不能以0开头");
                else return ajaxCheck("phone", phone).catch(() => Promise.reject("电话已注册"));
            }
        } else
            return Promise.reject("电话应为11位数字");
    },
    mail: function (mail) {
        if (!mail) return Promise.resolve();
        if (mail.match(/^[a-zA-Z0-9_\\-]+@(([a-zA-Z0-9_\-])+\.)+[a-zA-Z]{2,4}$/)) {
            return ajaxCheck("mail", mail).catch(() => Promise.reject("邮箱已注册"));
        } else
            return Promise.reject("邮箱格式不正确");
    },
    name: function (name) {
        if (!name) return Promise.resolve();
        if (name.match(/^[a-zA-Z][a-zA-Z0-9_]{5,17}$/)) {
            return ajaxCheck("name", name).catch(() => Promise.reject("用户名已注册"));
        } else
            return Promise.reject("用户名不合法");
    },
    password: function (password) {
        if (!password) return Promise.resolve();
        if (password.match(/^[0-9A-Za-z-_]{6,12}$/)) {
            return Promise.resolve();
        } else {
            let errmsg;
            if (password.length < 6 || password.length > 12) errmsg = "密码应为6-12位";
            if (!_.every(password, char => char.match(/[0-9A-Za-z-_]/))) errmsg = "非法字符";
            return Promise.reject(errmsg);
        }
    },
    password2: function (password2) {
        if (!password2) return Promise.resolve();
        let password = $("input[name='password']").val();
        if (password === password2) return Promise.resolve();
        return Promise.reject("两次输入不同");
    }
};

function ajaxCheck(argName, arg) {
    let data = {};
    data[argName] = arg;
    let ajax = $.post(`api/check/${argName}`, data);
    $(`input[name="${argName}"]`)[0].runningAjax = ajax;
    return ajax.then(res => res === 'ok' ? Promise.resolve() : Promise.reject());
}
