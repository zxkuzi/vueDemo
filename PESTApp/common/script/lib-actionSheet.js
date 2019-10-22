(function () {
    var comm = {};
    comm.show = function (params) {
        comm.hide();
        var dom = '<div id="actionPickerWrap" class="action-picker">\n' +
            '        <div id="actionPicker" class="action-picker-wrap">\n' +
            '            <div class="action-picker-title" id="picker-title">' + params.title + '</div>\n' +
            '            <div id="pickerItem" class="action-picker-content">\n' +
            '            </div>\n' +
            '            <div id="cancelBtn" class="action-picker-cancel">取消</div>\n' +
            '        </div>\n' +
            '    </div>';
        document.body.insertAdjacentHTML('beforeEnd', dom);
        if (params.items && params.items.length > 0) {
            document.getElementById('pickerItem').innerHTML = null;
            params.items.forEach(function (item, index) {
                var domItem;
                if (index === 0) {
                    domItem = '<div class="action-picker-item item-first">' + item + '</div>';
                } else if (index === (params.items.length - 1)) {
                    domItem = '<div class="action-picker-item item-last">' + item + '</div>';
                } else {
                    domItem = '<div class="action-picker-item">' + item + '</div>';
                }
                document.getElementById('pickerItem').insertAdjacentHTML('beforeEnd', domItem);
            })
        }
        if(!params.title){
          document.getElementById("picker-title").style.display="none"
          document.getElementsByClassName('item-first')[0].style.cssText="border-top-right-radius:1rem;border-top-left-radius: 1rem;"
        }
        var domActionPicker = document.getElementById('actionPicker');
        setTimeout(function(){
            domActionPicker.style.transform = 'translateY(0%)';
            domActionPicker.style.transition = '0.5s ease';
        });
        domActionPicker.addEventListener('click', function (e) {
            e.stopPropagation();
        });
        document.getElementById('pickerItem').addEventListener('click', function (e) {
            params.onclick(e.target.innerHTML);
            comm.hide();
        });
        document.getElementById('cancelBtn').addEventListener('click', function (e) {
            domActionPicker.style.transform = 'translateY(100%)';
            setTimeout(function () {
                comm.hide();
            }, 500)
        });
        document.getElementById('actionPickerWrap').addEventListener('click', function (e) {
            comm.hide();
        })
    };

    comm.hide = function () {
        if (document.getElementById("actionPickerWrap")) {
            document.getElementById("actionPickerWrap").parentNode.removeChild(document.getElementById("actionPickerWrap"));
        }
    };
    window.$actionSheet = comm
})();
