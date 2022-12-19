/**
 * Used in PrmsPaginatorEmail and extends PaginatorFilter to assmeble query strings so Provider Relations Mass Email records can be delivered to Provider Relations Management Studio front end.
 * 
 * @see PaginatorFilter
 * @see PrmsPaginatorEmail
 * 
 * @author Joel Comfort (March 2022)
 * @author Andrew Frederick (December 2022)
 */
public class PrmsPaginatorFilterEmail extends PaginatorFilter {

/**
 * FIELDS
 */

    private static final String START_TIME = 'T00:00:00Z';
    private static final String END_TIME = 'T23:59:59Z';

    private static final String DEFAULT_START_DATE = '1970-01-01' + END_TIME;
    private static final String DEFAULT_END_DATE = System.Now().formatGmt( 'yyyy-MM-dd' ) + END_TIME;

    private EmailFilter emailFilter {get;set;}

/**
* CONSTRUCTOR
*/

    public PrmsPaginatorFilterEmail( String payloadJSON ) {
        super();

        EmailPayload payload = (EmailPayload) JSON.deserialize( payloadJSON, EmailPayload.class );

        this.filter = payload.generalFilter;

        this.emailFilter = payload.emailFilter;
    }

/**
* OVERRIDE METHODS
*/

    public override String getWhere() {
        String whereClause = 'WHERE CreatedDate >= ' + getStartDate();
        whereClause += ' AND CreatedDate <= ' + getEndDate();

        return whereClause;
    }

/**
* UTILITY METHODS
*/

    private String getStartDate() {
        return emailFilter.dateRange != null ? emailFilter.dateRange.startDate.substring( 0,10 ) + START_TIME : DEFAULT_START_DATE;
    }

    private String getEndDate(){
        return emailFilter.dateRange != null ? emailFilter.dateRange.endDate.substring( 0,10 ) + END_TIME : DEFAULT_END_DATE;
    }

/**
 * LWC METHODS
 */

    /**
     * Utilizes the EmailFilter class definition to deliver the data shape to the front end. Used in:
     * 
     * <p><ul>
     * <li> LWC PrmsRecordContainerEmail.js </li>
     * </ul></p> 
     *
     * @return JSON of new instance of EmailFilter
     */
    @AuraEnabled
    public static string getFilterDefinition(){
        return JSON.serialize( new EmailFilter() );
    }

/**
* DATA CLASSES
*/

    public class EmailPayload extends Payload {
        public EmailFilter emailFilter {get;set;}
    }

    public class EmailFilter {
        public PaginatorDateRange dateRange {get;set;}
    }
}