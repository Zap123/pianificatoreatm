planner.controller = function() {
    this.from = m.prop("");
    this.cityStart = m.prop("milano");
    this.to = m.prop("");
    this.cityEnd = m.prop("milano");
    this.dash = new dashboard.controller();
    
    this.cities = planner.CitiesList();
    this.news = planner.NewsList();
    this.route = function() {
        if (this.from() && this.to()) {
            this.dash.setTab(2);
            this.dash.plan = planner.Route(
                this.from(), this.cityStart(),
                this.to(), this.cityEnd(), undefined);
        }
    }.bind(this);
};