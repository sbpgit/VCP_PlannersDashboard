sap.ui.define([
    "sap/ui/core/mvc/Controller"
  
], function (Controller) {
    "use strict";
    var that;

    return Controller.extend("vcp.vcplanner.controller.View1", {
        onInit: function () {
            that=this;
          
            var oModel = this.getOwnerComponent().getModel();
    oModel.read("/getfactorylocdesc", {
        success: function (oData) {
            var oJSON = new sap.ui.model.json.JSONModel(oData);
            that.byId("LocationSelect").setModel(oJSON, "locModel");
            that.byId("productSelect").setModel(oJSON, "locModel");
            that.byId("idver");
              that.byId("idser");
        },
        error: function (oError) {
            console.error("Read failed:", oError);
        }
    });
           
    

        },
    card:function(){
        var oCard = that.byId("MyCardId");
        oCard.setManifest("/cardapi/vcp.v4card/manifest.json");
        },
        onHelpPress: function () {
    sap.m.MessageBox.information(
        "This page shows KPIs. Use the cards to track Sales & Profit. Click on a card for details."
    );
}

       
    });
});
