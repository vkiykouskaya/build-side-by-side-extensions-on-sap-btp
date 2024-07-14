
using {riskmanagement as rm} from '../db/schema';

@path: 'service/risk'
service RiskService @(requires: 'authenticated-user') {
    @cds.redirection.target:true
    entity Risks @(restrict: [
        {
            grant: 'READ',
            to   : 'RiskViewer'
        },
        {
            grant: [
                'READ',
                'WRITE',
                'UPDATE',
                'UPSERT',
                'DELETE'
            ], // Allowing CDS events by explicitly mentioning them
            to   : 'RiskManager'
        }
    ])                      as projection on rm.Risks;

    annotate Risks with @odata.draft.enabled;

    entity Mitigations @(restrict: [
        {
            grant: 'READ',
            to   : 'RiskViewer'
        },
        {
            grant: '*', // Allow everything using wildcard
            to   : 'RiskManager'
        }
    ])                      as projection on rm.Mitigations;

    annotate Mitigations with @odata.draft.enabled;

    entity ListOfRisks as select from rm.Risks {
        ID, title, owner
    } actions {
        action editTitle(ID: UUID, newTitle: String)
    }
    // BusinessPartner
    @readonly
    entity BusinessPartners as projection on rm.BusinessPartners;
}