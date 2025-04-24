sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox"
], (BaseController, MessageBox) => {
    "use strict";

    return BaseController.extend("app.flightdetail.controller.UpdateView", {
        onInit() {
            let oRouter = this.getRouter();
            oRouter.attachRoutePatternMatched(this._RouteMatched, this);
        },
        _RouteMatched: function (oEvent) {
            let index = oEvent.getParameter("arguments").indexUpdate;
            let sPath = "FlightModel>/" + index;
            let oView = this.getView();
            oView.bindElement(sPath);
            this.indexDetail = index; // Store the index for later use
        },

        onUpdate: function () {
            // Payload
            var oCarrid = this.getView().byId("CarridInput");
            var oConnid = this.getView().byId("ConnidInput");
            var oFldate = this.getView().byId("FldateInput");
            var oBookid = this.getView().byId("BookidInput");
            var oOdate = this.getView().byId("OrderDateInput");
            var oPassname = this.getView().byId("PassnameInput");
            var oArrAirport = this.getView().byId("ArrAirportInput");
            var oDeptAirport = this.getView().byId("DeptAirportInput");
            var oCustomid = this.getView().byId("CustomidInput");
            var oSeatNum = this.getView().byId("SeatNumInput");

            // Get values
            let sCarrid = oCarrid.getValue();
            sCarrid = sCarrid.toUpperCase();
            let sConnid = oConnid.getValue();
            var sFldate = oFldate.getValue();
            let sBookid = oBookid.getValue();
            var sOdate = oOdate.getValue();
            var sPassname = oPassname.getValue();
            var sArrAirport = oArrAirport.getValue();
            var sDeptAirport = oDeptAirport.getValue();
            var sCustomid = oCustomid.getValue();
            var sSeatNum = oSeatNum.getValue();

            let payload = {
                Carrid: sCarrid,
                Connid: sConnid,
                Fldate: sFldate,
                Bookid: sBookid,
                OrderDate: sOdate,
                Passname: sPassname,
                ArrAirport: sArrAirport,
                DeptAirport: sDeptAirport,
                Customid: sCustomid,
                SeatNum: sSeatNum.toString()
            };

            let oModel = this.getModel();
            let entity = `/ZACK_SPRINT_TABSet(Carrid='${sCarrid}',Connid='${sConnid}',Fldate='${sFldate.replace(/-/g, "")}',Bookid='${sBookid}')`;
            let that = this;
            oModel.update(entity, payload, {
                success: function (resp) {
                    MessageBox.success("Record updated", {
                        onClose: function () {
                            let oRouter = that.getRouter();
                            oRouter.navTo("RouteDetailView", {
                                indexDetail: that.indexDetail // Pass the stored indexDetail parameter
                            });
                        }
                    });
                },
                error: function (error) {
                    MessageBox.error("Record updation failed");
                }
            });
        }
    });
});
