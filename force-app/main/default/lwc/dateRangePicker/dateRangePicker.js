/**
 * @name DateRangePicker
 * 
 * @description Allows for a user to pick a date range and emits an event with a date range object on date change. Utilizes apex class PaginatorDateRange.cls.
 * .
 * @author Andrew Frederick 
 * @author Joel Comfort
 * 
 * @date December 2022 
 */

/**
 * IMPORTS
 */

import { LightningElement, track } from 'lwc';
import { getWarningToast } from 'c/utils';
import { log } from 'c/utils';
import getDateRangeDefinition from '@salesforce/apex/PaginatorDateRange.getDateRangeDefinition';

/**
 * COMP VARS
 */

/**
 * @name dateRange
 * @description Default date range object for filter criteria in Dynamic SOQL query.
 * @type {Object}
 * @private
 */
let dateRange;

/**
 * CLASS
 */

export default class DateRangePicker extends LightningElement {

/**
 * PROPS
 */

    /**
     * @name dateRange
     * @description mutable date range object for filter criteria in Dynamic SOQL query.
     * @type {{ endDate: string, startDate: string }}
     */
    @track dateRange = {};

    /**
     * @name hasOneDate
     * @description is true if the date range object has only one date set
     * @return {boolean}
     */
    get hasOneDate(){
        return this.dateRange.startDate != null || this.dateRange.endDate != null;
    }

    /**
     * @name hasBothDates
     * @description is true if the date range object has both one datse set
     * @return {boolean}
     */
    get hasBothDates(){
        return this.dateRange.startDate != null && this.dateRange.endDate != null;
    }


/**
 * LIFECYCLE HOOKS
 */

    /**
     * @function connectedCallback
     * @description Makes an APEX call to retrieve date range object definition found in PaginatorDateRange.cls
     * @returns {void}
     */
    connectedCallback(){
        getDateRangeDefinition().then((dateRangeDefinition)=>{
            this.dateRange = JSON.parse(dateRangeDefinition);
            this.resetDateRange();
        })
    }

/**
 * DOM EVENT HANDLERS
 */

    /**
     * @function handleStartDateChange
     * @description changes the date range start date after a date input DOM event and emits a change event
     * @param {InputEvent}
     * @returns {void}
     */
    handleStartDateChange(event){
        let dateString = event.target.value ? event.target.value + "T00:00:00.000Z" : null;

        this.setDate( 'startDate', dateString );
    }

    /**
     * @function handleEndDateChange
     * @description changes the date range end date after a date input DOM event and emits a change event
     * @param {InputEvent}
     * @returns {void}
     */
    handleEndDateChange(event){
        let dateString = event.target.value ? event.target.value + "T23:59:59.999Z" : null;

        this.setDate( 'endDate', dateString );
    }

    /**
     * @function clearDates
     * @description clears date input values and nulls the date range object values
     * @returns {void}
     */
    clearDates(){
        let inputs = this.template.querySelectorAll("lightning-input");

        inputs.forEach((input)=>{ input.value = null; });

        this.resetDateRange();
        this.fireDateChanged();
    }

/**
 * EVENT EMITTERS
 */

    /**
     * @function fireDateChanged
     * @description emits data change event after checking if start date is earlier than end date
     * @returns {void}
     */
    fireDateChanged(){

        if( this.isInvalidDateRange()  ){
            this.notifyInvalidDateRange();
            return;
        }
        
        let event = new CustomEvent( 'datechange', {
            bubbles: true,
            detail: this.hasBothDates ? {...this.dateRange} : null
        });

        this.dispatchEvent( event );
    }

    /**
     * @function notifyInvalidDateRange
     * @description shows warning toast to user that the date range is invalid
     * @returns {void}
     */
    notifyInvalidDateRange(){
        let options = {
            title: "Invaid Date Range...",
            message: "Start date must be less than or the same as end date."
        };

        this.dispatchEvent( getWarningToast(options) );
    }

/**
 * UTILITY FUNCS
 */

    /**
     * @function setDate
     * @description shows warning toast to user that the date range is invalid
     * @param {string} dateKey - key of date range object either startDate or endDate
     * @param {string} dateString - formatted date string
     * @returns {void}
     */
    setDate( dateKey, dateString ){
        this.dateRange[dateKey] = dateString ? new Date( dateString ) : null;

        if( this.hasBothDates ){ this.fireDateChanged(); }
    }

    /**
     * @function resetDateRange
     * @description resets the 'this' date range object to that of the default
     * @returns {void}
     */
    resetDateRange(){
        this.dateRange = {...dateRange};
    }

    /**
     * @function isInvalidDateRange
     * @description if the date range has both dates but the start date is greater than the end date then the date range is invalid
     * @returns {boolean}
     */
    isInvalidDateRange(){
        return this.hasBothDates && this.dateRange.startDate > this.dateRange.endDate;
    }

    /**
     * @function handleKeyPress
     * @description prevents users from manually entering dates
     * @param {KeyboardEvent}
     * @returns {void}
     */
    handleKeyPress(event){
        event.preventDefault();
    }
}