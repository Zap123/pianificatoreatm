dashboard.view = function (ctrl) {
    switch (ctrl.tab()) {
        //Comunicati
    case 1:
        return m("div", [
            m("#menu_dash", [dashboard.menu_dash(ctrl)]),
            m("table", {
                class: "pure-table"
            }, [
                m("thead", [
                    m("tr", [
                        m("th", ""),
                        m("th", "Comunicati")
                    ])
                ]),
                ctrl.news().map(function (news) {
                    return m("tr", [
                        m("td", [m("a", {
                            href: news.url
                        }, "🔗 ")]),
                        m("td", news.testo)
                    ]);
                })
            ])
        ]);
        //Percorsi
    case 2:
        return m("div", [
            m("#menu_dash", [dashboard.menu_dash(ctrl)]),
            m("strong", {
                class: "font-bold block"
            }, [
                ctrl.plan().info
            ]),
            m("div", [
                m("table", {
                    class: "pure-table"
                }, [
                    m("thead", [
                        m("th", "#"),
                        m("th", "Itinerario sulla rete ATM")
                    ]),
                    ctrl.plan().steps.map(function (step, i) {
                        var j = 0,
                            ret = [];
                        for (var literal in step) {
                            if (j === 0) {
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
                            j++;
                        }
                        return ret;
                    })
                ]),
            ]),
        ]);
    }
};

dashboard.menu_dash = function (ctrl) {
    switch (ctrl.tab()) {
    case 1:
        return m("div", {
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
        ]);
    case 2:
        return m("div", {
            class: "pure-menu pure-menu-open pure-menu-horizontal"
        }, [
            m("ul", [
                m("li", {
                    class: "pure-menu"
                }, [
                    m("a", {
                        href: "#",
                        onclick: function(){ctrl.setTab(1);}
                    }, "News"),
                ]),
                m("li", {
                    class: "pure-menu-selected"
                }, [
                    m("a", {
                        href: "#"
                    }, "Percorso"),
                ]),
                m("li", {
                    class: "pure-menu"
                }, [
                    m("a", {
                        href: "#"
                    }, "Mappa"),
                ]),
            ])
        ]);
    }
};
