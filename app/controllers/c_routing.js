routing.controller = function () {
    this.from = m.prop("");
    this.cityStart = m.prop("milano");
    this.to = m.prop("");
    this.cityEnd = m.prop("milano");
    this.cities = routing.CitiesList();
};
