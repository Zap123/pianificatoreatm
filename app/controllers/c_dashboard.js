dashboard.controller = function () {
    this.tab = m.prop(1);
    this.news = dashboard.NewsList();
    this.setTab = function (tab) {
        console.log(this.tab() + ">" + tab);
        this.tab(tab);
    };
};
