dashboard.controller = function() {
    this.tab = m.prop(1);
    this.plan = m.prop({info:[],steps:[]});
    this.news = planner.NewsList();
    this.setTab = function(tab){
        console.log(this.tab()+">"+tab);
        this.tab = m.prop(tab);
    };
};
