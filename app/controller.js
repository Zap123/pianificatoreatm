planner.controller = function(){
    this.from = m.prop("");
    this.cityStart = m.prop("milano");
    this.to = m.prop("");
    this.cityEnd = m.prop("milano");

    this.cities = planner.CitiesList(); 
    this.route = function(){
        console.log("Click Clack");
        planner.Route();
    };
};
