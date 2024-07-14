sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/model/json/JSONModel"
],
function (Controller, MessageToast, MessageBox, ODataModel, JSONModel) {
    "use strict";

    return Controller.extend("listofrisks.controller.ListOfRisks", {
        onInit: function () {
            var oModel = new ODataModel({
                serviceUrl: "/odata/v4/service/risk/",
                synchronizationMode: "None"
            });

            let oAppViewModel = new JSONModel({
                newTitle: "",
                selectedRiskId: "",
                editBtnEnabled: false
            }, "appView");

            this.getView().setModel(oModel);
            this.getView().setModel(oAppViewModel, "appView");
        },

        onTableSelectionChange: function () {
            this.getView().getModel("appView").setProperty("/editBtnEnabled", true);
        },
        
        onEditBtnPress: function(){
            let oView = this.getView();
            const oTable = this.byId('idRisksTable');
            const oSelectedItem = oTable.getSelectedItem();
            const oSelectedContext = oSelectedItem.getBindingContext();
            const iId = oSelectedContext.getObject().ID;
            oView.getModel("appView").setProperty("/selectedRiskId", iId);

            if (!this.oDialog) {
                this.oDialog = sap.ui.xmlfragment(oView.getId(), "listofrisks.view.fragments.EditTitle", this);
                oView.addDependent(this.oDialog);
            }

            this.oDialog.open();
        },

        onSaveBtnPress: async function(oEvent) {
            const oModel = this.getView().getModel();
            const oTable = this.byId('idRisksTable');
            const oSelectedItem = oTable.getSelectedItem();
        
            const oSelectedContext = oSelectedItem.getBindingContext();
            const iId = this.getView().getModel("appView").getProperty("/selectedRiskId");
            const newTitle = this.getView().getModel("appView").getProperty("/newTitle");
            
            const oAction = oModel.bindContext(`RiskService.editTitle(...)`, oSelectedContext);
            oAction.setParameter("ID", iId);
            oAction.setParameter("newTitle", newTitle);

            try {
                await oAction.execute();
                MessageToast.show("Title edited successfully!");
                oModel.refresh();
                this.oDialog.close();
            } catch (oError) {
                MessageBox.alert(oError.message, {
                    icon : MessageBox.Icon.ERROR,
                    title : "Error"
                });
            }
            this.getView().getModel("appView").setProperty("/newTitle", "");
        },

        onCloseEditDialogPress: function () {
            this.oDialog.close();
            this.getView().getModel("appView").setProperty("/newTitle", "");
        }
    });
});
