sap.ui.define([
    "sap/ui/core/mvc/Controller"

], function (Controller) {
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
                    that.byId("idver");
                    that.byId("idser");
                    that.loadForecastCard();
                },
                error: function (oError) {
                    console.error("Read failed:", oError);
                },

            });

        },

        loadForecastCard: function () {
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/getForecastSnapshotLag", {
                success: function (oData) {
                    console.log("Forecast data loaded:", oData);

                    // Ensure we have data
                    if (!oData || !oData.results || oData.results.length === 0) {
                        return;
                    }

                    var oForecastManifest = {
                        "sap.app": {
                            "id": "vcp.v4card.forecast",
                            "type": "card",
                            "applicationVersion": {
                                "version": "1.0.0"
                            }
                        },
                        "sap.ui": {
                            "technology": "UI5",
                            "deviceTypes": {
                                "desktop": true,
                                "phone": true,
                                "tablet": true
                            }
                        },
                        "sap.card": {
                            "type": "Table",
                            "configuration": {
                                "parameters": {
                                    "entityType": {
                                        "value": "Forecast",
                                        "type": "string",
                                        "label": "Data Type",
                                        "allowedValues": [
                                            { "key": "forecast", "name": "Forecast" },
                                            { "key": "assembly", "name": "Assembly" }
                                        ]
                                    }
                                }
                            },
                            "data": {
                                "json": oData.results
                            },
                            "header": {
                                "title": "Forecast Snapshot Lag",
                                "subTitle": "Real-time forecast lag analysis",
                                "icon": {
                                    "src": "sap-icon://table-view"
                                },
                                "status": {
                                    "text": oData.results.length + " records",
                                    "state": "Success"
                                },
                                "actions": [
                                    {
                                        "type": "Custom",
                                        "text": "Switch Data Type",
                                        "icon": "sap-icon://switch-views",
                                        "press": "onSwitchDataType"
                                    }
                                ]
                            },

                            "content": {
                                "data": {
                                    "path": "/"
                                },
                                "row": {
                                    "columns": [
                                        {
                                            "title": "Location",
                                            "value": "{LOCATION_ID}"
                                        },
                                        {
                                            "title": "Product",
                                            "value": "{PRODUCT_ID}"
                                        },
                                        {
                                            "title": "Unique ID",
                                            "value": "{UNIQUE_ID}"
                                        },
                                        {
                                            "title": "Period",
                                            "value": "{YEAR_MONTH}"
                                        },
                                        {
                                            "title": "Lag1",
                                            "value": "{LAG1_CIR}"
                                        },
                                        {
                                            "title": "Lag2",
                                            "value": "{LAG2_CIR}"
                                        },
                                        {
                                            "title": "Lag3",
                                            "value": "{LAG3_CIR}"
                                        },
                                        {
                                            "title": "Lag4",
                                            "value": "{LAG4_CIR}"
                                        },
                                        {
                                            "title": "Lag5",
                                            "value": "{LAG5_CIR}"
                                        }
                                    ]
                                },
                                "maxItems": 100
                            }
                        }
                    };

                    // Set manifest to the card
                    var oCard = that.byId("MyCardId2");
                    if (oCard) {
                        oCard.setManifest(oForecastManifest);
                        console.log("Forecast card manifest set successfully");
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
        onSwitchDataType:function(oEvent){
            var event = oEvent;
        }
    });
});
