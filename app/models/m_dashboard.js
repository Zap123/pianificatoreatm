var dashboard = {};
dashboard.Dashboard = function (data) {};
dashboard.NewsList = function () {
    return m.request({
        method: "GET",
        url: "/news"
    });
};
