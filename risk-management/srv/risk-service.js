
// Import the cds facade object (https://cap.cloud.sap/docs/node.js/cds-facade)
const cds = require('@sap/cds')

// The service implementation with all service handlers
module.exports = cds.service.impl(async function() {

    // Define constants for the Risk and BusinessPartner entities from the risk-service.cds file
    const { Risks, BusinessPartners, ListOfRisks } = this.entities;

    // This handler will be executed directly AFTER a READ operation on RISKS
    // With this we can loop through the received data set and manipulate the single risk entries
    this.after("READ", Risks, (data) => {
        // Convert to array, if it's only a single risk, so that the code won't break here
        const risks = Array.isArray(data) ? data : [data];

        // Looping through the array of risks to set the virtual field 'criticality' that you defined in the schema
        risks.forEach((risk) => {
            if( risk.impact >= 100000) {
                risk.criticality = 1;
            } else {
                risk.criticality = 2;
            }

            // set criticality for priority
            switch (risk.prio_code) {
                case 'H':
                    risk.PrioCriticality = 1;
                    break;
                case 'M':
                    risk.PrioCriticality = 2;
                    break;
                case 'L':
                    risk.PrioCriticality = 3;
                    break;
                default:
                    break;
            }
        })
    })

    this.on('editDescription', async (req) => {
        //const { ID } = req.data;
        const ID = "20466922-7d57-4e76-b14c-e53fd97dcb11"
        console.log("req is "+ req)
    
        try {
            // Получение текущего значения impact
            const risk = await SELECT.one.from(ListOfRisks).where({ ID });
            console.log(risk)
            console.log(ID)
            // if (!risk) {
            //     return req.error(404, 'Risk not found');
            // }
    
            // Удвоение значения impact
            const newImpact = risk.title + " " + risk.title;
    
            // Обновление сущности
            await UPDATE(ListOfRisks).set({ title: newImpact }).where({ ID });
    
            // Возвращение обновленного объекта
            const updatedRisk = await SELECT.one.from(ListOfRisks).where({ ID });
            return updatedRisk;
        } catch (error) {
            console.error(error);
            return req.error(500, 'An error occurred while updating the risk');
        }
    });
  });