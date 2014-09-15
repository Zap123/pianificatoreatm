planner.controller = function () {
    this.tipoPercorso = m.prop(0);
    this.mezzi = m.prop(1);
    this.ctrl_routing = new routing.controller();
    this.dash = new dashboard.controller();

    this.route = function () {
        if (this.ctrl_routing.from() && this.ctrl_routing.to()) {
            this.dash.setTab(2);
            this.dash.plan = planner.Route(
                this.ctrl_routing.from(), this.ctrl_routing.cityStart(),
                this.ctrl_routing.to(), this.ctrl_routing.cityEnd(), {
                    mezzi: this.mezzi(),
                    percorso: this.tipoPercorso()
                });
        }
    }.bind(this);
};
