/**
 * Created by liu on 16-8-18.
 */
appDirectives
    .directive('hospitalQuery', function () {
        return {
            controller: function ($element, localStorage, $scope, LeanCloudClassService) {
                var map = new BMap.Map("allmap");
                var mapPoint = new BMap.Point($scope.currentPoint.longitude, $scope.currentPoint.latitude);
                //var mapPoint = new BMap.Point(114.539059999, 38.036654);
                map.centerAndZoom(mapPoint, 16);

                //var currentPoint = localStorage.get("userChosePoint");
                //
                //var getFreeNearDeliverSql = "select * from hospitalInfo where " +
                //    "point near [" + currentPoint.longitude + "," + currentPoint.latitude + "] max 5 km";
                //LeanCloudClassService.sql(getFreeNearDeliverSql, function (data) {
                //    for (var i = 0; i < data.length; i++) {
                //        map.centerAndZoom(data[i].province, 16);
                //        map.addOverlay(new BMap.Marker(new BMap.Point(data[i].point.longitude, data[i].point.latitude)));
                //    }
                //});

                var getAddressInfo = function () {
                    if (local.oz) {
                        local.oz.forEach(function (item, value) {
                            getRange(item, value);
                            addOverlay(item, value);
                            delete local.Ym.na.sf[value].phoneNumber;
                        });
                    }
                };

                function getRange(item, value) {
                    var mapPosition = map.getDistance(new BMap.Point($scope.currentPoint.longitude, $scope.currentPoint.latitude), new BMap.Point(item.lng, item.lat));

                    if (mapPosition >= 1000) {
                        local.Ym.na.sf[value].range = (mapPosition / 1000).toFixed(1) + '公里';
                    } else {
                        local.Ym.na.sf[value].range = mapPosition.toFixed(0) + '米';
                    }
                }

                function addOverlay(item, value) {
                    var myIcon = new BMap.Icon("./img/ditu.png", new BMap.Size(23, 25), {
                        offset: new BMap.Size(10, 25),
                        imageOffset: new BMap.Size(0, 0 - value * 25)
                    });
                    var point = new BMap.Point(item.lng, item.lat);
                    var marker = new BMap.Marker(point, {icon: myIcon});
                    map.addOverlay(marker);

                }

                var addHtml = setInterval(function () {
                    if (local.Ym.na.sf != undefined) {
                        var totalInfo = "";
                        local.Ym.na.sf.forEach(function (item, value) {
                            totalInfo += getListHtml(value + 1, item.title, item.address, item.range);
                            clearInterval(addHtml)
                        });
                        document.getElementById("mapListInfo").innerHTML = totalInfo;
                    }
                }, 100);

                function getListHtml(num, name, address, meter) {
                    return '<li class="map-li">' +
                        '<div><div><span class="fs16">' + num + '.' + name + '</span>' +
                        '<span class="fr">' + meter + '</span></div>' +
                        '<div class="mt10"><span class="map-list-address fs14">' + address + '</span></div></div></li>'
                }

                var local = new BMap.LocalSearch(map, {
                    renderOptions: {panel: "result"}, onSearchComplete: getAddressInfo, pageCapacity: 9
                });
                local.searchNearby("医院", mapPoint, 1000);
            }
        }
    });