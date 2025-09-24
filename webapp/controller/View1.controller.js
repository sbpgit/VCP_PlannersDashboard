sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function (Controller, MessageBox) {
    "use strict";
    var that;

    return Controller.extend("vcp.vcplanner.controller.View1", {
        onInit: function () {
            that = this;
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/getfactorylocdesc", {
                success: function (oData) {
                    var oJSON = new sap.ui.model.json.JSONModel(oData);
                    that.byId("LocationSelect").setModel(oJSON, "locModel");
                    that.byId("productSelect").setModel(oJSON, "locModel");
                    // these lines don't do anything currently but kept as placeholders:
                    that.byId("idver");
                    that.byId("idser");
                    that.loadForecastCard();
                },
                error: function (oError) {
                    console.error("Read failed:", oError);
                }
            });
        },

        loadForecastCard: function () {
            var oModel = this.getOwnerComponent().getModel();
            var that = this;

            oModel.read("/getForecastSnapshotLag", {
                success: function (oData) {
                    console.log("Forecast data loaded:", oData);

                    // Ensure we have data
                    if (!oData || !oData.results || oData.results.length === 0) {
                        return;
                    }

                    // Transform data for bar chart - aggregate lag values by period
                    var chartData = [];
                    var periodMap = {};

                    // Group data by period and calculate averages for each lag
                    oData.results.forEach(function (item) {
                        var period = item.YEAR_MONTH;
                        if (!periodMap[period]) {
                            periodMap[period] = {
                                period: period,
                                lag1Values: [],
                                lag2Values: [],
                                lag3Values: [],
                                lag4Values: [],
                                lag5Values: []
                            };
                        }

                        if (item.LAG1_CIR !== null && item.LAG1_CIR !== undefined) {
                            periodMap[period].lag1Values.push(parseFloat(item.LAG1_CIR));
                        }
                        if (item.LAG2_CIR !== null && item.LAG2_CIR !== undefined) {
                            periodMap[period].lag2Values.push(parseFloat(item.LAG2_CIR));
                        }
                        if (item.LAG3_CIR !== null && item.LAG3_CIR !== undefined) {
                            periodMap[period].lag3Values.push(parseFloat(item.LAG3_CIR));
                        }
                        if (item.LAG4_CIR !== null && item.LAG4_CIR !== undefined) {
                            periodMap[period].lag4Values.push(parseFloat(item.LAG4_CIR));
                        }
                        if (item.LAG5_CIR !== null && item.LAG5_CIR !== undefined) {
                            periodMap[period].lag5Values.push(parseFloat(item.LAG5_CIR));
                        }
                    });

                    // Calculate averages and create chart data
                    Object.keys(periodMap).sort().forEach(function (period) {
                        var data = periodMap[period];
                        var chartItem = {
                            period: period,
                            lag1: data.lag1Values.length > 0 ?
                                data.lag1Values.reduce((a, b) => a + b, 0) / data.lag1Values.length : 0,
                            lag2: data.lag2Values.length > 0 ?
                                data.lag2Values.reduce((a, b) => a + b, 0) / data.lag2Values.length : 0,
                            lag3: data.lag3Values.length > 0 ?
                                data.lag3Values.reduce((a, b) => a + b, 0) / data.lag3Values.length : 0,
                            lag4: data.lag4Values.length > 0 ?
                                data.lag4Values.reduce((a, b) => a + b, 0) / data.lag4Values.length : 0,
                            lag5: data.lag5Values.length > 0 ?
                                data.lag5Values.reduce((a, b) => a + b, 0) / data.lag5Values.length : 0
                        };
                        chartData.push(chartItem);
                    });

                    var oForecastManifest = {
                        "sap.app": {
                            "id": "vcp.v4card.forecast",
                            "type": "card",
                            "applicationVersion": { "version": "1.0.0" }
                        },
                        "sap.ui": {
                            "technology": "UI5",
                            "deviceTypes": { "desktop": true, "tablet": true, "phone": true }
                        },
                        "sap.card": {
                            "type": "Analytical",
                            "data": { "json": chartData },
                            "header": {
                                "type": "Numeric",
                                "title": "Forecast Snapshot Lag Analysis",
                                "subTitle": "Comparison across lag periods",
                                "mainIndicator": {
                                    "number": chartData.length,
                                    "unit": "Periods",
                                    "trend": "Up",
                                    "state": "Good"
                                },
                                "sideIndicators": [
                                    { "title": "Total Records", "number": oData.results.length, "unit": "Records" },
                                    { "title": "Unique Periods", "number": chartData.length, "unit": "Months" }
                                ]
                            },
                            "content": {
                                "chartType": "column",
                                "title": { "text": "Forecast Lag Comparison by Period" },
                                "legend": { "visible": true },
                                "data": { "path": "/" },
                                "dimensions": [
                                    { "label": "Period", "value": "{period}" }
                                ],
                                "measures": [
                                    { "label": "Lag 1", "value": "{lag1}" },
                                    { "label": "Lag 2", "value": "{lag2}" },
                                    { "label": "Lag 3", "value": "{lag3}" },
                                    { "label": "Lag 4", "value": "{lag4}" },
                                    { "label": "Lag 5", "value": "{lag5}" }
                                ],
                                "feeds": [
                                    { "uid": "categoryAxis", "type": "Dimension", "values": ["Period"] },
                                    { "uid": "valueAxis", "type": "Measure", "values": ["Lag 1", "Lag 2", "Lag 3", "Lag 4", "Lag 5"] }
                                ]
                            }
                        }
                    };

                    // Set manifest to the card
                    var oCard = that.byId("MyCardId2");
                    if (oCard) {
                oCard.setManifest(oForecastManifest);
                console.log("Forecast analytical card manifest set successfully");
            } else {
                console.error("Forecast card not found");
            }
                },
                error: function (oError) {
                    console.error("Read failed for forecast:", oError);
                    MessageBox.error("Failed to load forecast data: " + oError.message);
                }
            });
        },
    });
});
