planner.controller = function () {
    this.from = m.prop("");
    this.cityStart = m.prop("milano");
    this.to = m.prop("");
    this.cityEnd = m.prop("milano");
    this.tipoPercorso = m.prop(0);
    this.mezzi = m.prop(1);
    this.dash = new dashboard.controller();

    this.cities = planner.CitiesList();
    this.news = planner.NewsList();
    this.route = function () {
        if (this.from() && this.to()) {
            this.dash.setTab(2);
            this.dash.plan = planner.Route(
                this.from(), this.cityStart(),
                this.to(), this.cityEnd(), {
                    mezzi: this.mezzi(),
                    percorso: this.tipoPercorso()
                });
        }
    }.bind(this);
};
