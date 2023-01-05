/**
 * Utility class to aid in pagination through large record sets.
 * 
 * <p>
 * Must be extended and requires a PaginatorFilter. Each extension defines the dynamic SOQL and SOSL strings.
 * </p>.
 * 
 * @author Joel Comfort (March 2022)
 * @author Andrew Frederick (December 2022)
 */
public with sharing abstract class Paginator {

/**
 * FIELDS
 */

    protected PaginatorFilter filter {get;set;}

    protected SObject[] records {
        get {
            if( records == null ){
                records = new SObject[]{};
                setRecords();
            }
            return records;
        }
        set;
    }

    protected Integer totalRecordCount {
        get {
            if( totalRecordCount == null ){
                totalRecordCount = 0;
                setTotalRecordCount();
            }
            return totalRecordCount;
        }
        set;
    }
    
/**
 * CONSTRUCTOR
 */

    /**
     * Takes a filter definition which each class extension uses to create query strings
     * 
     * @see PaginatorFilter
     */
    public Paginator( PaginatorFilter filter ) {
       this.filter = filter;
    }

/**
 * ABSTRACT METHODS
 */

    /**
     * Each PaginatorFilter will contain a set of filter criteria from the front end that this method uses to generate a query string.
     * 
     * @return Dynamic SOQL String
     */
    protected abstract String getSOQLString();

     /**
     * Each PaginatorFilter will contain a set of filter criteria from the front end that this method uses to generate a query string when a search is required.
     * 
     * @return Dynamic SOSL String
     */
    protected abstract String getSOSLString();

     /**
     * Generates a count query string with no filter criteria to determine the total number of possible records which is necessary in determining total pages.
     * @return Dynamic SOQL String
     */
    protected abstract String getSOQLCountString();

     /**
     * Generates a query string with no filter criteria to determine the total number of possible records when a search is required; necessary in determining total pages.
     * 
     * @return Dynamic SOSL String
     */
    protected abstract String getSOSLCountString();


/**
 * ACTION METHODS
 */

    /**
     * Returns all records after initializing a cascade to retrieve the records by accessing the records class property.
     * 
     * @return list of SObjects
     */
    public SObject[] getRecords(){
        return records;
    }

    /**
     * Returns total record count after initializing a cascade to retrieve the record count by accessing the record count class property.
     * 
     * @return number of total records without any filter criteria
     */
    public Integer getTotalRecordCount(){
        return totalRecordCount;
    }

    /**
     * Assembles to query string and queries records while managing SOQL limitations such as offset limits; 
     * called when accessing the records property.
     * 
     * @return none
     */    
    private void setRecords(){

        try {

            SObject[] queryResult = queryRecords( getQueryString() );

            if( shouldPageOffset( queryResult ) ){ return; } // to manage offset limit of 2000

            records.addAll(queryResult);

        } catch( Exception e ){
            creedint.CreedExceptionHandler handler = new creedint.CreedExceptionHandler(e);
            handler.handle();
        }
    }

    /**
     * Assembles to query string and queries for the total amount of records without filter criteria from front end; 
     * called when accessing total record count property.
     * 
     * @return none
     */
    private void setTotalRecordCount(){

        try {

            totalRecordCount += queryTotalRecordCount( getTotalQueryString() );
    
        } catch( Exception e ){
            creedint.CreedExceptionHandler handler = new creedint.CreedExceptionHandler(e);
            handler.handle();
        }
    }

/**
 * VIRTUAL METHODS
 */

    /**
     * Executes dynmaic query for records after determining whether or not a search is required.
     * 
     * @param String string defined by extensions
     * @return list of SObjects
     */
    protected virtual SObject[] queryRecords( String queryString ){
        Set<Id> idsToExclude = filter.getIdsToExclude(); // to manage offset limit of 2000. Binded vars in dynamic SOQL must be in scope of query exe

        return filter.hasSearch() ? Search.query( queryString )[0] : Database.query( queryString );
    } 

    /**
     * Executes dynmaic query for total record count without filter criteria after determining whether or not a search is required.
     * 
     * @param String string defined by extensions
     * @return number of total possible records without filter criteria
     */
    protected virtual Integer queryTotalRecordCount( String queryString ){
        return filter.hasSearch() ? Search.query( queryString )[0].size() : Database.countQuery( queryString );
    }

/**
 * UTILITY METHODS
 */

    /**
     * Gets query string for record query; used for cleanliness.
     * 
     * @return query string
     */
    protected String getQueryString(){
        return filter.hasSearch() ? getSOSLString() : getSOQLString();
    }

    /**
     * Gets query string for total record query; used for cleanliness.
     * 
     * @return query string
     */
    protected String getTotalQueryString(){
        return filter.hasSearch() ? getSOSLCountString() : getSOQLCountString();
    }

    /**
     * Checks the filter to see if the offset is greater than 2000 due to the offset limit of 2000.
     * 
     * <p>
     * The SOQL offset feature is used to page through record sets. If the offset is greater than 2000 then we will hit the offset limit.
     * In the case the it is greater than 2000 then getRecords() is called recursively while gathering 2000 record Ids per call to exclude in the next recursion 
     * until we've reached an offset less than 2000.
     * </p>
     * 
     * @param SObject[] list of records from setRecords()
     * @return query string
     */
    private Boolean shouldPageOffset( SObject[] queryResult ){
        if( !filter.getShouldPageOffset() ){ return false; }

        filter.addIdsToExclude( new Map<Id, SObject>( queryResult ).keySet() );

        setRecords();

        return true;
    }
}