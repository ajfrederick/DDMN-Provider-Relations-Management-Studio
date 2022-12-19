/**
 * Utility class to aid in pagination through large record sets. 
 * 
 * <p>
 * Must be extended. Each extension defines the WHERE statement for each SOQL string defined in Paginator extensions.
 * </p>
 * 
 * @author Joel Comfort (March 2022)
 * @author Andrew Frederick (December 2022)
 */
public with sharing abstract class PaginatorFilter {

/**
 * FEILDS
 */

    protected GeneralFilter filter {get;set;}

    protected PaginatorOffsetHelper offsetHelper {
        get {
            if( offsetHelper == null ){
                offsetHelper = new PaginatorOffsetHelper( filter.recordLimit, filter.recordOffset );
            }
            return offsetHelper;
        }
        set;
    }

    private static final Integer[] LIMITS = new Integer[]{50,100,200}; // Constant utilized by entire application both front and back end.
   
    private static final String[] DIRECTIONS = new String[]{'ASC','DESC'};  // Constant utilized by entire application both front and back end.
    
    private static final String CREATED_DATE = 'CreatedDate'; // Default ORDER BY

/**
 * ABSTRACT METHODS
 */
    
    /**
     * Defines the WHERE statement for all queries in Paginator extensions.
     * 
     * @return Dynamic SOQL/SOSL WHERE clause
     * 
     * @see Paginator
     */
    public abstract String getWhere();
    
/**
 * ACTION METHODS
 */

    /**
     * Defines the entrity filter criteria for SOQL/SOSL statement for all queries in Paginator extensions.
     * 
     * @return Dynamic SOQL/SOSL filter criteria
     * 
     * @see Paginator
     */
    public String getFilterCriteria(){
        offsetHelper.page();

        String filterCriteria = getWhere();
        filterCriteria += getIdsNotIn(); // to manage offset limit of 2000
        filterCriteria += getOrderBy();
        filterCriteria += getLimit();
        filterCriteria += getRecordOffset();

        return filterCriteria;
    }

    /**
     * Aids in the case that the offset is greater than 2000.
     * 
     * <p>
     * The SOQL offset feature is used to page through record sets. If the offset is greater than 2000 then we will hit the offset limit.
     * In the case the it is greater than 2000 then getRecords() is called recursively while gathering 2000 record Ids per call to exclude in the next recursion 
     * until we've reached an offset less than 2000.
     * </p>
     * 
     * @return Dynamic SOQL/SOSL filter criteria
     */
    private String getIdsNotIn(){
        if( getIdsToExclude().isEmpty() ){ return ''; }

        return ' AND Id NOT IN :idsToExclude';
    }

    /**
     * Returns ORDER BY clause for filter criteria which is determined in the front end by sort functions.
     * 
     * @return Dynamic SOQL/SOSL filter criteria
     */
    private String getOrderBy() {
        if( String.isBlank(filter.orderByField) || String.isBlank(filter.direction) ){ return ''; }

        return ' ORDER BY ' + filter.orderByField + ' ' +  filter.direction;
    }

    /**
     * Returns LIMIT clause for filter criteria which is determined in the front end.
     * 
     * <p>
     * In the case that the offset from the front end exceeds the offset limit (2000) the LIMIT defaults to 2000 in order to gather 
     * 2000 record Ids to exclude from the next call in recursion in a effort to reduce the offset while excluding records for a successful pagination.
     * </p>
     * 
     * @return Dynamic SOQL/SOSL filter criteria
     */
    private String getLimit() {
        Integer recordLimit = offsetHelper.getRecordLimit(); // this is to workaround SOQL Offset limit of 2000

        if( recordLimit <= 0 ){ return ''; }

        return ' LIMIT ' + recordLimit;
    }

    /**
     * Returns OFFSET clause for filter criteria which is determined in the front end.
     * 
     * <p>
     * In the case that the offset from the front end exceeds the offset limit (2000) the OFFSET defaults to 0 in order to gather with LIMIT set to 2000 in order to gather
     * 2000 record Ids to exclude from the next call in recursion in a effort to reduce the offset while excluding records for a successful pagination.
     * </p>
     * 
     * @return Dynamic SOQL/SOSL filter criteria
     */
    private String getRecordOffset() {
        Integer offset = offsetHelper.getOffset(); // this is to workaround SOQL Offset limit of 2000

        if( offset <= 0 ){ return ''; }

        return ' OFFSET ' + offset;
    }

/**
 * UTILITY METHODS
 */

    public String getSearch(){
        return String.escapeSingleQuotes( filter.searchText ) + '*';
    }

    public Boolean hasSearch(){
        return !String.isBlank(filter.searchText);
    }

    /**
     * Checked in the Paginator to determine if another recursive call should be made.
     * 
     * <p>
     *  Returns true if the record offset from the front end is greater then the offset limit (2000) times the amount of times a recursive query call has been made.
     * </p>
     * 
     * @return whether or not the offset should be paged
     * 
     * @see Paginator
     */
    public Boolean getShouldPageOffset(){
        return offsetHelper.getShouldPageOffset();
    }

    /**
     * Utilized in the Paginator.
     * 
     * @return record ids to be excluded from query in recursive call
     * 
     * @see Paginator
     */
    public Set<Id> getIdsToExclude(){
        return offsetHelper.getIdsToExclude();
    }

    /**
     * Utilized in the Paginator.
     * 
     * @param Set<Id> record ids to be excluded from query in recursive call
     * 
     * @see Paginator
     */
    public void addIdsToExclude( Set<Id> idsToExclude ){
        offsetHelper.addIdsToExclude( idsToExclude );
    }

/**
 * LWC METHODS
 */

    /**
     * Utilizes the GeneralFilter class definition to deliver the data shape to the front end. Used in:
     * 
     * <p><ul>
     * <li> LWC RecordContainer.js </li>
     * </ul></p> 
     * 
     * @return JSON of new instance of GeneralFilter
     */
    @AuraEnabled
    public static string getFilterDefinition(){

        GeneralFilter generalFilter = new GeneralFilter();
        generalFilter.orderByField = CREATED_DATE;
        generalFilter.direction = DIRECTIONS[0];
        generalFilter.recordLimit = LIMITS[0];
        generalFilter.recordOffset = 0;

        FilterDefinition filterDefinition = new filterDefinition();
        filterDefinition.generalFilter = generalFilter;
        filterDefinition.limits = LIMITS;
        filterDefinition.directions = DIRECTIONS;

        return JSON.serialize(filterDefinition);
    }

    /**
     * Utilizes the direction found in PaginatorFilter to deliver the possible directions (ASC or DESC) to front end.
     * 
     * <p><ul>
     * <li> Used in LWC RecordContainer.js </li>
     * </ul></p> 
     *
     * @return JSON of directions
     */
    @AuraEnabled
    public static string getDirections(){
        return JSON.serialize(DIRECTIONS);
    }

    /**
     * Utilizes the limits found in PaginatorFilter to deliver the possible limits to front end.
     * 
     * <p><ul>
     * <li> Used in LWC RecordContainer.js </li>
     * </ul></p> 
     *
     * @return JSON of limits
     */
    @AuraEnabled
    public static string getLimits(){
        return JSON.serialize(LIMITS);
    }

/**
 * DATA CLASSES
 */

    public virtual class Payload {
        public GeneralFilter generalFilter {get;set;}
    }

    public class GeneralFilter {
        public String orderByField {get;set;} // e.g. CreatedDate
        public String direction {get;set;} // e.g. ASC
        public Integer recordLimit {get;set;} // e.g. 50
        public Integer recordOffset {get;set;} // e.g. 1
        public String searchText {get;set;} // e.g. hello
    }

    public class FilterDefinition {
        public GeneralFilter generalFilter {get;set;}
        public Integer[] limits {get;set;}
        public String[] directions {get;set;}
    }

/**
 * EXCEPTION CLASSES
 */
    public class PaginatorFilterException extends Exception {}
}