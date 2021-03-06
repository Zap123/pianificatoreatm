var planner = {};

planner.Planner = function (data) {
    this.options = m.prop(data.options);
    this.tipoPercorso = m.prop(data.tipoPercorso);
    this.mezzi = m.prop(data.mezzi);
    this.steps = m.prop(data.steps);
    this.plan = m.prop(data.plan);
};

planner.Route = function (from, cityS, to, cityE, options) {
    if (from && to) {
        return m.request({
            method: "POST",
            url: "/route",
            data: {
                from: from,
                cityS: cityS,
                to: to,
                cityE: cityE,
                options: options
            }
        });
    }
};
