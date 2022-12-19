/**
 * Trigger helper used in Provider Relations Managment Studio which sends the emails to Providers. Used in CaseTrigger.
 * 
 * @author Joel Comfort (March 2022)
 * @author Andrew Frederick (December 2022)
 */
public class PrmsCaseHelper {

/**
 * FIELDS
 */

    private static final String FROMADDRESS = System.Label.Provider_Relations_From_Email_Address;

    public static PrmsCore.Attachment[] attachments {
        get {
            if( attachments == null ){ 
                attachments = new PrmsCore.Attachment[]{}; 
            }
            return attachments;
        }
        set;
    }

/**
 * TRIGGER METHODS
 */

    /**
     * Utilizes the Creed Email App to send emails based on the cases that were created by PrmsCore; filters cases by 'Provider Relations Corrsepondence' record type.
     * 
     * @param Case[] cases that were created
     * @return none
     * 
     * @see PrmsCore
     */
    public static void sendProviderEmails( Case[] newCases ) {
       
        EmailParcelFactoryPrms parcelFactory = new EmailParcelFactoryPrms( getProviderRelationCorrespondenceCases( newCases ) );
        parcelFactory.setOrgWideEmailAddressId( FROMADDRESS );
        parcelFactory.build();

        creedint.EmailFactoryOutbound emailFactory = new creedint.EmailFactoryOutbound( parcelFactory.getParcels() );
        emailFactory.build();

        creedint.EmailPost emailPost = new creedint.EmailPost( emailFactory );
        emailPost.post();

        attachments = null;
    }

    /**
     * Filters cases by 'Provider Relations Corrsepondence' record type.
     * 
     * @param Case[] cases that were created
     * @return list of Provider Relations Corrsepondence cases
     */
    private static Case[] getProviderRelationCorrespondenceCases( Case[] newCases ){
        Case[] cases = new Case[]{};

        for(Case curCase : newCases) {
            if( curCase.recordTypeId == PrmsCore.PR_CORRESPONDENCE ) {
                cases.add( curCase );
            }
        } 

        return cases;
    }
}