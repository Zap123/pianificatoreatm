dashboard.controller = function () {
    this.tab = m.prop(1);
    this.plan = m.prop({
        info: [],
        steps: [],
        plan: function(){return {error:false};}
    });
    this.news = dashboard.NewsList();
    this.setTab = function (tab) {
        console.log(this.tab() + ">" + tab);
        this.tab(tab);
//        m.redraw();
    };
};
