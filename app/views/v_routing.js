//Ritornare form magari facendo un oggetto in base a partenza/arrivo array
routing.view = function (ctrl, ctrl_dash, ctrl_main) {
    console.log(ctrl_main.plan());
    if (ctrl_main.plan().error) {
        //TODO: FIX ERRORE PREDEFINITA VIA AMBIGUA
        //Se vado in errore ritorno alle news
        ctrl_dash.setTab(1);
        return m("div", [
            m("strong", "Non è stato possibile trovare un percorso"),
            m("form", {
                name: "pianificatore",
                autocomplete: "on",
                class: "pure-form",
                action: "#"
            }, [
                m("fieldset", [
                    m("div", {
                        class: "pure-control-group"
                    }, [
                        m("#form", [routing.form(ctrl_main.plan().partenza, ctrl.from),
                            m("select", {
                                onchange: m.withAttr("value", ctrl.cityStart)
                            }, ctrl.cities().map(function (city) {
                                return city.nome === ctrl.cityStart() ? m("option", {
                                    selected: "selected"
                                }, city.nome) : m("option", city.nome);
                            })),
                        ])
                    ]),
                    m("div", {
                        class: "pure-control-group"
                    }, [
                        m("#form", [routing.form(ctrl_main.plan().arrivo, ctrl.to),
                            m("select", {
                                onchange: m.withAttr("value", ctrl.cityEnd)
                            }, ctrl.cities().map(function (city) {
                                return city.nome === ctrl.cityEnd() ? m("option", {
                                    selected: "selected"
                                }, city.nome) : m("option", city.nome);
                            })),
                        ])
                    ]),
                    m("input", {
                        type: "submit",
                        onclick: ctrl_main.reset,
                        class: "pure-button",
                        value: "Reset"
                    }),
                    m("input", {
                        type: "submit",
                        onclick: ctrl_main.route,
                        class: "pure-button pure-button-primary",
                        value: "Calcola"
                    }),
                ]),
            ])
        ]);

    } else {
        return m("form", {
            name: "pianificatore",
            autocomplete: "on",
            class: "pure-form",
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
                        return city.nome === ctrl.cityStart() ? m("option", {
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
                        return city.nome === ctrl.cityEnd() ? m("option", {
                            selected: "selected"
                        }, city.nome) : m("option", city.nome);
                    }))
                ]),
                m("input", {
                    type: "submit",
                    class: "pure-button",
                    onclick: ctrl_main.reset,
                    value: "Reset"
                }),
                m("input", {
                    type: "submit",
                    onclick: ctrl_main.route,
                    class: "pure-button pure-button-primary",
                    value: "Calcola"
                }),
            ]),
        ]);
    }
};

routing.form = function (alternative, luogo) {
    //comportamento del form per cercare la via con gestione degli errori
    if (alternative.length === 0) {
        return m("input", {
            required: true,
            autofocus: true,
            onchange: m.withAttr("value", luogo),
            placeholder: "Da...",
            value: luogo()
        });
    } else {
       //luogo(alternative[0].nome);
       console.log(luogo()); 
        return m("select", {
            onchange: m.withAttr("value", luogo)
        }, alternative.map(function (via) {
            return m("option", via.nome);
        }));
    }
};

