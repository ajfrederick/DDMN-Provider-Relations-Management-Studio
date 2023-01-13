/**
 * Used in PrmsPaginatorContact and extends PaginatorFilter to assmeble query strings so Contact records can be delivered to Provider Relations Management Studio front end.
 * 
 * @see PaginatorFilter
 * @see PrmsPaginatorContact
 * 
 * @author Joel Comfort (March 2022)
 * @author Andrew Frederick (December 2022)
 */
public with sharing class PrmsPaginatorFilterContact extends PaginatorFilter {

/**
 * FIELDS
 */

    private ContactFilter contactFilter {get;set;}

    private Set<Id> networkContactIds {
        get {
            if( networkContactIds == null ){
                networkContactIds = new Set<Id>();
            }
            return networkContactIds;
        }
        set;
    }
      
/**
 * CONSTRUCTOR
 */

    public PrmsPaginatorFilterContact( String payloadJSON ){
        super();
        
        ContactPayload payload = (ContactPayload) JSON.deserialize( payloadJSON, ContactPayload.class );

        this.filter = payload.generalFilter;

        this.contactFilter = payload.contactFilter;

        queryNetworkContactIds();
    }

/**
 * OVERRIDE METHODS
 */

    public override String getWhere(){

        String whereClause = 'WHERE RecordTypeId = :provider';
        whereClause += ' AND RecordTypeId = :provider';

        // whereClause += ' AND Email != null';
        // TODO: add this ^^^^ back in when provider relations data issues are recitified. Currently no providers have email data.

        if( !networkContactIds.isEmpty() ){
            whereClause += ' AND Id IN :networkContactIds';
        }

        whereClause += getTitleClause();
        whereClause += getCountyClause();
        whereClause += getCADClause();
        whereClause += getFQHCClause();
        
        return whereClause;
    }

/**
 * UTILITY METHODS
 */


    private String getTitleClause(){
        String clause = ' AND Provider_Title__c = \'' + contactFilter.title + '\'';

        return !String.isBlank(contactFilter.title) ? clause : '';
    }

    private String getCountyClause(){
        String clause = ' AND Account.County__c = \'' + contactFilter.county + '\'';

        return !String.isBlank(contactFilter.county) ? clause : '';
    }

    private String getCADClause(){
        String clause = ' AND Account.CAD__c = ' + contactFilter.cad;

        return contactFilter.cad != null ? clause : '';
    }

    private String getFQHCClause(){
        String clause = ' AND Account.FQHC__c = ' + contactFilter.fqhc;

        return contactFilter.fqhc != null ? clause : '';
    }

    public Set<Id> getNetworkContactIds(){
        return networkContactIds;
    }

/**
 * QUERY METHODS
 */

    /**
     * Gets list of Contact Ids based on network selected in UI.
     * 
     * <p>
     * The relation of network to provider contact is via the Provider Clinic object. A network Id is provided by user selection in UI and
     * this query assembles all possible contact (dentist) Ids to be included in the final contact query.
     * </p>
     * 
     * @return void
     */
    private void queryNetworkContactIds(){
        Id networkId = (Id) contactFilter.networkId;

        if( String.isBlank(networkId) ){ return; }

        String inactive = 'Inactive';

        String q = 'SELECT ';
                q += 'Id, ';
                q += 'Provider_Clinic__r.Dentist__c ';
                    q += 'FROM Network_Clinic_Providers__c ';
                    q += 'WHERE DDMN_Network__c = :networkId ';
                    q += 'AND Status__c != :inactive ';
                    q += 'AND Provider_Clinic__r.Status__c != :inactive ';
                    q += 'AND Provider_Clinic__r.Dentist__r.Status__c != :inactive ';
                    //q += 'AND Provider_Clinic__r.Dentist__r.Email != null'; 
                    // TODO: add this ^^^^ back in when provider relations data issues are recitified. Currently no providers have email data.
                    q += 'ORDER BY Provider_Clinic__r.Dentist__r.Name ' + filter.direction;

        try {

            for( Network_Clinic_Providers__c clinic : (Network_Clinic_Providers__c[]) Database.query(q) ){
                networkContactIds.add(clinic.Provider_Clinic__r.Dentist__c);
            } 
            
        } catch( QueryException e ){
            creedint.CreedExceptionHandler handler = new creedint.CreedExceptionHandler(e);
            handler.debug();
        }
    }

/**
 * LWC METHODS
 */

    /**
     * Gets all network names and Ids for contact filter in front end.
     * 
     * <p><ul>
     * <li> Used in LWC PrmsFilterContact.js </li>
     * </ul></p> 
     *
     * @return JSON of network UISelectOption list
     */
    @AuraEnabled(cacheable=true)
    public static String getNetworkOptions(){
        DDMN_Network__c[] networks = new DDMN_Network__c[]{};

        try {

            networks.addAll([SELECT
                                Id,
                                Name
                                    FROM DDMN_Network__c
                                    ORDER BY Name ASC]);
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        UISelectOption[] options = new UISelectOption[]{};

        for( DDMN_Network__c network : networks ){
            options.add( new UISelectOption( network.Id, network.Name ) );
        }

        return JSON.serialize(options);
    }
    
    /**
     * Gets all title picklist values for contact filter in front end.
     * 
     * <p><ul>
     * <li> Used in LWC PrmsFilterContact.js </li>
     * </ul></p> 
     *
     * @return JSON of title UISelectOption list
     */
    @AuraEnabled(cacheable=true)
    public static String getTitleOptions(){
        String[] titles = new List<String>();

        try {
    
            List<Schema.PicklistEntry> pickListEntries = Contact.Provider_Title__c.getDescribe().getPicklistValues();
    
            for( Schema.PicklistEntry entry : pickListEntries ){
                titles.add( entry.getLabel() );
            }
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        UISelectOption[] options = new UISelectOption[]{};

        for( String title : titles ){
            options.add( new UISelectOption( title, title ) );
        }
        
        return JSON.serialize(options);
    }

    /**
     * Utilizes the ContactFilter class definition to deliver the data shape to the front end. Used in:
     * 
     * <p><ul>
     * <li> LWC PrmsRecordContainerContact.js </li>
     * </ul></p> 
     *
     * @return JSON of new instance of ContactFilter
     */
    @AuraEnabled
    public static string getFilterDefinition(){
        
        ContactFilter filterDefinition = new ContactFilter();
        filterDefinition.cad = false;
        filterDefinition.fqhc = false;

        return JSON.serialize( filterDefinition );
    }

/**
 * DATA CLASSES
 */

    public class ContactPayload extends Payload {
        public ContactFilter contactFilter {get;set;}
    }

    public class ContactFilter {
        public String title {get;set;}
        public String networkId {get;set;} 
        public String county {get;set;} 
        public Boolean cad {get;set;} 
        public Boolean fqhc {get;set;} 
    }

    class UISelectOption {

        String value {get;set;}
        String label {get;set;}

        UISelectOption( String value, String label ){
            this.value = value;
            this.label = label;
        }
    }
}