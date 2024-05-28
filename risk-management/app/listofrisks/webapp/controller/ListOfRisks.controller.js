sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    "sap/ui/core/UIComponent",
    "sap/ui/model/odata/v4/ODataModel"
],
function (Controller, MessageToast, MessageBox, UIComponent, ODataModel) {
    "use strict";

    return Controller.extend("listofrisks.controller.ListOfRisks", {
        onInit: function () {
            //UIComponent.prototype.init.apply(this, arguments);

            var oModel = new ODataModel({
                serviceUrl: "/odata/v4/service/risk/",
                synchronizationMode: "None"
            });

            this.getView().setModel(oModel);
        },
        

        editDescription: async function(oEvent) {
            const oModel = this.getView().getModel();
            const oTable = this.byId('idRisksTable');
            const oSelectedItem = oTable.getSelectedItem();
        
            if (!oSelectedItem) {
                MessageBox.alert("Please select a risk to edit its description.");
                return;
            }
        
            const oSelectedContext = oSelectedItem.getBindingContext();
            const sPath = oSelectedContext.getPath();
            //const oData = oModel.getProperty(sPath);
            
            const oAction = oModel.bindContext(`RiskService.editDescription(...)`, oSelectedContext, {
                '$select': "ID"
            });
            //const oAction = oModel.bindContext(`/ListOfRisks(${oSelectedContext.getObject().ID})/RiskService.editDescription(...))`);

            try {
                await oAction.execute();
                MessageToast.show("Impact doubled successfully");
                oModel.refresh();  // Refresh the model to reflect changes in the UI
            } catch (oError) {
                MessageBox.alert(oError.message, {
                    icon : MessageBox.Icon.ERROR,
                    title : "Error"
                });
            }
        },

        editDescription2: async function(oEvent) {
            const oModel = this.getView().getModel();
            const oTable = this.byId('idRisksTable');
            const oSelectedItem = oTable.getSelectedItem();
            //const oSelectedContext = oEvent.getSource().getBindingContext();
            const oSelectedContext = oSelectedItem.getBindingContext();
            console.log(oSelectedContext)
            const oAction = oModel.bindContext("RiskService.editDescription(...)", oSelectedContext);
 
            oAction.invoke().then(
                function () {
                    MessageToast.show("Invoice created for sales order");
                },
                function (oError) {
                    MessageBox.alert(oError.message, {
                        icon : MessageBox.Icon.ERROR,
                        title : "Error"
                    });
                }
            );
        }
    });
});
