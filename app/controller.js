planner.controller = function() {
    this.from = m.prop("");
    this.cityStart = m.prop("milano");
    this.to = m.prop("");
    this.cityEnd = m.prop("milano");
    this.plan = m.prop({info:[],steps:[]});
    this.tab = m.prop("1");
    
    this.cities = planner.CitiesList();
    this.news = planner.NewsList();
    this.route = function() {
        this.tab = 2;
        if (this.from() && this.to()) {
            this.plan = planner.Route(
                this.from(), this.cityStart(),
                this.to(), this.cityEnd(), undefined);
        }
    }.bind(this);
    this.setTab = function(tab){
        this.tab = tab;
    };
};
