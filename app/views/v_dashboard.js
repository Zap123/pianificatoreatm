dashboard.view = function(ctrl){
    switch(ctrl.tab()){
    //Comunicati
    case 1:
        return   m("table",{class:"pure-table"}, [
                    m("thead",[
                        m("tr",[    
                            m("th",""),
                            m("th","Comunicati")
                        ])
                    ]),
                    ctrl.news().map(function(news){
                    return     m("tr",[
                                 m("td",[m("a",{href:news.url}, "🔗 ")]),
                                 m("td", news.testo)
                                ]);
                    })
                ]);
    //Percorsi
    case 2:
       return       m("strong", {
                    class: "font-bold block"
                }, [
                    ctrl.plan().info
                ]),
                m("ol", [
                    ctrl.plan().steps.map(function(step) {
                        var ret = [];
                        var i = 0;
                        for (var literal in step) {
                            if (i === 0) {
                                ret.push(m("li", [
                                    literal + " " + step[literal]
                                ]));
                            } else {
                                ret.push(m("div", [
                                    literal + " " + step[literal]
                                ]));
                            }
                            i++;
                        }
                        return ret;
                    })
                ]);
    }
};

