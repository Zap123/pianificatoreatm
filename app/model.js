var planner = {};
planner.Planner = function(data){
    this.route = m.prop(data.route);
    this.from = m.prop(data.from);
    this.to = m.prop(data.to);
    this.options = m.prop(data.options);
};

planner.CitiesList = function() {
    return m.request({method:"GET", url:"/cities"});
};
