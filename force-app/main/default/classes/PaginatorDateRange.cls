/**
 * Date range object for query pagination that includes dates.
 * 
 * @author Joel Comfort (March 2022)
 * @author Andrew Frederick (December 2022)
 */
public class PaginatorDateRange {

/**
 * FIELDS
 */

    public String startDate {get;set;}

    public String endDate {get;set;}

/**
 * LWC METHODS
 */

    /**
     * Utilizes the PaginatorDateRange class definition to deliver the data shape to the front end. Used in:
     * 
     * <p><ul>
     * <li> LWC PrmsFilterEmail.js </li>
     * </ul></p> 
     *
     * @return JSON of new instance of PaginatorDateRange
     */
    @AuraEnabled
    public static string getDateRangeDefinition(){
        return JSON.serialize( new PaginatorDateRange() );
    }
}