
using {riskmanagement as rm} from '../db/schema';

@path: 'service/risk'
service RiskService {
    @cds.redirection.target:true
    entity Risks       as projection on rm.Risks;
    annotate Risks with @odata.draft.enabled;

    entity Mitigations as projection on rm.Mitigations;
    annotate Mitigations with @odata.draft.enabled;

    entity ListOfRisks as select from rm.Risks {
        ID, title, owner
    } actions {
        action editDescription(ID: UUID) returns ListOfRisks
    }
    // annotate ListOfRisks actions {
    //     editDescription;
    // };
    // annotate ListOfRisks with actions { 
    //     //action editDescription() 
    //     editDescription @Core.OperationAvailable: true;
    // };

    //action editDescription(ID : UUID) returns ListOfRisks;

    // BusinessPartner will be used later
    //@readonly entity BusinessPartners as projection on rm.BusinessPartners;
}