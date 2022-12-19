/**
 * Used in PrmsPaginatorCase and extends PaginatorFilter to assmeble query strings so Case records can be delivered to Provider Relations Management Studio front end.
 * 
 * @see PaginatorFilter
 * @see PrmsPaginatorCase
 * 
 * @author Joel Comfort (March 2022)
 * @author Andrew Frederick (December 2022)
 */
public with sharing class PrmsPaginatorFilterCase extends PaginatorFilter {

/**
 * FIELDS
 */

    private CaseFilter caseFilter {get;set;}

/**
 * CONSTRUCTOR
 */

    public PrmsPaginatorFilterCase( String payloadJSON ) {
        super();

        CasePayload payload = (CasePayload) JSON.deserialize( payloadJSON, CasePayload.class );

        this.filter = payload.generalFilter;

        this.caseFilter = payload.caseFilter;
    }

/**
 * OVERRIDE METHODS
 */

    public override String getWhere() {

        if( caseFilter.emailId == null ){
            throw new PaginatorFilterException('Mass Email Id required to find cases. No Mass Email Id was supplied.');
        }

        return 'WHERE Provider_Relations_Mass_Email__c = \'' + caseFilter.emailId +'\' ';
    }

/**
 * LWC METHODS
 */

    /**
     * Utilizes the CaseFilter class definition to deliver the data shape to the front end. Used in:
     * 
     * <p><ul>
     * <li> LWC PrmsRecordContainerCase.js </li>
     * </ul></p> 
     *
     * @return JSON of new instance of CaseFilter
     */
    @AuraEnabled
    public static string getFilterDefinition(){
        return JSON.serialize( new CaseFilter() );
    }

/**
 * DATA CLASSES
 */

    public class CasePayload extends Payload {
        public CaseFilter caseFilter {get;set;}
    }

    public class CaseFilter {
        public String emailId {get;set;}
    }
}