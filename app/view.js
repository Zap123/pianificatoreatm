//TODO: CSS Bootstrap o altro
//TODO: Maiuscoletto
planner.view = function(ctrl) {
    return m("html", [
	m("link", {rel:"stylesheet", href:"style.css"}),
        m("title", "PianificatoreATM"),
        m("body", [
            m("div", {class:"pure-menu pure-menu-open pure-menu-horizontal"}, [
	      m("h1", "PianificatoreATM")
	    ]),            
		m("form",{class:"pure-form", action:"#"},[
                m("fieldset", [
		m("div",[
                m("input", {
                        required: true,
                        autofocus: true,
                        onchange: m.withAttr("value", ctrl.from),
			placeholder:"Da...",
                        value: ctrl.from()
                    }),
                    m("select", {onchange:m.withAttr("value", ctrl.cityStart)}, ctrl.cities().map(function(city) {
                        return city.nome === "milano" ? m("option", {
                            selected: "selected"
                        }, city.nome) : m("option", city.nome);
                    })),
		 ]),
		  m("div",[
                    m("input", {
                        required: true,
                        onchange: m.withAttr("value", ctrl.to),
                        value: ctrl.to(),
			placeholder:"A..."
                    }),
                    m("select", {onchange:m.withAttr("value", ctrl.cityEnd)}, ctrl.cities().map(function(city) {
                        return city.nome === "milano" ? m("option", {
                            selected: "selected"
                        }, city.nome) : m("option", city.nome);
                    }))
		    ]),
                ]),
                m("label", {for:"tutti-mezzi", class:"pure-radio"}, [
                    m("input[type=radio]", {
                        value: 1,
			id: "tutti-mezzi",
                        checked: "checked"
                    }),
		    " Tutti i mezzi"
                ]),
                m("input", {
                    type: "submit",
                    onclick: ctrl.route,
		    class:"pure-button pure-button-primary",
                    value: "Calcola"
                }),
		]),
                m("div",[
                  m("strong",{class:"font-bold block"},[
                      ctrl.plan().info
                  ]), 
                  m("ol",[
                      ctrl.plan().steps.map(function(step){
                          var ret = [];
			  var i = 0;
                          for (var literal in step) {
			    if(i == 0) {
			           ret.push(m("li", [ 
				      literal + " " + step[literal]
			      ]));
			    }
			    else {
			      ret.push(m("div", [ 
				      literal + " " + step[literal]
			      ]));
			    }
			    i++;
                          }
                          return ret;
                      })
                  ])
                ]),
            ])
        ])
};

