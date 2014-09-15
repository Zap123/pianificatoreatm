//Ritornare form magari facendo un oggetto in base a partenza/arrivo array
routing.view = function (ctrl, ctrl_dash, ctrl_main) {
    if (ctrl_dash.plan().error) {
        var partenza = ctrl_dash.plan().partenza,
            arrivo = ctrl_dash.plan().arrivo;
        //TODO: FIX preimposta un valore quando va in errore per via ambigua
        if(partenza.length !==0)
            ctrl.from(partenza[0].nome);
        if(arrivo.length !==0)
            ctrl.to(arrivo[0].nome);
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
                        m("#form", [routing.form(ctrl_dash.plan().partenza, ctrl.from),
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
                        m("#form", [routing.form(ctrl_dash.plan().arrivo, ctrl.to),
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
                        //TODO:Implementare funzione reset
                        type: "submit",
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
                    //TODO:Implementare funzione reset
                    type: "submit",
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
