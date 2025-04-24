sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (BaseController, Controller, MessageBox, MessageToast) {
    "use strict";

    return BaseController.extend("app.flightdetail.controller.BookingView", {
        onInit: function() {
            let oModel = this.getModel();
            let entity = "/ZACK_SPRINT_TABSet";
            let entity2 = "/xyzzfwd";
            let arr=[]
            oModel.read(entity, {
                success: (odata, resp) => {
                    let oModelJs = this.getModel("FlightModel");
                    oModelJs.setData(odata.results);
                    // console.log(oModelJs.getData())
                },
                error: (error) => {
                    console.error("Error reading data: ", error);
                    // Additional error handling logic
                }
            });
            let oRouter = this.getRouter();
            oRouter.attachRoutePatternMatched(this.onRouteMatched, this);

        },
        onRouteMatched: function (oEvent) {
            this.index = oEvent.getParameter("arguments").indexDetail;
            let sPath = "FlightModel>/" + this.index; // binding to the element to the view
            let oView = this.getView();
            oView.bindElement(sPath);
        },

        onEdit: function () {
            let oRouter = this.getRouter();
            oRouter.navTo("RouteUpdateView", {
                indexUpdate: this.index
            });
        },
        // onEdit: function() {
        //     var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        //     oRouter.navTo("RouteUpdateView");
        // },

        
        onFilter: function (oEvent) {
             var sQuery = oEvent.getParameter("value");
            var oFilter = new sap.ui.model.Filter({
             filters: [
             new sap.ui.model.Filter("Carrid", sap.ui.model.FilterOperator.Contains, sQuery),
             new sap.ui.model.Filter("Connid", sap.ui.model.FilterOperator.Contains, sQuery),
             new sap.ui.model.Filter("Passname", sap.ui.model.FilterOperator.Contains, sQuery),
             new sap.ui.model.Filter("SeatNum", sap.ui.model.FilterOperator.Contains, sQuery)
             ],
             and: false
             });
             var oBinding = this.byId("bookingTable").getBinding("items");
             oBinding.filter(oFilter);
             },
            
        onDelete: function(oEvent) {
            console.log("HELLO")
            let oContext = oEvent.getSource().getBindingContext("FlightModel").getObject();
            MessageBox.warning("Are you sure about deleting this entry?", {
                actions: [MessageBox.Action.OK, MessageBox.Action.NO],
                onClose: (choice) => {
                    if (choice === MessageBox.Action.OK) {
                        this._onDeleteCall(oContext);
                    } else {
                        // No action needed for NO option, it simply cancels the operation
                        MessageToast.show("Delete operation cancelled");
                    }
                }
            });
        },
        _onDeleteCall: function(param) {
            let key1 = param.Carrid;
            let key2 = param.Connid;
            let key3 = param.Bookid;
            let key4 = param.Fldate.replace(/-/g, "");
            let oModel = this.getOwnerComponent().getModel();
            let entity = `/ZACK_SPRINT_TABSet(Carrid='${key1}',Connid='${key2}',Bookid='${key3}',Fldate='${key4}')`;
            oModel.remove(entity, {
                success: (resp) => {
                    MessageBox.success("Entry deleted successfully!");
                },
                error: (error) => {
                    MessageBox.error("Deletion failed");
                }
            });
            oModel.onInit();
        },
        onRowSelection:function(oEvent){
            let oItem=oEvent.getParameter("listItem")
            let oContext=oItem.getBindingContextPath("FlightModel")
            console.log(oContext)
            let aItems=oContext.split("/") //array items
            let index=aItems[aItems.length-1]
            let oRouter=this.getRouter()
            oRouter.navTo("RouteDetailView",{
                indexDetail:index
            })
        }
    });
});





//   sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/m/MessageBox"
// ], function (Controller, MessageBox) {
//     "use strict";

//     return Controller.extend("com.flightbooking.controller.BookingList", {
//         onInit: function () {
//             // Initialize the booking list
//             var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZACK_SPRINT_TAB/");
//             this.getView().setModel(oModel);
//         },

//        

//         onDelete: function (oEvent) {
//             var oItem = oEvent.getSource().getBindingContext().getObject();
//             var that = this;

//             MessageBox.confirm("Delete this booking?", {
//                 onClose: function (oAction) {
//                     if (oAction === MessageBox.Action.OK) {
//                         that.getView().getModel().remove("/BookingSet('" + oItem.BookingId + "')", {
//                             success: function () {
//                                 MessageBox.success("Booking deleted");
//                             },
//                             error: function () {
//                                 MessageBox.error("Deletion failed");
//                             }
//                         });
//                     }
//                 }
//             });
//         },

//         onEdit: function (oEvent) {
//             var oItem = oEvent.getSource().getBindingContext().getObject();
//             var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
//             oRouter.navTo("editBooking", {
//                 bookingId: oItem.BookingId
//             });
//         }
//     });
// });