dashboard.view = function (ctrl, plan) {
    console.log(ctrl.tab);
    return (".container", [
        dashboard.menu(ctrl),
        //Helper selezione tab
        dashboard.choose(ctrl.tab, {
            "News": [dashboard.comunicati, ctrl.news()],
            "Percorso": [dashboard.percorso, plan]
        }),
    ]);
};

dashboard.comunicati = function (comunicati) {
    return ("div", [
        m("table", {
            class: "pure-table"
        }, [
            m("thead", [
                m("tr", [
                    m("th", ""),
                    m("th", "comunicati")
                ])
            ]),
            comunicati.map(function (news) {
                return m("tr", [
                    m("td", [m("a", {
                        href: news.url
                    }, "🔗 ")]),
                    m("td", news.testo)
                ]);
            })
        ])
    ]);
};

dashboard.percorso = function (plan) {
    return ("div", [
        m("strong", {
            class: "font-bold block"
        }, [
            plan().info
        ]),
        m("div", [
            m("table", {
                class: "pure-table"
            }, [
                //Non visualizzare tabella se via non trovata
                (!plan().error) ? m("thead", [
                    m("th", "#"),
                    m("th", "Itinerario sulla rete ATM")
                ]) : "",
                plan().steps.map(function (step, i) {
                    var j = 0,
                        ret = [];
                    for (var literal in step) {
                        if (j === 0) {
                            j++;
                            ret.push(m("tr", {
                                class: "pure-table-odd"
                            }, [
                                m("td", i + 1),
                                m("td", [
                                    literal + " " + step[literal]
                                ])
                            ]));
                        } else {
                            var content;
                            switch (literal) {
                            case 'pdf':
                                content = m("a", {
                                    target: '_blank',
                                    href: step[literal]
                                }, "orari (pdf)");
                                break;
                            case 'infoTraffico':
                                content = m("a", {
                                    target: '_blank',
                                    href: step[literal]
                                }, "⚠");
                                break;
                            default:
                                content = literal + " " + step[literal];
                            }
                            ret.push(m("tr", [
                                m("td", ""),
                                m("td", [
                                    content
                                ])
                            ]));

                        }
                    }
                    return ret;
                })
            ]),
        ]),
    ]);
};

dashboard.menu = function (ctrl) {
    return m("div", {
        class: "pure-menu pure-menu-open pure-menu-horizontal"
    }, [
        m("ul", [
            dashboard.tab(ctrl, "News"),
            dashboard.tab(ctrl, "Percorso"),
            dashboard.tab(ctrl, "Mappa")
        ])
    ]);
};

dashboard.tab = function (ctrl, name) {
    return m("li", {
        class: ctrl.tab === name ? "pure-menu-selected" : ""
    }, [
        m("a", {
            onclick: function () {
                if (ctrl.ready()) {
                    ctrl.setTab(name);
                }
            }
        }, name)
    ]);
};

dashboard.choose = function (key, options) {
    var option = options[key];
    return option[0](option[1]);
};
