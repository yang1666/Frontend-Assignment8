(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective);

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var ctrl = this;
        ctrl.searchTerm = "";
        ctrl.found = [];

        ctrl.narrowDown = function () {
            console.log("Narrow down called with searchTerm:", ctrl.searchTerm);
            if (ctrl.searchTerm.trim() !== "") {
                MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
                    .then(function (result) {
                        console.log("Items found:", result);
                        ctrl.found = result;
                    })
                    .catch(function (error) {
                        console.error('Error:', error);
                        // Optionally handle errors in the UI, e.g., show an error message
                    });
            } else {
                ctrl.found = [];
            }
        };
        
        ctrl.removeItem = function (index) {
            ctrl.found.splice(index, 1);
        };
    }

    function MenuSearchService($http) {
        var service = this;
    
        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: "GET",
                url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
            }).then(function (result) {
                console.log(result);
                var allMenuItems = [];
                for (var key in result.data) {
                    if (result.data.hasOwnProperty(key)) {
                        allMenuItems = allMenuItems.concat(result.data[key].menu_items);
                    }
                }
                console.log("All menu items:", allMenuItems);
                return allMenuItems.filter(function (item) {
                    return item.description.toLowerCase().includes(searchTerm.toLowerCase());
                });
            }).catch(function (error) {
                console.error("Error fetching data:", error);
                throw error; // Rethrow the error after logging
            });
        };
    }
    
    
    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                foundItems: '<',
                onRemove: '&'
            }
        };
        return ddo;
    }
})();
