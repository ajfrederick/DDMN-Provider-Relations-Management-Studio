/**
 * @name SelectionCart
 * 
 * @description cart for any type of selection list.
 * 
 * @author Andrew Frederick 
 * @author Joel Comfort
 * 
 * @date December 2022 
 */

/**
 * IMPORTS
 */

import { LightningElement, api } from 'lwc';
import { log } from 'c/utils';
import { NavigationMixin } from 'lightning/navigation';

/**
 * COMP VARS
 */

const baseUrl = window.location.origin;
const iconStyle = 'cart-icon slds-grid slds-grid_horizontal slds-grid_vertical-align-end';
const hiddenClass = 'drop-down-hidden';

/**
 * @name timeOutId
 * @description debouncing for selection and icon 'pump'. If mulitple selected we don't need the icon jiggling.
 * @type {number}
 */
let timeOutId = null;

/**
 * @name dropDownEl
 * @description drop down element that is set by query selector on icon click. Scoped here so that we can set a click listener on
 * the document and it will hide this element.
 * @type {HTMLDivElement}
 */
let dropDownEl = null;

/**
 * CLASS
 */

export default class SelectionCart extends  NavigationMixin(LightningElement) {

/**
 * PROPS
 */

    /**
     * @name records
     * @description sets the records that have been selected then 'pumps' the icon notifying the user that a selection has been made.
     * @type {Array<Object>}
     */
    _records = [];

    @api 
    get records(){
        return this._records;
    } 
    set records( records ){
        this.iconPump( this.records.length, records.length );
        this._records = records;
    }

    /**
     * @name hasRecords
     * @description utilized in mark up which either displays the list of records of a 'please make selection' notifier.
     * @type {boolean}
     */
    get hasRecords(){
        return this.records.length > 0;
    }

    /**
     * @name dropDownHidden
     * @description if the drop down is hidden show it otherwise hide it.
     * @type {boolean}
     */
    get dropDownHidden(){
        return dropDownEl.classList.contains(hiddenClass);
    }

    /**
     * @name iconStyle
     * @description dynamic style for icon 'pump'
     * @type {string}
     */
    iconStyle = iconStyle;

/**
 * LIFECYCLE HOOKS
 */

    /**
     * @description sets dropDownEl to null so next time we connect we gether the right reference to the right
     * element when toggle occurs.
     */
    disconnectedCallback(){
        dropDownEl = null;
    }

/**
 * DOM EVENT HANDLERS
 */
    
    /**
     * @function toggleDropDown
     * @description when icon is clicked toggles class on drop down element.
     * @param {MouseEvent} e 
     */
    toggleDropDown(e) {

        if( dropDownEl == null ){
            dropDownEl = this.template.querySelector('.drop-down');
        }

        if( this.dropDownHidden ){
            dropDownEl.classList.remove(hiddenClass);
            document.addEventListener('click', handleDocClick);
        } else {
            dropDownEl.classList.add(hiddenClass);
            document.removeEventListener('click', handleDocClick);
        }

        e.stopPropagation();
    }

    /**
     * @function remove
     * @description on 'x' click in drop down list emits event with record Id to remove from a list.
     * @param {MouseEvent} e 
     */
    remove(e){
        this.dispatchRemoval( [e.target.dataset.recordId] );

        e.stopPropagation();
    }
    
/**
 * EVENT EMITTERS
 */

    /**
     * @function dispatchRemoval
     * @description emits event with an array of record Ids that were removed 
     * @param {Array<string>} removedIds 
     */
    dispatchRemoval( removedIds ){
        let options = {
            bubbles: true,
            detail: removedIds
        };

        let event = new CustomEvent( 'removed', options );

        this.dispatchEvent(event);
    }

/**
 * UTILITY FUNCS
 */

    /**
     * @function iconPump
     * @description momentaeily increases or decreases the size of cart icon when a record is added or removed.
     * @param {*} oldCount 
     * @param {*} newCount 
     * @returns {void}
     */
    iconPump( oldCount, newCount ){
        if( oldCount == newCount ){ return; }

        this.iconStyle += oldCount > newCount ? ' record-decrease' : ' record-increase';

        const later = () => {
            this.iconStyle = iconStyle;
            timeOutId = null;
        };

        clearTimeout(timeOutId);

        timeOutId =  setTimeout(later, 200); 
    }

/**
 * NAVIGATION FUNCS
 */

    /**
     * @function navToRecordView
     * @description brings user to view record that is in cart
     * @param {MouseEvent} e 
     */
    navToRecordView(e){
        let url = window.location.href,
            recordId = e.target.dataset.recordId;

        if( url.includes( 'lightning' ) ) {
            this.openUrlInLightning( recordId, url );
        } else {
            this.openUrlInClassic( recordId );
        }
    }

    /**
     * @function navToRecordView
     * @description brings user to view record in Lightning that is in cart
     * @param {string} id - record Id
     * @param {URL} url - current location
     */
    openUrlInLightning( id, url ) {

        this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                recordId: id,
                objectApiName: 'Record',
                actionName: 'view'
            }
        }).then(url => {
            window.open( url, '_blank' );
        });
    }

    /**
     * @function openUrlInClassic
     * @description brings user to view record in classis that is in cart
     * @param {string} id - record Id 
     */
    openUrlInClassic( id ) {
        let url = baseUrl + '/' + id;
        
        window.open( url, '_blank' );
    }
}

/**
 * COMP FUNCS
 */

/**
 * @function handleDocClick
 * @description when the drop down for cart is shown document gets this as click event handler to hide drop down on 'any'
 * click
 */
const handleDocClick = ()=>{
    dropDownEl.classList.add(hiddenClass);
    document.removeEventListener('click', handleDocClick);
}