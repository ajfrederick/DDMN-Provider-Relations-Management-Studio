/**
 * @name RecordContainer
 * @virtual
 * 
 * @description virtual class that retrieves records from the back end. It is a container for a filter and a list. Must be extended. 
 * It's children are where the apex methods are definied for record retrieval. These apex methods use Dynamic SOQL/SOSL which utilize the filter objects here.
 * 
 * @author Andrew Frederick 
 * @author Joel Comfort
 * 
 * @date December 2022 
 *
 * @see RecordContainerFilter
 * @see RecordContainerList
 */

/**
 * IMPORTS
 */

import { LightningElement, track } from 'lwc';
import { log } from 'c/utils';
import getFilterDefinition from '@salesforce/apex/PaginatorFilter.getFilterDefinition';

/**
 * COMP VARS
 */

/**
 * @name CREATED_DATE
 * @description default 'order by' field for query filter object delivered to back end
 * @type {string}
 */
const CREATED_DATE = 'CreatedDate';

/**
 * @name filter
 * @description default for filter criteria in query. Defined in PagintorFilter.cls
 * @type {Object}
 */
let filter;

/**
 * @name limits
 * @description limit numbers options for LIMIT in query. Defined in PagintorFilter.cls
 * @type {Array<number>}
 */
let limits;

/**
 * @name directions
 * @description direction options for ORDER BY in query. Defined in PagintorFilter.cls
 * @type {Array<string>}
 */
let directions;

/**
 * CLASS
 */

export default class RecordContainer extends LightningElement {
 
/**
 * PROPS
 */

    /**
     * @name filter
     * @description filter criteria for query.
     * @type {Object}
     */
    @track filter = {};

    /**
     * @name records
     * @description records returned by query.
     * @type {Array<Object>}
     */
    @track records = [];

    /**
     * @name recordLimitOptions
     * @description possible limit numbers for select lists in conatiners
     * @type {Array<Object>}
     */
    recordLimitOptions = [];

    /**
     * @name totalRecordCount
     * @description total possible records without any filter criteria. for paginator.
     * @type {number}
     */
    totalRecordCount = 0;

    /**
     * @name orderBys
     * @description possible fields to order the query by. delivered by children components via constructor.
     * @type {Array<string>}
     */
    orderBys = [];

    /**
     * @name isLoading
     * @description aids in displaying load spinner during apex call.
     * @type {boolean}
     */
    isLoading = false;

/**
 * CONSTRUCTOR
 */

    /**
     * @description sets 'order by' fields or defaults to CreatedDate.
     * @param {Array<string>} orderBys 
     */
    constructor( orderBys ){
        super();

        this.orderBys = orderBys ? orderBys : [CREATED_DATE];
    }

/**
 * LIFECYCLE HOOKS
 */

    /**
     * @function connectedCallback
     * @description gets the filter definition from apex PaginatorFilter.cls. This is so the filter criteria object shape is defined
     * in only one spot.
     */
    connectedCallback(){

        getFilterDefinition().then((filterDefinition)=>{
            filterDefinition = JSON.parse(filterDefinition);
    
            filter = {...filterDefinition.generalFilter};
            limits = [...filterDefinition.limits];
            directions = [...filterDefinition.directions];

            this.recordLimitOptions = setRecordLimitOptions();

            this.resetThisFilter();
            this.getRecords();
        });
    }

/**
 * MAIN FUNCS
 */

    /**
     * @function getRecords
     * @virtual
     * 
     * @description this is meant to be overriden. In the override the parameters are chosen and then this is called via super.
     * 
     * @param {Function} apexFunc - an imported aura enabled apex function imported into extended classes.
     * @param {Object} payload - final payload defined in extended classes that override this function
     * @param {Function} callback - any additaional operation that needs to be done when the records are returned.
     */
    getRecords( apexFunc, payload, callback ){
        this.isLoading = true;

        apexFunc( {payload} )
            .then( result => {
                result = JSON.parse( result );

                this.records = [...result.records];
                this.totalRecordCount = result.totalRecordCount;

                if( callback ){ callback(); }

                this.isLoading = false;
            })
            .catch(error =>{
                this.isLoading = false;
                console.log(error);
            });
    }

/**
 * DOM EVENT HANDLERS
 */

    /**
     * @function handleRecordLimitChange
     * @description handles 'records per page' select list change then queries for records.
     * @param {InputEvent} event
     */
     handleRecordLimitChange( event ){
        this.resetThisFilter();

        this.filter.recordLimit = parseInt(event.target.value);

        this.getRecords();
    }

/**
 * CUSTOM EVENT HANDLERS
 */

    /**
     * @function handleUniqueFilterChange
     * 
     * @description every child class has a unique Salesforce Object specific filter defined. This handles any change event made by a 
     * filter or list component then queries for records. The filter name in the event detail is the key on 'this' at which the filter is located.
     * This takes advantage of Prototypical inheritance. The unique filter object is the change.
     * 
     * @param {CustomEvent} event
     * @param {{ filterName: string, uniqueFilter: Object }} event.detail
     */
    handleUniqueFilterChange( event ){
        let thisUniqueFilter = this[event.detail.filterName];
        
        this[event.detail.filterName] = {...thisUniqueFilter, ...event.detail.uniqueFilter};
        
        this.resetThisFilter();

        this.getRecords();
    }

    /**
     * @function handleGeneralFilterChange
     * 
     * @description this handles any change event made by a filter or list component to the query filter definied here.
     * 
     * @param {CustomEvent} event 
     * @param {{ filter: Object }} event.detail
     */
    handleGeneralFilterChange( event ){
        this.filter = {...this.filter, ...event.detail.filter};

        this.getRecords();
    }

    /**
     * @function handleSortChange
     * 
     * @description handles event emitted by list component after column header clicj. Each list's column header is indexed mathching the 'order by' field array. 
     * function gets the 'order by' field clicked in list then determines if we should change directions or change the 'order by' field in filter.
     * 
     * @param {CustomEvent} event
     * @param {number} event.detail
     */
    handleSortChange( event ){
        let orderByField = this.orderBys[event.detail],
            toggle = directions.length - (directions.indexOf( this.filter.direction ) + 1);

        if( this.filter.orderByField === orderByField ) {
            this.filter.direction = directions[toggle];
        } else {
            this.filter.direction = getDirection( orderByField );
        }
        
        this.filter.orderByField = orderByField;

        this.getRecords();
    }

/**
 * UTILITY FUNCS
 */

    /**
     * @function resetThisFilter
     * @description resets filter to default defined in this file.
     */
    resetThisFilter(){
        this.filter = {...filter};
        this.filter.orderByField = this.orderBys[0];
        this.filter.direction = getDirection( this.filter.orderByField );
    }
}

/**
 * COMP FUNCS
 */

/**
 * @function setRecordLimitOptions
 * @description formats the options for select list in mark up.
 * @returns {Array<Object>}
 */
function setRecordLimitOptions(){
    let recordLimitOptions = [];

    limits.map((recordLimit)=>{
        let option = { 
            label : recordLimit + ' per page', 
            value : recordLimit 
        };

        recordLimitOptions.push(option);
    });

    return recordLimitOptions;
}

/**
 * @function getDirection
 * @dscription there are only two direction supplied from the back end ASC or DESC. If the 'order by' field is created date we want to
 * have the direction be DESC so we have newest first.
 * @param {string} orderByField 
 * @returns {string}
 */
function getDirection( orderByField ){
    return orderByField === CREATED_DATE ? directions[1] : directions[0];
}