var planner = {},
    informationbar = {};

planner.Planner = function(data) {
    this.cityStart = m.prop(data.cityStart);
    this.from = m.prop(data.from);
    this.cityEnd = m.prop(data.cityEnd);
    this.to = m.prop(data.to);
    this.options = m.prop(data.options);
    this.plan = m.prop(data.plan);
    this.tab = m.prop(data.tab);
};

planner.CitiesList = function() {
    return m.request({
        method: "GET",
        url: "/cities"
    });
};

planner.NewsList = function() {
    return m.request({
        method: "GET",
        url: "/news"
    });
};

planner.Route = function(from, cityS, to, cityE, options) {
    //TODO: OPTIONS NON ACQUISITE
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
};
