/**
 * @name PrmsRecordContainerCase
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
import { api } from 'lwc';
import {log} from 'c/utils';

import getCaseRecords from '@salesforce/apex/PrmsUiService.getCaseRecords';
import getFilterDefinition from '@salesforce/apex/PrmsPaginatorFilterCase.getFilterDefinition';

import CASE_NUMBER from '@salesforce/schema/Case.CaseNumber';
import CONTACT_NAME from '@salesforce/schema/Case.Contact.Name';
import STATUS from '@salesforce/schema/Case.Status';
import EMAIL from '@salesforce/schema/Case.Contact.Email';

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
    CASE_NUMBER.fieldApiName, 
    CONTACT_NAME.fieldApiName,
    STATUS.fieldApiName,
    EMAIL.fieldApiName
];

 /**
 * @name contactFilter
 * @description default unique filter object for filter criteria in query. Defined in PrmsPaginatorFilterCase.cls
 * @type {Object}
 */
let caseFilter;

export default class PrmsRecordContainerCase extends RecordContainer {

    /**
     * @name contactFilter
     * @description mutable unique filter object for filter criteria in query. Defined in PrmsPaginatorFilterContact.cls
     * @type {Object}
     */
    caseFilter = {};

    /**
     * @name selectedEmail
     * @description the email that was selected in email list comp. Emitted to main page comp on email click then delivered to this component. When it gets
     * set then get then get the filter definition. Since the emailId is set here we needed to have the filter definition call here. Other wise the async messes up and
     * the case filter doesn't get here in time.
     * @type {Object}
     */
    _selectedEmail;

    @api
    get selectedEmail(){
        return this._email;
    }
    set selectedEmail(value) {
        this._selectedEmail = value;

        getFilterDefinition().then((filterDefinition)=>{
            caseFilter = JSON.parse(filterDefinition);
            this.caseFilter = {...caseFilter};
            this.caseFilter.emailId = value.Id;
            super.connectedCallback();
        });
    }

/**
 * CONSTRUCTOR
 */

    /**
     * @descritpion delivers list of 'order by' fields to parent
     */
    constructor(){
        super( orderBys );
    }

/**
 * LIFECYCLE HOOKS
 */

    /**
     * @function connectedCallback
     * @description override so it can be called explicitly in selectedEmail prop set.
     */  
    connectedCallback(){}

    /**
     * @function getRecords
     * @description defines the final payload to be sent to back end for record query utilizing the general filter and the filter
     * that is unique to this SObject. This funciton is also definied in super but overwrites then calls the super.
     */
    getRecords(){
        if( this.caseFilter.emailId == null ){ return; }

        let payload = JSON.stringify({
            generalFilter : this.filter,
            caseFilter : this.caseFilter
        });

        super.getRecords( getCaseRecords, payload );
    }
}