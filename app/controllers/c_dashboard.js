dashboard.controller = function () {
    this.tab = "News";
    this.news = dashboard.NewsList();
    this.ready = m.prop(false);
    this.setTab = function (tab) {
        console.log(this.tab + ">" + tab);
        this.tab = tab;
    };
};
