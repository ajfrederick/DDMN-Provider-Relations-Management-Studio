/**
 * @name RecordContainerFilter
 * @virtual
 * 
 * @description vitual filter class for record conainer and record container list. Must be extended and will always be found in a record container comp.
 * 
 * @author Andrew Frederick 
 * @author Joel Comfort
 * 
 * @date December 2022 
 *
 * @see RecordContainer
 */

/**
 * IMPORTS
 */

import { LightningElement, api } from 'lwc';
import { log } from 'c/utils';

/**
 * COMP VARS
 */

/**
 * @name timeOutId
 * @description used for debouncing on search input
 * @type {number}
 */
let timeOutId;

/**
 * CLASS
 */

export default class RecordContainerFilter extends LightningElement {

/**
 * PROPS
 */

    /**
     * @name recordLimit
     * @description limit of how many records return in query. for paginator. delivered by conainter.
     * @type {number}
     */
    @api recordLimit = 0;

    /**
     * @name totalRecordCount
     * @description total amount of records that would be found without a record limit applied. for paginator. delivered by container.
     * @type {number}
     */
    @api totalRecordCount = 0;


    /**
     * @name currentPage
     * @description current page. for paginator. delivered by container.
     * @type {number}
     */
    _currentPage = 1;

    @api 
    get currentPage(){
        return this._currentPage;
    }
    set currentPage(recordOffset){
        this._currentPage = recordOffset+1; // since this is coming from the OFFSET number which is 0 based
    }

/**
 * DOM EVENT HANDLERS
 */
    
    /**
     * @function handlePageTurn
     * @description captures page turn event from paginator comp and emits the filter to record container comp.
     * @param {CustomEvent} event 
     */
    handlePageTurn(event){
        let filter = {
            recordOffset : event.detail.currentPage-1
        };

        this.dispatchGeneralFilterChange( filter );
    }
    
    /**
     * @function handleSearchChange
     * @description captures search change from DOM input and emits a filter change event to record container comp.
     * @param {KeyboardEvent} event
     */
    handleSearchChange(event) {
        const search = event.target.value;

        const later = ()=>{
            timeOutId = null;

            // SOSL doesn't like search values with only 1 character
            let filter = {
                searchText : search.length === 1 ? null : search,
                recordOffset : 0
            };

            if( filter.searchText === null ){ return };

            this.dispatchGeneralFilterChange( filter );
        };

        clearTimeout(timeOutId);

        timeOutId =  setTimeout(later, 200);        
    }

/**
 * EVENT EMITTERS
 */

    /**
     * @name dispatchUniqueFilterChange
     * @description emits a filter change event and which is caught in record container comp. This is used by comps that extend this one.
     * Each child component has a filter Object that is unique to the component (eg contact, case, etc.) which is unique to the query in the backend.
     * @param {string} filterName 
     * @param {Object} uniqueFilter 
     * 
     * @see RecordContainer
     */
    dispatchUniqueFilterChange( filterName, uniqueFilter ){
        let detail = {
            filterName,
            uniqueFilter
        };

        let event = new CustomEvent( 'uniquefilterchange', {detail} );

        this.dispatchEvent(event);
    }

    /**
     * @name dispatchGeneralFilterChange
     * @desciption emits a filter change event and which is caught in record container comp. This is the general filter that is used in all queries and containes
     * data that pertains to ORDER BY, LIMIT, OFFSET, etc.
     * @param {Object} filter
     * 
     * @see RecordContainer
     */
    dispatchGeneralFilterChange( filter ){
        let event = new CustomEvent( 'generalfilterchange', {detail : {filter}} );

        this.dispatchEvent(event);
    }
}