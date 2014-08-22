var planner = {};
planner.Planner = function(data){
    this.cityStart = m.prop(data.cityStart);
    this.from = m.prop(data.from);
    this.cityEnd = m.prop(data.cityEnd);
    this.to = m.prop(data.to);
    this.options = m.prop(data.options);
};

planner.CitiesList = function() {
    return m.request({method:"GET", url:"/cities"});
};

planner.Route = function() {
    console.log("options");
    return m.request({method:"POST", url:"/route"});
};
