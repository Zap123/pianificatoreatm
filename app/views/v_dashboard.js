dashboard.view = function (ctrl, plan) {
    console.log(ctrl.tab);
    return m(".container", [
        dashboard.menu(ctrl),
        //Helper selezione tab
        dashboard.choose(ctrl.tab, {
            "News": [dashboard.comunicati, ctrl.news()],
            "Percorso": [dashboard.percorso, plan],
            "Mappa": [dashboard.mappa, plan]
        }),
    ]);
};

dashboard.comunicati = function (comunicati) {
    return m("div", [
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

dashboard.mappa = function (plan) {
    if (plan().mapsImg) {
        return m("div", [m("img", {
            src: plan().mapsImg,
            class: "pure-img"
        })]);
    }
};

dashboard.percorso = function (plan) {
    return (plan().error) ? m("strong", "⚠ Non è stato possibile trovare un percorso") : m("div", {
        'style': {
            'display': 'inline-block',
        }
    }, [
        m("div", {
            'style': {
                'padding': '1em',
                'border': 'dashed'
            }
        }, [
            m("strong", plan().info),
            dashboard.infoTwitter(plan().twitter),
            dashboard.twitter(plan().twitter.news)
        ]),
        m("div", [
            m("table", {
                class: "pure-table"
            }, [
                //Non visualizzare tabella se via non trovata
                m("thead", [
                    m("th", "#"),
                    m("th", "Itinerario sulla rete ATM")
                ]),
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

dashboard.infoTwitter = function (tweetObj) {
    if (tweetObj.weight == 3)
        return m("div", [
            m('div', {
                'style': {
                    'color': '#CC0000'
                }
            }, "Stato: ✖ Critico"),
        ]);
    else if (tweetObj.weight == 2)
        return m("div", [
            m('div', {
                'style': {
                    'color': '#CE5C00'
                }
            }, "Stato: ⧗ Rallentamenti"),
        ]);
    else {
        return m("div", {
            'style': {
                'color': '#204A87'
            }
        }, "Stato: ✔ Non sono stati riscontrati problemi sulle linee");
    }
};


dashboard.twitter = function (tweets) {
    return m("div", {
        'style': {
            'width': '430px',
            'font-family': 'Arial, Helvetica, sans serif'
        }
    }, [
        tweets.map(function (tweet) {
            return m('div', tweet);
        })
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
