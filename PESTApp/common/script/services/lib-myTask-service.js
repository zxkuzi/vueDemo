(function () {
    var comm = {};
    //任务列表
    comm.getMyTasks = function (funSuc, funErr) {
        $comm.ajaxPost('user', 'MyTasks', {}, funSuc, funErr)
    };

    window.$myTask = comm
})();