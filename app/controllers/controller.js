planner.controller = function () {
    this.tipoPercorso = m.prop(0);
    this.mezzi = m.prop(1);
    this.plan = m.prop([]);
    this.ctrl_routing = new routing.controller();
    this.dash = new dashboard.controller();

    this.reset = function () {
        this.ctrl_routing.from("");
        this.ctrl_routing.to("");
        this.ctrl_routing.cityStart("milano");
        this.ctrl_routing.cityEnd("milano");
        this.tipoPercorso(0);
        this.mezzi(1);
        this.dash.setTab('News');
        this.plan().error = false;
    }.bind(this);

    this.route = function () {
        planner.Route(
            this.ctrl_routing.from(), this.ctrl_routing.cityStart(),
            this.ctrl_routing.to(), this.ctrl_routing.cityEnd(), {
                mezzi: this.mezzi(),
                percorso: this.tipoPercorso()
            }).then(this.plan).then(this.responseBehaviour);
    }.bind(this);

    this.responseBehaviour = function (resp) {
        this.dash.setTab("Percorso");
        if (resp.error !== true) {
            if (resp.partenza.length > 0) {
                this.ctrl_routing.from(resp.partenza[0].nome);
            }
            if (resp.arrivo.length > 0) {
                this.ctrl_routing.to(resp.arrivo[0].nome);
            }
        }
    }.bind(this);
};
