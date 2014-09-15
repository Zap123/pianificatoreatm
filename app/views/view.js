planner.view = function (ctrl) {
    return m("html", [
        m("link", {
            rel: "stylesheet",
            href: "css/style.css"
        }),
        m("link", {
            rel: "stylesheet",
            href: "css/pure-skin-red.css"
        }),
        m("link", {
            rel: "stylesheet",
            href: "css/grids-responsive-min.css"
        }),
        m("title", "PianificatoreATM"),
        m("body", {
            class: "pure-skin-red"
        }, [
            m("div", {
                class: "pure-menu pure-menu-open pure-menu-horizontal"
            }, [
                m("h1", {
                    class: "pure-menu-heading"
                }, "PianificatoreATM"),
            ]),
            m("div", {
                class: "pure-g",
                style: {
                    padding: '1em'
                }
            }, [
                m("div", {
                    class: "pure-u-1 pure-u-md-1-2"
                }, [
                //Form pianificatore
                m("#route", [new routing.view(ctrl.ctrl_routing,ctrl.dash, ctrl)])
                ]),
                m("div", {
                    class: "pure-u-1 pure-u-md-1-4"
                }, [
                    m("form", {
                        class: "pure-form"
                    }, [
                        m("fieldset", [
                            m("legend", "Come si desidera viaggiare?"),
                            m("select", {
                                onchange: m.withAttr("value", ctrl.tipoPercorso)
                            }, [
                                m("option", {
                                    value: 0
                                }, "Il percorso più veloce"),
                                m("option", {
                                    value: 1
                                }, "Pochi tratti a piedi"),
                                m("option", {
                                    value: 2
                                }, "Pochi trasbordi")
                            ]),
                        ]),
                        m("div", [
                            m("label", {
                                for: "tutti-mezzi",
                                class: "pure-radio"
                            }, [
                                m("input[type=radio]", {
                                    value: 1,
                                    onchange: m.withAttr("value", ctrl.mezzi),
                                    name: "mezzi",
                                    id: "tutti-mezzi",
                                    checked: true
                                }),
                                "Tutti i mezzi"
                            ]),
                            m("label", {
                                class: "pure-radio",
                                for: "no-metro"
                            }, [
                                m("input[type=radio]", {
                                    value: 3,
                                    onchange: m.withAttr("value", ctrl.mezzi),
                                    name: "mezzi",
                                    id: "no-metro",
                                }),
                                "Escludi metrò",
                            ]),
                        ]),
                    ]),
                ]),
            ]),
            //Navigazione
            m("div", {
                class: "pure-menu pure-menu-open pure-menu-horizontal"
            }, [
                m("ul", [
                    m("li", {
                        class: "pure-menu-selected"
                    }, [
                        m("a", {
                            href: "#"
                        }, "News"),
                    ]),
                    m("li", {
                        class: "pure-menu-disabled"
                    }, [
                        m("a", {
                            href: "#"
                        }, "Percorso"),
                    ]),
                    m("li", {
                        class: "pure-menu-disabled"
                    }, [
                        m("a", {
                            href: "#"
                        }, "Mappa"),
                    ]),
                ])
            ]),
            m("#dashboard", [new dashboard.view(ctrl.dash)])
        ])
    ]);
};
