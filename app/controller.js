planner.controller = function(){
    this.route = m.prop("");
    this.from = m.prop("milano");
    this.to = m.prop("milano");
    this.cities = planner.CitiesList();
};
