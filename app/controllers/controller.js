planner.controller = function () {
    this.tipoPercorso = m.prop(0);
    this.mezzi = m.prop(1);
    this.ctrl_routing = new routing.controller();
    this.dash = new dashboard.controller();

    this.reset = function () {
        this.ctrl_routing.from("");
        this.ctrl_routing.to("");
        this.ctrl_routing.cityStart("milano");
        this.ctrl_routing.cityEnd("milano");
        this.tipoPercorso(0);
        this.mezzi(1);
        this.dash.setTab(1);
        this.dash.plan().error = false;
    }.bind(this);
    this.route = function () {
        if (this.ctrl_routing.from() && this.ctrl_routing.to()) {
            this.dash.plan = planner.Route(
                this.ctrl_routing.from(), this.ctrl_routing.cityStart(),
                this.ctrl_routing.to(), this.ctrl_routing.cityEnd(), {
                    mezzi: this.mezzi(),
                    percorso: this.tipoPercorso()
                });
            this.dash.setTab(2);
        }
    }.bind(this);
};
