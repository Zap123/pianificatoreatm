var dashboard = {};
dashboard.Dashboard = function (data) {
    this.tab = m.prop(data.tab);
};
dashboard.NewsList = function () {
    return m.request({
        method: "GET",
        url: "/news"
    });
};
