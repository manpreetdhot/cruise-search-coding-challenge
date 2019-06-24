(function () {
    'use strict';

    angular
        .module('CruiseSearch')
        .controller('ItineraryController', ItineraryController)

    ItineraryController.$inject = ['trip','dateDecipher'];
    function ItineraryController(trip, dateDecipher) {
        var vm = this;
        vm.trip = trip;

        vm.getDate = function(date) {
            return dateDecipher(date);
        }
    }
})();
