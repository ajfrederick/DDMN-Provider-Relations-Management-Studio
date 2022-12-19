/**
 * General API services for UI in Provider Relations Management Studio
 * 
 * @author Joel Comfort (March 2022)
 * @author Andrew Frederick (December 2022)
 */
public with sharing class PrmsUiService {

/**
 * LWC METHODS
 */

    /**
     * Gets Provider Relations Mass Email records for app landing page; Gets called in LWC prmsRecordContainerEmail.js.
     * 
     * @param String filter JSON from front end. Format outlined in PaginatorFilter and PaginatorFilterEmail
     * @return JSON returned to front end. Format outlined in PrmsUiService
     */
    @AuraEnabled
    public static String getEmailRecords( String payload ) {

        RecordsContainer container = new RecordsContainer();

        try {

            PrmsPaginatorFilterEmail filter = new PrmsPaginatorFilterEmail( payload );
            Paginator paginator = new PrmsPaginatorEmail( filter );

            container.records = paginator.getRecords();
            container.totalRecordCount = paginator.getTotalRecordCount();

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        return JSON.serialize( container );
    }
    
    /**
     * Gets Case records for Message Viewer; Called in LWC prmsRecordContainerCase.js.
     * 
     * @param String filter JSON from front end. Format outlined in PaginatorFilterCase and PaginatorFilterCase
     * @return JSON returned to front end. Format outlined in PrmsUiService
     */
    @AuraEnabled
    public static String getCaseRecords( String payload ) {

        RecordsContainer container = new RecordsContainer();

        try {

            PrmsPaginatorFilterCase filter = new PrmsPaginatorFilterCase( payload );
            Paginator paginator = new PrmsPaginatorCase( filter );

            container.records = paginator.getRecords();
            container.totalRecordCount = paginator.getTotalRecordCount();
            
        } catch (Exception e) {
            throw new AuraHandledException( e.getMessage() );
        }

        return JSON.serialize( container );
    }

    /**
     * Gets Contact records for message composer; Called in LWC prmsRecordContainerContact.js.
     * 
     * @param String filter JSON from front end. Format outlined in PaginatorFilter and PaginatorFilterContact
     * @return JSON returned to front end. Format outlined in PrmsUiService
     */
    @AuraEnabled
    public static String getContactRecords( String payload ){

        RecordsContainer container = new RecordsContainer();

        try {

            PrmsPaginatorFilterContact filter = new PrmsPaginatorFilterContact( payload );
            Paginator paginator = new PrmsPaginatorContact( filter );

            container.records = paginator.getRecords();
            container.totalRecordCount = paginator.getTotalRecordCount();
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        return JSON.serialize( container );
    }

    /**
     * Gets Case records for Message Viewer; Called in LWC prmsRecordContainerContacts.js.
     * 
     * @param String email JSON from front end. Format outlined in PrmsCore
     * @return The amount of cases and emails that were sent successfully
     */
    @AuraEnabled
    public static String sendEmails( String email ) {
        Integer totalSuccess = 0;
        
        try {

            PrmsCore prmsCore = new PrmsCore(email);

            totalSuccess = prmsCore.createProviderRelationsMassEmail();

        } catch (Exception e) {
            throw new AuraHandledException( e.getMessage() );
        }

        return JSON.serialize(totalSuccess);
    } 

/**
 * DATA CLASSES
 */

    class RecordsContainer {
        SObject[] records {get;set;}
        Integer totalRecordCount {get;set;}
    }
}