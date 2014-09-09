var dashboard = {};

dashboard.Dashboard = function(data){
    this.plan = m.prop(data.plan);
    this.tab = m.prop(data.tab);
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
