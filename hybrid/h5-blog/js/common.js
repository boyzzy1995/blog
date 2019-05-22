(function() {
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 640 * 100 + 'px';
    document.addEventListener('UniAppJSBridgeReady', function() {
        console.log('UniAppJSBridgeReady', uni);
    });
})();

//截取url中需要的参数
function getUrlParam(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    let r = encodeURI(window.location.search).substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return '';
}

//加载的弹框
function loadingTost(type, text) {
    let $t = $('#loadingToast');
    if (type == 'show') {
        if ($t.length > 0) {
            $('#loadingText').text(text);
            $t.show();
        } else {
            $('body').append(
                '<div id="loadingToast"  >' +
                '<div class="weui-mask_transparent"></div>' +
                '<div class="weui-toast">' +
                '<i class="weui-loading weui-icon_toast" style="margin: 22px 0 0"></i>' +
                '<p class="weui-toast__content" id="loadingText">' + text + '</p>' +
                '</div>' +
                '</div>');
            $t.fadeIn(200);
        }
    } else {
        $t.fadeOut(200);
    }
}

//完成的提示框
function Toast(text, time) {
    let $t = $('#toast');
    if (!time) {
        time = 2000;
    }
    if ($t.length > 0) {
        $('#toastText').text(text);
        $t.show();
    } else {
        $('body').append(
            '<div id="toast" style="opacity: 1; display: none;">' +
                '<div class="weui-mask_transparent"></div>' +
                '<div class="weui-toast">' +
                    '<i class="weui-icon-success-no-circle weui-icon_toast"></i>' +
                    '<p class="weui-toast__content" id="toastText">' + text + '</p>' +
                '</div>' +
            '</div>');
        $t = $('#toast').fadeIn(200);
    }
    setTimeout(() => {
        $t.fadeOut(200);
    }, time)
}

//弹出警告框
function showWarnToast(text, time) {
    let $t = $('#warn_toast');
    if (!time) {
        time = 2000;
    }
    if ($t.length > 0) {
        $('#warn_toast_Text').text(text);
        $t.show();
    } else {
        $('body').append(
            '<div id="warn_toast">' +
            '<div class="weui-mask_transparent"></div>' +
            '<div class="weui-toast warn-toast">' +
            '<i class="weui-icon-warn weui-icon_msg-primary my-icon"></i>' +
            '<p class="weui-toast__content" id="warn_toast_Text">' + text + '</p>' +
            '</div>' +
            '</div>');
        $t = $('#warn_toast').fadeIn(200);
    }
    setTimeout(() => {
        $t.fadeOut(200);
    }, time)
}
//让TextArea自动调节高度
function makeExpandingArea(el) {
    let timer = null;
    //由于ie8有溢出堆栈问题，故调整了这里
    let setStyle = function(el, auto) {
        if (auto) el.style.height = '.8rem';
        el.style.height = el.scrollHeight + 'px';
    }
    let delayedResize = function(el) {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(function() {
            setStyle(el)
        }, 200);
    }
    if (el.addEventListener) {
        el.addEventListener('input', function() {
            setStyle(el, 1);
        }, false);
        setStyle(el)
    } else if (el.attachEvent) {
        el.attachEvent('onpropertychange', function() {
            setStyle(el)
        })
        setStyle(el)
    }
    if (window.VBArray && window.addEventListener) { //IE9
        el.attachEvent('onkeydown', function() {
            let key = window.event.keyCode;
            if (key == 8 || key == 46) delayedResize(el);
        });
        el.attachEvent('oncut', function() {
            delayedResize(el);
        }); //处理粘贴
    }
}
