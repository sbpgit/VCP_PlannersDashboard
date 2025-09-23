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
        },
      
    });
         var oCardHost = this.byId("MyCardId2");
          oCardHost.attachEvent("_ready", function () {
        var oInnerCard = oCardHost.getCard();

        if (oInnerCard) {
           
            oInnerCard.setParameters({});

            
            if (oInnerCard.reload) {
                oInnerCard.reload();
            }
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
},
// _updateCardParameters: function () {
//     var oCardHost = this.byId("MyCardId2");
//     var oInnerCard = oCardHost.getCard();

//     var sLocation = this.byId("LocationSelect").getSelectedKey();
//     var sProduct  = this.byId("productSelect").getSelectedKey();
//     var sVersion  = this.byId("idver").getSelectedKey();
//     var sScenario = this.byId("idser").getSelectedKey();

//     if (oInnerCard) {
//         oInnerCard.setParameters({
//             location: sLocation,
//             product: sProduct,
//             version: sVersion,
//             scenario: sScenario
//         });
//     }
// }



       
    });
});
