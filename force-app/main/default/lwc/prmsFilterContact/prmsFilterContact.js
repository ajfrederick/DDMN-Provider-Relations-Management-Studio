/**
 * @name PrmsFilterContact
 * 
 * @description filter comp for Provider Relations Management Studio for contact record conatiner component. Extends PrmsFilter.
 * 
 * @author Andrew Frederick 
 * @author Joel Comfort
 * 
 * @date December 2022 
 * 
 * @see RecordContainerFilter
 */

/**
 * IMPORTS
 */

import { wire } from 'lwc';
import RecordContainerFilter from 'c/recordContainerFilter';
import { reduceErrors, log } from 'c/utils';
import getTitleOptions from '@salesforce/apex/PrmsPaginatorFilterContact.getTitleOptions';
import getNetworkOptions from '@salesforce/apex/PrmsPaginatorFilterContact.getNetworkOptions';

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

export default class PrmsFilterContact extends RecordContainerFilter {

/**
 * PROPS
 */

    /**
     * @name networkOptions
     * @description list of networks for select list. Filled by wire method directly below
     * @type {Array<Object>}
     */
    networkOptions = [{
        label : '',
        value: ''
    }];

    /**
     * @function wiredNetworkOptions
     * @description upon comp being loaded into DOM makes a call to PrmsPaginatorFilterContact.cls for network options.
     * @return {void}
     */
    @wire(getNetworkOptions)
    wiredNetworkOptions({error, data}){
        this.networkOptions = [...this.networkOptions, ...getOptions(error, data)];
    }

    /**
     * @name titleOptions
     * @description list of provider titles for select list.
     * @type {Array<Object>}
     */
    titleOptions = [{
        label : '',
        value: ''
    }];

    /**
     * @function wiredNetworkOptions
     * @description upon comp being loaded into DOM makes a call to PrmsPaginatorFilterContact.cls fort title options.
     * @return {void}
     */
    @wire(getTitleOptions) 
    wiredTitleOptions({error, data}){
        this.titleOptions = [...this.titleOptions, ...getOptions(error, data)];
    }

/**
 * DOM EVENT HANDLERS
 */


    /**
     * @name handleTitleChange
     * @description when a title in option is selected emits filter change event caught in record container comp.
     * @param {ChangeEvent} e 
     */
    handleTitleChange(e){
        let contactFilter = {
            title : e.target.value ? e.target.value : null
        };

        this.dispatch( contactFilter );
    }

    /**
     * @name handleNetworkChange
     * @description when a network in option is selected emits filter change event caught in record container comp.
     * @param {ChangeEvent} e 
     */
    handleNetworkChange(e){
        let contactFilter = {
            networkId : e.target.value ? e.target.value : null
        };

        this.dispatch( contactFilter );
    }

    /**
     * @name handleNetworkChange
     * @description captures search change from county DOM input and emits a filter change event to record container comp.
     * @param {KeyboardEvent} e 
     */
    handleCountyChange(e){
        const search = e.target.value;

        const later = () => {
            timeOutId = null;

            // SOSL doesn't like search values with only 1 character
            let contactFilter = {
                county : search.length === 1 ? null : search
            };

            if( contactFilter.county === null ){ return };

            this.dispatch( contactFilter );
        };

        clearTimeout(timeOutId);
        
        timeOutId =  setTimeout(later, 200);
    }

    /**
     * @name handleFQHCChange
     * @description when FQHC is checked emits filter change event to record container comp.
     * @param {MouseEvent} e 
     */
    handleFQHCChange(e){
        let contactFilter = {
            fqhc : e.target.checked
        };

        this.dispatch( contactFilter );
    }

    /**
     * @name handleFQHCChange
     * @description when CAD is checked emits filter change event to record container comp.
     * @param {MouseEvent} e 
     */
    handleCADChange(e){
        let contactFilter = {
            cad : e.target.checked
        };

        this.dispatch( contactFilter );
    }

/**
 * EVENT EMITTERS
 */

    /**
     * @name dispatch
     * @description emits a filter change event and which is caught in record container comp. Utilizes change event that changes filter 
     * that is unique to this filter comp extension.
     * @param {Object} contactFilter 
     * 
     * @see RecordContainer
     */
    dispatch( contactFilter ){
        this.dispatchUniqueFilterChange( 'contactFilter', contactFilter );
    }
}

/**
 * COMP FUNCS
 */

/**
* @name getOptions
* @description checks the options list for errors and returns the parsed options if there are no errors
* @param {Object} error 
* @param {Array} options 
* @returns {Array} an array of select list option
*/
function getOptions( errors, options ){
    let optionsParsed = [];

    if( errors ){
        console.error(reduceErrors(errors));
    } else
    if( options ){
        optionsParsed = JSON.parse(options);
    } else {
        console.warn('Wired options for either title or network options list equal: ' + options);
    }

    return optionsParsed;
}