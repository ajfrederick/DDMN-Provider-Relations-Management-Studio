/**
 * @name PrmsRecordContainerContact
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

import getContactRecords from '@salesforce/apex/PrmsUiService.getContactRecords';
import getFilterDefinition from '@salesforce/apex/PrmsPaginatorFilterContact.getFilterDefinition';

import CONTACT_NAME from '@salesforce/schema/Contact.Name';
import TITLE from '@salesforce/schema/Contact.Provider_Title__c';
import ACCOUNT_ID from '@salesforce/schema/Contact.AccountId';
import EMAIL from '@salesforce/schema/Contact.Email';
import PHONE from '@salesforce/schema/Contact.Phone';

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
    CONTACT_NAME.fieldApiName, 
    TITLE.fieldApiName,
    ACCOUNT_ID.fieldApiName,
    EMAIL.fieldApiName,
    PHONE.fieldApiName
 ];

 /**
 * @name contactFilter
 * @description default unique filter object for filter criteria in query. Defined in PrmsPaginatorFilterContact.cls
 * @type {Object}
 */
let contactFilter;

/**
 * CLASS
 */

export default class PrmsRecordContainerContact extends RecordContainer {

/**
 * PROPS
 */

    /**
     * @name contactFilter
     * @description mutable unique filter object for filter criteria in query. Defined in PrmsPaginatorFilterContact.cls
     * @type {Object}
     */
    contactFilter = {};

    /**
     * @name selectedRecords
     * @description records that where selected by user in UI. These were selected in the contact list component, emitted to the message composer
     * component then delivered to this component. After they have been set this component sets the 'selected' prop to true in the records list if that
     * record Id is in the selectedRecordIds list.
     * @type {Array<Object>}
     */
     _selectedRecords = [];

    @api
    get selectedRecords(){
        return this._selectedRecords;
    }
    set selectedRecords(selectedRecords){
        this.selectedRecordIds = [];
 
        selectedRecords.map((record)=>{
            this.selectedRecordIds.push(record.Id);
        });

        this.setSelection();

        this._selectedRecords = selectedRecords;
    }

    /**
     * @name selectedRecordIds
     * @description ids of records that were selected by user.
     * @type {Array<string>}
     */
    selectedRecordIds = [];

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
            contactFilter = JSON.parse(filterDefinition);
            this.contactFilter = {...contactFilter};
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
    getRecords(){
        let payload = JSON.stringify({
            generalFilter : this.filter,
            contactFilter : this.contactFilter
        });

        const setSelection = ()=>{
            this.setSelection();
        }

        super.getRecords( getContactRecords, payload, setSelection );
    }

    /**
     * @function setSelection
     * @description mutates record object with a selected = true if the record Id is in the selected Ids list. 
     * This is the value of each rows checkbox in UI list.
     */
    setSelection(){
        this.records.map((record)=>{
            record['selected'] = this.selectedRecordIds.includes(record.Id) ? true : false;
        });
    }
}