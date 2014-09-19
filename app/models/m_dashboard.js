var dashboard = {};
dashboard.Dashboard = function (data) {
    this.ready = m.prop(data.ready);
};
dashboard.NewsList = function () {
    return m.request({
        method: "GET",
        url: "/news"
    });
};
