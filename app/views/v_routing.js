//Ritornare form magari facendo un oggetto in base a partenza/arrivo array
routing.view = function (ctrl, ctrl_dash, ctrl_main) {
    console.log(ctrl_dash.plan());
    if (ctrl_dash.plan().error) {
        return m("form", {
            name: "pianificatore",
            autocomplete: "on",
            class: "pure-form pure-form-aligned",
            action: "#"
        }, [
            m("strong", "Non è stato possibile trovare un percorso unico"),
            m("fieldset", [
                m("div", {
                    class: "pure-control-group"
                }, [
                    m("#form", [routing.form(ctrl)]),
                    m("select", {
                        onchange: m.withAttr("value", ctrl.from)
                    }, ctrl_dash.plan().partenza.map(function (via) {
                        ctrl.from = m.prop(via.nome);
                        return m("option", via.nome);
                    })),
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
                    m("select", {
                        onchange: m.withAttr("value", ctrl.to)
                    }, ctrl_dash.plan().arrivo.map(function (via) {
                        return m("option", via.nome);
                    })),
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

    } else {
        return m("form", {
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

routing.form = function(ctrl){
    return m("div","EVVIVA");
};
