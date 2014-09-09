planner.view = function(ctrl) {
    return m("html", [
        m("link", {
            rel: "stylesheet",
            href: "style.css"
        }),
        m("link", {
            rel: "stylesheet",
            href: "pure-skin-red.css"
        }),
        m("title", "PianificatoreATM"),
        m("body",{class:"pure-skin-red"}, [
            m("div", {
                class: "pure-menu pure-menu-open pure-menu-horizontal"
            }, [
                m("h1",{class:"pure-menu-heading"},"PianificatoreATM"),
            ]),
            m("form", {
                class: "pure-form pure-form-aligned",
                action: "#"
            }, [
                m("fieldset", [
                    m("div",{class:"pure-control-group"}, [
                        m("input", {
                            required: true,
                            autofocus: true,
                            onchange: m.withAttr("value", ctrl.from),
                            placeholder: "Da...",
                            value: ctrl.from()
                        }),
                        m("select", {
                            onchange: m.withAttr("value", ctrl.cityStart)
                        }, ctrl.cities().map(function(city) {
                            return city.nome === "milano" ? m("option", {
                                selected: "selected"
                            }, city.nome) : m("option", city.nome);
                        })),
                    ]),
                    m("div",{class:"pure-control-group"}, [
                        m("input", {
                            required: true,
                            onchange: m.withAttr("value", ctrl.to),
                            value: ctrl.to(),
                            placeholder: "A..."
                        }),
                        m("select", {
                            onchange: m.withAttr("value", ctrl.cityEnd)
                        }, ctrl.cities().map(function(city) {
                            return city.nome === "milano" ? m("option", {
                                selected: "selected"
                            }, city.nome) : m("option", city.nome);
                        }))
                    ]),
                ]),
                m("div",{class:"pure-controls"},[
                    m("label", {
                        for: "tutti-mezzi",
                        class: "pure-radio"
                    }, [
                        m("input[type=radio]", {
                            value: 1,
                            id: "tutti-mezzi",
                            checked: "checked"
                        }),
                        "Tutti i mezzi"
                    ]),
                      m("label", {
                        for: "no-metro",
                        class: "pure-radio"
                    }, [
                        m("input[type=radio]", {
                            //TODO: VALORI SBAGLIATI
                            value: 2,
                            id: "no-metro",
                        }),
                        "Escludi metrò"
                    ]),
                ]),
                m("form",{action:"/"},[
                    m("input",{
                        type:"submit",
                        class:"pure-button",
                        value:"Reset"
                    })
                ]),
                m("input", {
                    type: "submit",
                    onclick: ctrl.route,
                    class: "pure-button pure-button-primary",
                    value: "Calcola"
                }),
            ]),
            m("div",{class:"pure-menu pure-menu-open pure-menu-horizontal"},[
                    m("ul",[
                        m("li",{class:"pure-menu-selected"},[
                            m("a",{href:"#"},"News"),
                        ]),
                        m("li",{class:"pure-menu-disabled"},[
                            m("a",{href:"#"},"Percorso"),
                        ]),
                        m("li",{class:"pure-menu-disabled"},[
                            m("a",{href:"#"},"Mappa"),
                        ]),
                    ])
            ]),
            //Navigazione
            m("div", [
                m("table",{class:"pure-table"}, [
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
                ]),
                    
                m("strong", {
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
                ])
            ]),
        ])
    ]);
};
