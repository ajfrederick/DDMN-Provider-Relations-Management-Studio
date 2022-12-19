/**
 * Core class for Provider Relations Management Studio. Responible for creating mass email records as well as the cases that are related to the email.
 * 
 * @author Joel Comfort (March 2022)
 * @author Andrew Frederick (December 2022)
 */
public with sharing class PrmsCore {

/**
 * FEILDS
 */

    private Email email {get;set;}

    public static final RecordTypeUtil CASE_RECORD_TYPE_UTIL = new RecordTypeUtil( new Case() );
    public static final RecordTypeUtil CONTACT_RECORD_TYPE_UTIL = new RecordTypeUtil( new Contact() );

    public static final Id PR_CORRESPONDENCE = CASE_RECORD_TYPE_UTIL.getRecordTypeId('Provider_Relations_Correspondence');
    public static final Id PROVIDER = CONTACT_RECORD_TYPE_UTIL.getRecordTypeId('Provider_ddmn');

/**
 * CONSTUCTORS
 */

    /**
     * Deserializes the JSON of email from front end.
     * 
     * @param String JSON from front end.
     */
    public PrmsCore( String emailJSON ) {
        this.email = (Email) JSON.deserialize( emailJSON, Email.class );
    }

/**
 * ACTION METHODS
 */

    /**
     * Inserts mass email record as well as related case records.
     * 
     * @return number of cases that were created
     * 
     * @exception EmailException if email has no recipients
     * @exception EmailException if email has no body
     * @exception EmailException if email has no subject
     */
    public Integer createProviderRelationsMassEmail(){

        if( getRecipients() == null ){
            throw new EmailException('Provider Relations Mass Emails require contact recipients');
        }

        if( String.isBlank( getRichTextBody() ) ){
            throw new EmailException('Provider Relations Mass Emails require a message body');
        }

        if( String.isBlank( getSubject() ) ){
            throw new EmailException('Provider Relations Mass Emails require a message subject');
        }

        Provider_Relations_Mass_Email__c prme = new Provider_Relations_Mass_Email__c();
        prme.Subject__c = getSubject();
        prme.Message_Rich_Text__c = getRichTextBody();
        prme.Message_Plain_Text__c = getPlainTextBody();
        prme.Attachment_Names__c = populateAttachmentNames();

        insert prme;

        return createCases(prme.Id);
    }

    /**
     * Utilizes deconstructed Email and newly created Mass Emaill record to create case records for every recipient.
     * 
     * @return number of cases created
     */
    private Integer createCases( Id prmeId ) {
        Case[] cases = new Case[]{};

        for( Contact recipient : getRecipients() ){

            Case c = new Case();
            c.Provider_Relations_Mass_Email__c = prmeId;
            c.Description = getRichTextBody();
            c.Subject = getSubject();
            c.SuppliedEmail = recipient.Email;
            c.status = 'Closed';
            c.recordTypeId = PR_CORRESPONDENCE;
            c.ContactId = recipient.Id;
            c.Origin = 'Web';

            cases.add(c);
        }

        PrmsCaseHelper.attachments = getAttachments();

        insert cases;

        return cases.size();
    }

/**
 * UTILITY METHODS
 */

    private String getSubject(){
        return email.subject != null ? email.subject : '';
    }

    private Contact[] getRecipients(){
        return email.recipients == null || email.recipients.isEmpty() ? null : email.recipients;
    }

    private String getRichTextBody(){
        return email.messageBody != null ? email.messageBody : '';
    }

    private String getPlainTextBody(){
        return email.messageBody != null ? email.messageBody.replaceAll('<[^>]+>','') : '';
    }

    private Attachment[] getAttachments(){
        return email.attachments != null ? email.attachments : new Attachment[]{};
    }

     /**
     * Deconstructs email object to assemble a string of all the attachment file names.
     * 
     * <p>
     * This is to be able to display the names of attachments on the mass email record as opposed to maintaining a direct relationship. If user
     * wishes to view attachments they can go to the email message record attached to the case record.
     * </p>
     * 
     * @return list of attachments defined with PrmsCore
     */
    private String populateAttachmentNames() {
        String attachmentNames = '';

        for( Attachment attachment : getAttachments() ) {
            attachmentNames += attachment.title + '; ';
        }

        return attachmentNames;
    }

/**
 * LWC METHODS
 */

    /**
     * Utilizes the Email class definition to deliver the data shape to the front end. Used in:
     * 
     * <p><ul>
     * <li> LWC PrmsRecordContainerEmail.js </li>
     * </ul></p> 
     *
     * @return JSON of new instance of Email data class
     */
    @AuraEnabled
    public static String getEmailDefinition(){

        Email email = new Email();
        email.recipients = new Contact[]{};
        email.attachments = new Attachment[]{};
        email.subject = '';
        email.messageBody = '';

        return JSON.serialize(email);
    }

/**
 * DATA CLASSES
 */

    public class Email {
        public Contact[] recipients {get;set;}
        public String subject {get;set;}
        public String messageBody {get;set;}
        public Attachment[] attachments {get;set;}
    }

    public class Attachment {
        public String title {get;set;}
        public Blob blobData {get;set;}
    }

/**
 * EXCEPTION CLASSES
 */

    class EmailException extends Exception {}
}