/**
 * Extends creedint.EmailParcelFactory in Creed Email app to send emails for Provider Relations Managment Studio.
 * 
 * @see creedint.EmailParcelFactory
 * 
 * @author Joel Comfort (March 2022)
 * @author Andrew Frederick (December 2022)
 */
public class EmailParcelFactoryPrms extends creedint.EmailParcelFactory {

    public EmailParcelFactoryPrms( SObject[] obj ) {
        super( obj );
    }

    public override void build( SObject[] objs ) {
        Case[] cases = (Case[]) objs;

        for( Case curCase : cases ) {
            if( curCase.SuppliedEmail == null ){ continue; }

            creedint.EmailParcel parcel = new creedint.EmailParcel();

            parcel.oweAddressId = oweAddressId;
            parcel.whoId = curCase.ContactId;
            parcel.whatId = curCase.Id;
            
            for( PrmsCore.Attachment attachment : PrmsCaseHelper.attachments ){
                parcel.setAttachment( attachment.title, attachment.blobData );
            }

            String plainText = curCase.Description.replaceAll('<[^>]+>','');

            parcel.setContent( curCase.Subject, curCase.Description, plainText );
            parcels.add( parcel );
        }
    }
}
