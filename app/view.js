planner.view = function(ctrl){
    return m("html",[
            m("title","PianificatoreATM"),
            m("body", [
                m("h1", "PianificatoreATM"),
                m("div",[
                    "DA: ",
                    m("input"),
                    m("select", ctrl.cities().map(function(city){
                       return city.nome === "milano"? m("option", {selected:"selected"},city.nome) 
                                            : m("option", city.nome);
                    }))]),
                m("div",[
                    "A: ",
                    m("input"),
                    m("select", ctrl.cities().map(function(city){
                       return city.nome === "milano"? m("option", {selected:"selected"},city.nome) 
                                            : m("option", city.nome);
                    }))]),
                m("button", {},"Calcola")
            ])
    ]);
};


