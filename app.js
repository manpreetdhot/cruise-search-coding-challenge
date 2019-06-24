angular.module("CruiseSearch",['main','ngMaterial','ngRoute','ngAnimate']);
angular.module("main",[]);

'use strict';

angular
    .module("CruiseSearch")
    .controller("MainController", MainController)
    .service('cruiseService', cruiseService)
    

    cruiseService.$inject = ['$q','$http'];
    function cruiseService($q, $http) {
        // interface
        var cruiseService = {
            cruiseSearchAPI: cruiseSearchAPI
        };
        return cruiseService;

        // Calling cruise search api
        function cruiseSearchAPI() {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: 'service.json'
            }).then(function (response) {
                var data = response.data;
                deferred.resolve(data);
            }, function () {
                let e = "Error calling web service, please try again or contact support.";
                deferred.reject(e);
            });

            return deferred.promise;
        }
    }

    MainController.$inject = ['cruiseService','$mdDialog','$route','$document'];
    function MainController(cruiseService, $mdDialog, $route, $document) {
        var vm = this;

        // returning month name based upon number
        monthName = function (mon) {
            return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'][mon - 1];
         }

        // only use first voyage in each itinerary
        vm.$onInit = function () { 
            vm.showBooking = false;
            vm.room = null;
            vm.selected = false;
            return cruiseService.cruiseSearchAPI().then(function (response) {
                vm.cruiseData = response.data[0].attributes.itineraries;
            });
        }

        vm.getDates = function(inputDate) {
            var depDates;
            var day, month, year;

            var date = inputDate.substring(0,10);
            day = date.substring(8,10);
            month = monthName(date.substring(5,7));
            year = date.substring(0,4);
            var dateString = day + " " + month + " " + year;
            depDates = dateString;

            return depDates;
        }


        // Check if stateroom is sold out
        vm.isSoldOut = function (room) {
            if (room.priceBlocks[0].currencyCode === 'SOLD_OUT') {
                return true;
            } else {
                return false;
            }
        }

        // determining the price for each stateroom
        vm.getPricing = function(room) {
            if (room.priceBlocks[0].currencyCode !== 'SOLD_OUT') {
                return "US$" + room.priceBlocks[0].prices[0].fare + "*";
            }
        }

        // Determining initial lowest price
        vm.getLowestPricing = function(desc,priceArray) {
            vm.fromDisplay = "";
            var fromPrice = "";
            vm.taxes = "";
            for (var i = 0; i < priceArray.length; i++) {
                if (priceArray[i].display && priceArray[i].priceBlocks[0].currencyCode == "USD") {
                    vm.fromDisplay = priceArray[i]._id;
                    vm.taxes = priceArray[i].priceBlocks[0].govtFeesAndTaxes;
                    fromPrice = priceArray[i].priceBlocks[0].prices[0].fare;
                    break;
                }
            }
            return fromPrice;
        }

        // Opening modal for taxes/fees
        vm.openFees = function(currency,fees) {
            alert = $mdDialog.alert()
            .title('Additional fees')
            .content('The taxes and fees add up to be ' + currency + fees)
            .ok('Close');

            $mdDialog
                .show( alert )
                .finally(function() {
                    alert = undefined;
                });
        }

        vm.selectRoom = function(room) {
            vm.room = room;
        }

        // Display booking information in separate dialog
        vm.displayBooking = function(trip) {
            $mdDialog.show({
                controller: 'BookNowController',
                controllerAs: 'ctrl',
                templateUrl: 'routes/booknow/booknow.html',
                parent: angular.element($document[0].body),
                clickOutsideToClose: true,
                locals: {
                    room: vm.room,
                    trip: trip
                }
            });

            setTimeout(function() {
                document.getElementById("loader").style.display = "none";
                document.getElementById("bookingInfo").style.display = "block";
            }, 500);
        }


        // Display itinerary in separate dialog
        vm.displayItinerary = function(trip) {
            $mdDialog.show({
                controller: 'ItineraryController',
                controllerAs: 'ctrl',
                templateUrl: 'routes/viewitinerary/itinerary.html',
                parent: angular.element($document[0].body),
                clickOutsideToClose: true,
                locals: {
                    trip: trip,
                    dateDecipher: vm.getDates
                }
            });

            setTimeout(function() {
                document.getElementById("loader").style.display = "none";
                document.getElementById("bookingInfo").style.display = "block";
            }, 500);
        }


    }
