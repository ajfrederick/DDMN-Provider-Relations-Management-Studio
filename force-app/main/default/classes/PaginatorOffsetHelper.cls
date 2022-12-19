/**
 * Utility class to aid in pagination through large record sets. There is an offset limit of 2000 in SOQL/SOSL so this is a solution to handle this limit. This is exclusively used in PaginatorFilter
 * 
 * @see PaginatorFilter
 * 
 * @author Andrew Frederick (December 2022)
 */
public with sharing class PaginatorOffsetHelper {

/**
 * FIELDS
 */

    // Limit imposed by SOQL. Offset is the feature chosen for pagination
    private static final Integer OFFSET_LIMIT = 2000;

    private Integer recordLimit {get;set;}

    private Integer recordOffset {get;set;}

    public Integer offsetPage {
        get {
            if( offsetPage == null ){
                offsetPage = 0;
            }
            return offsetPage;
        }
        set;
    }
 
    private Set<Id> idsToExclude {
        get {
            if( idsToExclude == null ){
                idsToExclude = new Set<Id>();
            }
            return idsToExclude;
        }
        set;
    }

/**
 * CONSTRUCTOR
 */

    /**
     * @param recordLimit - the limit the the current query is expected to use in the PaginatorFilter
     * @param recordOffset - the offset the current query is expected to use in the PaginatorFilter
     */
    public PaginatorOffsetHelper( Integer recordLimit, Integer recordOffset ){
        this.recordLimit = recordLimit;
        this.recordOffset = recordOffset;
    }

/**
 * ACTION METHODS
 */

    /**
     * Called in PaginatorFilter to increment the page after each query recursion.
     * 
     * @return none
     */
    public void page(){
        offsetPage++;
    }

    /**
     * Gives the offset to the PaginatorFilter for offset clause.
     * 
     * <p>
     * If we should make another recursive call the the offset will be 0 and the limit will be 2000.
     * </p>
     * 
     * @return the offset set in front end or 0
     */
    public Integer getOffset(){
        return getShouldPageOffset() ? 0 : getFinalOffset();
    }

    /**
     * Gives the limit to the PaginatorFilter for limit clause.
     * 
     * <p>
     * If we should make another recursive call the the limit will be 2000 and offset will be 0.
     * </p>
     * 
     * @return the limit set in front end or offset limit
     */
    public Integer getRecordLimit(){
        return getShouldPageOffset() ? OFFSET_LIMIT : recordLimit;
    }

/**
 * UTILITY METHODS
 */

    /**
     * Calculates the total offset and compares it to the offset limit and the current page (really the current recursive call).
     * 
     * @return whether or not anther recursion should occur.
     */
    public Boolean getShouldPageOffset(){
        return getTotalOffset() > OFFSET_LIMIT && getTotalOffset() > getCurrentOffsetLimitPage();
    }
    
    /**
     * After all the recursion has happened or if no recursion is necessary and we have an offset that is below 2000 then this will return the calculated offset.
     * 
     * @return the final offset number used in query
     */
    private Integer getFinalOffset(){
        return getTotalOffset() > OFFSET_LIMIT ? calculateFinalOffset() : getTotalOffset();
    }

    /**
     * Technically the record offset from the front end has a 0 based Integer that represents the page the paginator in the UI is on.
     * 
     * @return total offset number which equals limit from front end times the page the front end is on
     */
    private Integer getTotalOffset(){
        return recordLimit * recordOffset;
    }
    
    /**
     * If recursion has happend this utilizes the current recursion number and the total offset from front end to caluclate the final offset.
     * 
     * @return the final offset number
     */
    private Integer calculateFinalOffset(){
       Integer finalOffset = getCurrentOffsetLimitPage() - getTotalOffset() - OFFSET_LIMIT;

       return finalOffset < 0 ? finalOffset * -1 : finalOffset;
    }

    /**
     * Used to stop recursion when it is ocurring due to the offset being beyond the limit
     * 
     * @return offset limit times the recursion number
     */
    private Integer getCurrentOffsetLimitPage(){
        return OFFSET_LIMIT * offsetPage;
    }

    /**
     * List of ids to exclude from the query in recursion while the limit is set to 2000 and offset is set to 0.
     * 
     * @return set of record Ids
     */
    public Set<Id> getIdsToExclude(){
        return idsToExclude;
    }

    /**
     * Used in query for next query in recursion while the limit is set to 2000 and offset is set to 0.
     * 
     * @param Set<Id> record Ids to be exluded from next query
     */
    public void addIdsToExclude( Set<Id> idsToExclude ){
        this.idsToExclude.addAll(idsToExclude);
    }
}