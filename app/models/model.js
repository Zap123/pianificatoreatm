var planner = {},
    informationbar = {};

planner.Planner = function(data) {
    this.cityStart = m.prop(data.cityStart);
    this.from = m.prop(data.from);
    this.cityEnd = m.prop(data.cityEnd);
    this.to = m.prop(data.to);
    this.options = m.prop(data.options);
    this.tipoPercorso = m.prop(data.tipoPercorso);
    this.mezzi = m.prop(1);
};

planner.CitiesList = function() {
    return m.request({
        method: "GET",
        url: "/cities"
    });
};


