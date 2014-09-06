planner.controller = function() {
    this.from = m.prop("");
    this.cityStart = m.prop("milano");
    this.to = m.prop("");
    this.cityEnd = m.prop("milano");
    this.plan = m.prop({steps:[]});
    
    this.cities = planner.CitiesList();
    this.route = function() {
        if (this.from() && this.to()) {
            this.plan = planner.Route(
                this.from(), this.cityStart(),
                this.to(), this.cityEnd(), undefined);
        }
    }.bind(this);
};
