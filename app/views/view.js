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
                class: "pure-g"
            }, [
                m("div", {
                    class: "pure-u-1 pure-u-md-1-2"
                }, [
                    m("form", {
                        name: "pianificatore",
                        autocomplete: "on",
                        class: "pure-form pure-form-aligned",
                        action: "#"
                    }, [
                        m("fieldset", [
                            m("div", {
                                class: "pure-control-group"
                            }, [
                                m("input", {
                                    required: true,
                                    autofocus: true,
                                    onchange: m.withAttr("value", ctrl.from),
                                    placeholder: "Da...",
                                    value: ctrl.from()
                                }),
                                m("select", {
                                    onchange: m.withAttr("value", ctrl.cityStart)
                                }, ctrl.cities().map(function (city) {
                                    return city.nome === "milano" ? m("option", {
                                        selected: "selected"
                                    }, city.nome) : m("option", city.nome);
                                })),
                            ]),
                            m("div", {
                                class: "pure-control-group"
                            }, [
                                m("input", {
                                    required: true,
                                    onchange: m.withAttr("value", ctrl.to),
                                    value: ctrl.to(),
                                    placeholder: "A..."
                                }),
                                m("select", {
                                    onchange: m.withAttr("value", ctrl.cityEnd)
                                }, ctrl.cities().map(function (city) {
                                    return city.nome === "milano" ? m("option", {
                                        selected: "selected"
                                    }, city.nome) : m("option", city.nome);
                                }))
                            ]),
                            m("input", {
                                //TODO:Implementare funzione reset
                                type: "submit",
                                class: "pure-button",
                                value: "Reset"
                            }),
                            m("input", {
                                type: "submit",
                                onclick: ctrl.route,
                                class: "pure-button pure-button-primary",
                                value: "Calcola"
                            }),


                        ]),
                    ]),

                ]),
                m("div", {
                    class: "pure-u-1 pure-u-md-1-4"
                }, [
                    m("form", {
                        class: "pure-form"
                    }, [
                        m("fieldset", [
                            m("legend", "Come si desidera viaggiare?"),
                            m("select", [
                                m("option", "Il percorso più veloce"),
                                m("option", "Pochi tratti a piedi"),
                                m("option", "Pochi trasbordi")
                            ]),
                        ]),
                        m("div", [
                            m("label", {
                                for: "tutti-mezzi",
                                class: "pure-radio"
                            }, [
                                m("input[type=radio]", {
                                    value: 1,
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
                                    name: "mezzi",
                                    id: "no-metro",
                                }),
                                "Escludi metrò",
                            ]),
                        ]),
                    ]),
                ]),
            ]),
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
            //Navigazione
            m("#dashboard", [new dashboard.view(ctrl.dash)])
        ])
    ]);
};
