(function () {
    var comm = {};

    comm.show = function (params, callback) {
        comm.hide();
        if (params.length === 0) {
            return;
        }
        var dom = '<div id="changeBookPickerWrap" class="action-sheet">\n' +
            '        <div id="changeBookPicker" id="" class="item-content">\n' +
            '        </div>\n' +
            '    </div>';
        document.body.insertAdjacentHTML('beforeEnd', dom);
        var domChangeBookPicker = document.getElementById('changeBookPicker');

        params && params.length > 0 && params.forEach(function (item) {
            domChangeBookPicker.innerHTML += ' <div id="'+ item +'" class="item-label"> ' + item + '</div>'
        });
        setTimeout(function(){
            domChangeBookPicker.style.transform = 'translateY(0%)';
            domChangeBookPicker.style.transition = '0.5s ease';
        });
        domChangeBookPicker.addEventListener('touchstart', function (e) {
            e.stopPropagation();
        });
        document.getElementById('changeBookPickerWrap').addEventListener('touchstart', function (e) {
            setTimeout(function () {
                comm.hide();
            }, 500);
            domChangeBookPicker.style.transform = 'translateY(100%)';
            domChangeBookPicker.style.transition = '0.5s ease';
        });
        domChangeBookPicker.addEventListener('touchstart', function (e) {
            if (e.target.id === 'changeBookPicker') {
                return;
            }
            callback && callback(e.target.id)
        })
    };


    comm.hide = function () {
        if (document.getElementById("changeBookPickerWrap")) {
            document.getElementById("changeBookPickerWrap").parentNode.removeChild(document.getElementById("changeBookPickerWrap"));
        }
    };
    window.$chanbBookSheet = comm;
})();