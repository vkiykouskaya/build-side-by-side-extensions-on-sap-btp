
using {riskmanagement as rm} from '../db/schema';

@path: 'service/risk'
service ListOfRisksService {
    @readonly entity ListOfRisks as select from rm.Risks {
        ID, title, owner
    };
}