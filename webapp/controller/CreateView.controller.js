sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (BaseController, Controller, MessageBox, MessageToast, JSONModel) {
    "use strict";

    return BaseController.extend("app.flightdetail.controller.CreateBooking", {
        onInit: function() {
            // Initialize Cities data
            let oCitiesModel = new JSONModel({
                Cities: [
                    { CityCode: "JFK", CityName: "John F. Kennedy International Airport" },
                    { CityCode: "LHR", CityName: "London Heathrow Airport" },
                    { CityCode: "CDG", CityName: "Charles de Gaulle Airport" },
                    { CityCode: "LAX", CityName: "Los Angeles International Airport" },
                    { CityCode: "DFW", CityName: "Dallas/Fort Worth International Airport" },
                    { CityCode: "ORD", CityName: "O'Hare International Airport" },
                    { CityCode: "ATL", CityName: "Hartsfield-Jackson Atlanta International Airport" },
                    { CityCode: "SFO", CityName: "San Francisco International Airport" },
                    { CityCode: "SEA", CityName: "Seattle-Tacoma International Airport" },
                    { CityCode: "MIA", CityName: "Miami International Airport" }
                ],
                Flights: [
                    { Carrid: "BA", Connid: "1002", Fldate: "2025-04-23", ArrAirport: "JFK", DeptAirport: "LHR" },
                    { Carrid: "CA", Connid: "002", Fldate: "2025-04-24", ArrAirport: "LHR", DeptAirport: "CDG" },
                    { Carrid: "AF", Connid: "003", Fldate: "2025-04-25", ArrAirport: "CDG", DeptAirport: "LAX" },
                    // Add more flight data as needed
                ]
            });
            this.getView().setModel(oCitiesModel);

            // Initialize FlightModel
            let oModel = this.getModel();
            let entity = "/ZACK_SPRINT_TABSet";
            oModel.read(entity, {
                success: (odata, resp) => {
                    let oModelJs = this.getModel("FlightModel");
                    oModelJs.setData(odata.results);
                },
                error: (error) => {
                    console.error("Error reading data: ", error);
                }
            });
        },
        onSubmitBooking: function() {
            let oModel = this.getView().getModel("FlightModel");
            let flightInput = this.byId("flightInput").getValue();
            let [Carrid, Connid] = flightInput.split("-");
            
let flightDate = this.byId("flightDate").getValue(); // Assuming flightDate is in 'DD-MM-YYYY'

// Split the date into parts
let [day, month, year] = flightDate.split("-");

// Rearrange to 'YYYYMMDD'
let flightDateFormatted = year + month + day;

console.log("Formatted Flight Date:", flightDateFormatted); // Should output '20250423'


            // Automatically assign the current date to OrderDate
            let currentDate = new Date().toISOString().split('T')[0].replace(/-/g, "");
        
            let newBooking = {
                Carrid: Carrid.trim(),
                Connid: Connid.trim(),
                Fldate: flightDateFormatted, // Use formatted date
                Bookid: this._generateRandomID(8),
                Customid: this._generateRandomID(8),
                Passname: this.byId("passengerName").getValue(),
                SeatNum: "", // Placeholder for seat number
                ArrAirport: this.byId("fromCity").getSelectedKey(),
                DeptAirport: this.byId("toCity").getSelectedKey(),
                OrderDate: currentDate
            };
        
            // Debugging: Log selected values
            console.log("Entered Carrid:", newBooking.Carrid);
            console.log("Entered Connid:", newBooking.Connid);
            console.log("Entered Flight Date:", newBooking.Fldate);
            console.log("Assigned Booking Date:", newBooking.OrderDate);
        
            // Check seat availability
            let oSeatsModel = this.getModel();
            let entity = "/ZACK_FOR_SEATSSet";
            oSeatsModel.read(entity, {
                success: (odata, resp) => {
                    let seatData = odata.results.find(seat => {
                        let seatDateFormatted = seat.Fldate.replace(/-/g, ""); // Format seat.Fldate to 'YYYYMMDD'
                        return seat.Carrid === newBooking.Carrid && 
                               seat.Connid === newBooking.Connid && 
                               seatDateFormatted === newBooking.Fldate;
                    });
                    
                    console.log("Seat Data:", seatData);
                    
                    if (seatData && seatData.Seatsocc < seatData.Seatsmax) {
                        // Generate a random seat number
                        newBooking.SeatNum = this._generateRandomSeat();
                        console.log("Generated Seat Number:", newBooking.SeatNum);
                        this.byId("selectedSeat").setText(newBooking.SeatNum);
        
                        // Update seat count
                        seatData.Seatsocc += 1;
                        let updateUri = `/ZACK_FOR_SEATSSet(Carrid='${seatData.Carrid}',Connid='${seatData.Connid}',Fldate='${seatData.Fldate.replace(/-/g, "")}')`;
                        console.log("Update URI:", updateUri);
                        console.log("Seat Data for Update:", seatData);
                        oSeatsModel.update(updateUri, seatData, {
                            success: () => {
                                console.log("Seat count updated successfully.");
/*--------------------------------------------------SEAT IS GETTING UPDATED----------------------------------------------------------------------------------------------------------*/ 
                                // Proceed with booking
                                // flightDateFormatted = year + "-" + month + "-" + day;
                                currentDate= currentDate = new Date().toISOString().split('T')[0]
                                let payload = {
                                    Carrid: newBooking.Carrid,
                                    Connid: newBooking.Connid,
                                    Fldate: seatData.Fldate, // Use formatted date
                                    Bookid: newBooking.Bookid,
                                    Customid: newBooking.Customid,
                                    Passname: newBooking.Passname,
                                    SeatNum: newBooking.SeatNum.toString(), // Placeholder for seat number
                                    ArrAirport: newBooking.ArrAirport,
                                    DeptAirport: newBooking.DeptAirport,
                                    OrderDate: currentDate
                                };
                                let sortedPayload= this._getPayload(payload.ArrAirport, payload.Bookid, payload.Carrid, payload.Connid, payload.Customid, payload.DeptAirport, payload.Fldate, payload.OrderDate, payload.Passname, payload.SeatNum)
                                console.log(sortedPayload)
                                oModel= this.getModel()
                                // let existingBookings = oModel.getData();
                                // existingBookings.push(payload);
                                // oModel.setData(existingBookings);
                                // console.log(odata.results) //TILL HERE WORKING FINE ✅
                                // Push new booking to ZACK_SPRINT_TABSet
                                oModel.create("/ZACK_SPRINT_TABSet", sortedPayload, {
                                    success: () => {
                                        MessageBox.success("Booking created successfully!");
                                                
                                    },
                                    error: (error) => {
                                        MessageBox.error("Error creating booking: " + error.message);
                                    }
                                });
                            },
                            error: (error) => {
                                console.error("Error updating seat count:", error);
                                MessageBox.error("Error updating seat count: " + error.message);
                            }
                        });
        
                    } else {
                        MessageBox.error("No seats available for this route.");
                    }
                },
                error: (error) => {
                    console.error("Error reading seat data:", error);
                    MessageBox.error("Error reading seat data: " + error.message);
                }
            });
        }
        
        
        ,
        
        _generateRandomID: function(length) {
            let result = '';
            const characters = '0123456789';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        },
        _generateRandomSeat: function() {
            // const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
            const row = Math.floor(Math.random() * 3);
            const seatNumber = Math.floor(Math.random() * 30) + 1; // Assuming 30 rows
            return (seatNumber + row)
        },
        _getPayload: function(arrAirport, bookid, carrid, connid, customid, deptAirport, fldate, orderDate, passname, seatNum){
    return {
    Carrid: carrid,
     Connid: connid,
     Fldate: fldate, // Use formatted date
     Bookid: bookid,
     Customid: customid,
     Passname: passname,
     SeatNum: seatNum, // Placeholder for seat number
     ArrAirport: arrAirport,
     DeptAirport: deptAirport,
     OrderDate: orderDate
    };
    }
    
        
    });
});
