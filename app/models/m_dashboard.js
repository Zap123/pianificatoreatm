var dashboard = {};
dashboard.Dashboard = function (data) {
    this.plan = m.prop(data.plan);
    this.tab = m.prop(data.tab);
};
dashboard.NewsList = function () {
    return m.request({
        method: "GET",
        url: "/news"
    });
};

