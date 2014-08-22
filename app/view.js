//TODO: CSS Bootstrap o altro
//TODO: Maiuscoletto
planner.view = function(ctrl){
    return m("html",[
            m("title","PianificatoreATM"),
            m("body", [
                m("h1", "PianificatoreATM"),
                m("form",{action:"#"},[
                        m("div",[
                            "DA: ",
                            m("input", {required:true}),
                            m("select", ctrl.cities().map(function(city){
                               return city.nome === "milano"? m("option", {selected:"selected"},city.nome) 
                                                    : m("option", city.nome);
                        }))]),
                        
                        m("div",[
                            "A: ",
                            m("input", {required:true}),
                            m("select", ctrl.cities().map(function(city){
                               return city.nome === "milano"? m("option", {selected:"selected"},city.nome) 
                                                    : m("option", city.nome);
                         }))]),
                        m("div", [
                        "Tutti i mezzi ",
                        m("input[type=radio]",{value:1,checked:"checked"}),
                        ]),
                        m("input", {type:"submit",onclick:ctrl.route},"Calcola")
                ])])
    ]);
};


