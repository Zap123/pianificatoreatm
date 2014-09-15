dashboard.view = function (ctrl) {
    switch (ctrl.tab()) {
        //Comunicati
    case 1:
        return m("table", {
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
        ]);
        //Percorsi
    case 2:
        return m("div", [
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
