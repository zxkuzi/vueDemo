(function () {
    var comm = {};

    comm.alert = function (msg, callback) {
        comm.hide();
        var maskDom = '<div class="popup" id="vipPopup">\n' +
            '    <div class="card">\n' +
            '        <div class="close" id="closeVip">\n' +
            '            <svg class="icon" aria-hidden="true" id="mission">\n' +
            '                <use xlink:href="#icon-tongyongban_guanbianniu_moren"></use>\n' +
            '            </svg>\n' +
            '        </div>\n' +
            '        <h1>恭喜安装 嘀嗒伴我读书</h1>\n' +
            '        <div class="card-b">\n' +
            '            <p>首次安装嘀嗒已帮你自动开通了<span>' + msg.productName + '</span>，请在到期前进行购买续费。</p>\n' +
            '            <div class="card-vip">\n' +
            '                <div class="card-l"> ' + msg.productName + ' </div>\n' +
            '                <div class="card-r">\n' +
            '                    <span class="vip-time">' + msg.vipTime + '</span>天\n' +
            '                </div>\n' +
            '            </div>\n' +
            '            <div class="btn" id="goToBtn">知道了</div>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>';
        document.body.insertAdjacentHTML('beforeEnd', maskDom);
        document.getElementById('goToBtn').addEventListener('touchend', function (e) {
            callback && callback(e);
            comm.hide()
        });
        document.getElementById('closeVip').addEventListener('touchend', function (e) {
            comm.hide()
        })
    };

    comm.hide = function () {
        if (document.getElementById("vipPopup")) {
            document.getElementById("vipPopup").parentNode.removeChild(document.getElementById("vipPopup"));
        }
    };

    window.$vipCardAlert = comm;
})();