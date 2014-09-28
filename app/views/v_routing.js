routing.view = function (ctrl, ctrl_main) {
    console.log(ctrl.to());
    if (ctrl_main.plan().error) {
        return m("div", [
            m("strong", "Controllare i parametri immessi"),
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
                        m("#form", [routing.form(ctrl_main.plan().partenza, ctrl.from, "Da..."),
                            routing.cities(ctrl.cities(), ctrl.cityStart)
                        ])
                    ]),
                    m("div", {
                        class: "pure-control-group"
                    }, [
                        m("#form", [routing.form(ctrl_main.plan().arrivo, ctrl.to, "A..."),
                            routing.cities(ctrl.cities(), ctrl.cityEnd)
                        ])
                    ]),
                    routing.actions(ctrl_main.reset, ctrl_main.route)
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
                    m("#form", [routing.form([], ctrl.from, "Da..."),
                        routing.cities(ctrl.cities(), ctrl.cityStart),
                    ])
                ]),
                m("div", {
                    class: "pure-control-group"
                }, [
                    m("#form", [routing.form([], ctrl.to, "A..."),
                        routing.cities(ctrl.cities(), ctrl.cityEnd)
                    ])
                ]),
                routing.actions(ctrl_main.reset, ctrl_main.route)
            ]),
        ]);
    }
};

routing.form = function (alternative, luogo, placeholder) {
    //comportamento del form per cercare la via con gestione degli errori
    if (alternative.length === 0) {
        return m("input", {
            required: true,
            autofocus: true,
            onchange: m.withAttr("value", luogo),
            placeholder: placeholder,
            value: luogo()
        });
    } else {
        return m("select", {
            onchange: m.withAttr("value", luogo)
        }, alternative.map(function (via) {
            return m("option", via.nome);
        }));
    }
};

routing.cities = function (citiesList, selectedCity) {
    return m("select", {
        onchange: m.withAttr("value", selectedCity)
    }, citiesList.map(function (city) {
        return city.nome === selectedCity() ? m("option", {
            selected: "selected"
        }, city.nome) : m("option", city.nome);
    }));
};

routing.actions = function (reset, send) {
    return m("div", {
        class: "pure-control-group"
    }, [
        m("input", {
            type: "button",
            class: "pure-button",
            onclick: reset,
            value: "Reset"
        }),
        m("input", {
            type: "submit",
            onclick: send,
            class: "pure-button pure-button-primary",
            value: "Calcola"
        })
    ]);
};
