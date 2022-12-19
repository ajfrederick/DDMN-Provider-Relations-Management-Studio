/**
 * @name PrmsRecordContainerEmail
 * 
 * @description extends Record Container comp. Defines the SObject unique filter shapes as well the apex functions to retrieve records.
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

import RecordContainer from 'c/recordContainer';

import getEmailRecords from '@salesforce/apex/PrmsUiService.getEmailRecords';
import getFilterDefinition from '@salesforce/apex/PrmsPaginatorFilterEmail.getFilterDefinition';

import CREATED_DATE from '@salesforce/schema/Provider_Relations_Mass_Email__c.CreatedDate';
import SUBJECT from '@salesforce/schema/Provider_Relations_Mass_Email__c.Subject__c';
import CREATED_BY from '@salesforce/schema/Provider_Relations_Mass_Email__c.CreatedBy.Name';

/**
 * COMP VARS
 */

/**
 * @name orderBys
 * @description possible values for ORDER BY fields in query in backend. Delivered to Record Container comp via consrtuctor.
 * @type {Array<string>}
 * @see RecordContainer
 */
const orderBys = [
    CREATED_DATE.fieldApiName,
    SUBJECT.fieldApiName, 
    CREATED_BY.fieldApiName
];

/**
 * @name emailFilter
 * @description default unique filter object for filter criteria in query. Defined in PrmsPaginatorFilterEmail.cls
 * @type {Object}
 */
let emailFilter;

/**
 * CLASS
 */

export default class PrmsRecordContainerEmail extends RecordContainer {  

/**
 * PROPS
 */

    /**
     * @name emailFilter
     * @description mutable unique filter object for filter criteria in query. Defined in PrmsPaginatorFilterEmail.cls
     * @type {Object}
     */
    emailFilter = {};

/**
 * CONSTRUCTOR
 */

    /**
     * @descritpion delivers list of 'order by' fields to parent
     */
    constructor(){
        super(orderBys);
    }

/**
 * LIFECYCLE HOOKS
 */

    /**
     * @function connectedCallback
     * @description fetchs the email filter object shape from the backend

     */
    connectedCallback(){
        getFilterDefinition().then((filterDefinition)=>{
            emailFilter = JSON.parse(filterDefinition);
            this.emailFilter = {...emailFilter};
            super.connectedCallback();
        });
    }

/**
 * MAIN FUNCS
 */

    /**
     * @function getRecords
     * @description defines the final payload to be sent to back end for record query utilizing the general filter and the filter
     * that is unique to this SObject. This funciton is also definied in super but overwrites then calls the super.
     */
    getRecords() {
        let payload = JSON.stringify({
            generalFilter : this.filter,
            emailFilter : this.emailFilter
        });

        const setCreatedDate = ()=>{
            this.records.map((email)=>{
                email.CreatedDate = email.CreatedDate.substring(0, 10);
            });
        }

        super.getRecords( getEmailRecords, payload, setCreatedDate );
    }
}