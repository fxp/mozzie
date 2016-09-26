/**
 * Created by liu on 16-7-21.
 */
appControllers.controller('loginCtrl', function ($scope, LeanCloudLoginService, JumpPagService, $interval, localStorage) {
    function init() {
        $scope.verificationButtonText = "获取验证码";
    }

    init();

    $scope.postSms = function (number) {
        console.log(number)
        if (number == undefined || number == "") {
            return alert("号码为空");
        }
        var userData = {
            mobilePhoneNumber: number,
            ttl: 1
        };
        LeanCloudLoginService.smsVerification(userData, function () {
            $scope.showtime(60);
        })
    };

    $scope.verify = function (num, phone) {
        var data = {mobilePhoneNumber: phone, smsCode: num};
        login(data)
    };

    function login(data) {
        LeanCloudLoginService.loginOrRegister(data, function (data) {
            if (data.type == "admin") {
                JumpPagService.path("/manage")
            } else {
                JumpPagService.path("/home");
            }

            localStorage.set("currentUser", data);
        });
    }

    $scope.showtime = function (time) {
        $scope.showTime = true;
        $interval(function () {
            if (time == 0) {
                $scope.verificationButtonText = "重发验证码";
                $scope.showTime = false;
            } else {
                time--;
                $scope.verificationButtonText = time + "s后重发";
            }
        }, 1000, 61);
    };
});