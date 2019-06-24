(function () {
    'use strict';

    angular
        .module('CruiseSearch')
        .controller('BookNowController', BookNowController)

    BookNowController.$inject = ['trip','room'];
    function BookNowController(trip, room) {
        var vm = this;
        vm.trip = trip;
        vm.room = room;
    }
})();
