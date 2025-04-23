sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("app.flightdetail.controller.MasterView", {
        onInit() {
        },
        onFindFlightsPress: function(){
            let oRouter=this.getRouter()
            oRouter.navTo("RouteCreateView");
        },
        onPreviousBookingsPress: function(){
            let oRouter=this.getRouter()
            oRouter.navTo("RouteBookingView");
        }
    });
});