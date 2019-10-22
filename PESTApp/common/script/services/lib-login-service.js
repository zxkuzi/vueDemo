(function (window) {
    var login = {};
    //自动登录
    login.autoLogin = function (token, funSuc, funErr) {
        console.log(token)
        var accessToken = token ? token : 'init';
        $comm.ajaxPost('Login', 'TokenSignin', accessToken, funSuc, funErr, 'json', true);
    };
    //密码验证登录
    login.pwdLogin = function (mobile, pwd, funSuc, funErr) {
        var data = {
            mobile: mobile,
            pwd: pwd
        };
        $comm.ajaxPost('Login', 'PwdSignin', data, funSuc, funErr, 'json', true);
    };
    //短信验证登录
    // login.SMSLogin = function (mobile, verCode, funSuc, funErr) {
    //     var data = {
    //         mobile: mobile,
    //         verCode: verCode
    //     };
    //     $comm.ajaxPost('Login', 'Signin', data, funSuc, funErr, 'json', true);
    // };
    //短信验证登录
    login.SMSLogin = function (mobile, verCode, LoginType, funSuc, funErr) {
        var OpCode = 1002;
        var data = {
              Phone:mobile,					//手机号
              Pwd:'',									//密码
              LoginType:LoginType,						//登录类型（1 Token登录，2密码登录，3验证码登录）
              Token:'',							//Token字符串
              VerCode:verCode							//验证码
            };
            $comm.socket(OpCode, data, funSuc)
        // $comm.ajaxPost('Apis', 'Api', data, funSuc, funErr, 'json', true);
    };
    //获取注册验证码
    // login.sendVerCode = function (mobile, type, funSuc, funErr) {
    //     var data = {
    //         mobile: mobile,
    //         type: type
    //     };
    //     $comm.ajaxPost('Login', 'VerCode', data, funSuc, funErr, 'json', true);
    // };

    login.sendVerCode = function (mobile, type, funSuc, funErr) {
        var OpCode=1001;
        var data = {
                  Phone:mobile,					//手机号
                  SendSMSType:type							//验证码类型（1注册，2登录，3忘记密码）
                }

          $comm.socket(OpCode, data, funSuc);
        // $comm.ajaxPost('Apis', 'Api', data, funSuc, funErr, 'json', true);
    };
    //注册
    login.signUp = function (mobile, verCode, pwd, funSuc, funErr) {
       var data = {
           mobile: mobile,
           verCode: verCode,
           pwd: pwd
       };
       console.log('data' + JSON.stringify(data));
       $comm.ajaxPost('Login', 'Signup', data, funSuc, funErr, 'json', true);
    };
    //密码找回
    login.findPwd = function (mobile, verCode, pwd, funSuc, funErr) {
        var data = {
            mobile: mobile,
            verCode: verCode,
            pwd: pwd
        };
        $comm.ajaxPost('Login', 'Forget', data, funSuc, funErr, 'json', true);
    };
    //完善信息
    login.completeMsg = function (basicData, funSuc, funErr) {
        var data = {
            gender: basicData.gender,
            grade: basicData.grade,
            age: basicData.age
        };
        $comm.ajaxPost('Login', 'InfoComplete', data, funSuc, funErr, 'json', true);
    };
    //获取地区学校列表
    login.getLocationsList = function (funSuc, funErr) {
        $comm.ajaxPost('System', 'SchoolList', {}, funSuc, funErr, 'json', true);
    };
    //设置密码
    login.setUserPwd = function (pwd, funSuc, funErr) {
        $comm.ajaxPost('Login', 'SetPwd', {Pwd: pwd}, funSuc, funErr, 'json', true);
    };
    window.$Login = login;
})(window);
