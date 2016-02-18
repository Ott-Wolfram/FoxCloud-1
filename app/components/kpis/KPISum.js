/**
 * @class KPISum
 * @memberOf FSCounterAggregatorApp
 * @description Compute the sum for a set of data indicators
 */
(function() {
    
    angular.module('FSCounterAggregatorApp').
	controller('KPISum', [ 
	    "ComputeService",	    
	    function(
		ComputeService
	    ) {

		this.getDefaultIndicatorId = function() {
		    return "in";
		};

		this.getLabel = function(id) {
		    return "total ".concat(id);
		};

		/**
		 * @function compute
		 * @memberOf FSCounterAggregatorApp.KPISum
		 * @description Returns the total of  
		 * data within a period of time
		 */
		this.compute = function(query) {

		    var res = { 
			query: query,
			value: 0
		    };
		
		    var felt = function(elt) {
			return elt[query.indicator];
		    };
		
		    for(var i = 0; i < query.data.length; ++i) {
			res.value += ComputeService.cSum(query.data[i].data, 
							 felt);
		    }

		    return res;
		};
		
	    }]);
}());
	
