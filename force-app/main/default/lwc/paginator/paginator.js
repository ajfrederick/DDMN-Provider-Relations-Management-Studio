/**
 * @name Paginator
 * 
 * @description With user input decrements or increments a page counter and emits the change. 
 * .
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

/**
 * COMP VARS
 */

const MARGIN_RIGHT = 'slds-m-right_xx-small';
const MARGIN_LEFT = 'slds-m-left_xx-small';

const ACTIVE = 'pagination-button';
const INACTIVE = 'pagination-button-disabled';

/**
 * CLASS
 */

export default class Paginator extends LightningElement {

/**
 * PROPS
 */

    /**
     * @name firstStyle
     * @description style class for the 'first' button
     * @type {string}
     */
    get firstStyle(){
        return this.canPrevious ? ACTIVE : INACTIVE;
    }

    /**
     * @name previousStyle
     * @description style class for the 'previous' button
     * @type {string}
     */
    get previousStyle(){
        let style = this.canPrevious ? ACTIVE : INACTIVE;

        return style + ' ' + MARGIN_RIGHT;
    }

    /**
     * @name nextStyle
     * @description style class for the 'next' button
     * @type {string}
     */
    get nextStyle(){
        let style = this.canNext ? ACTIVE : INACTIVE;

        return style + ' ' + MARGIN_LEFT;
    }

    /**
     * @name lastStyle
     * @description style class for the 'last' button
     * @type {string}
     */
    get lastStyle(){
        return this.canNext ? ACTIVE : INACTIVE;
    }

    /**
     * @name canPrevious
     * @description determines whether or not the paginator can decrement page
     * @type {boolean}
     */
    get canPrevious() {
        return this.currentPage > 1;
    }

    /**
     * @name canNext
     * @description determines whether or not the paginator can increment page
     * @type {boolean}
     */
    get canNext() {
        return this.currentPage < this.totalPages;
    }

    /**
     * @name totalPages
     * @description calculates the total number of pages
     * @type {number}
     */
    get totalPages(){
        return this.totalRecordCount && this.recordLimit ? Math.ceil(this.totalRecordCount/this.recordLimit) : 0;
    }

    /**
     * @name totalRecordCount
     * @description total numnber of records that can be paged through delivered by parent component
     * @type {number}
     */
    @api totalRecordCount = 0;
    
    /**
     * @name recordLimit
     * @description total records to be displayed in one page
     * @type {number}
     */
    @api recordLimit = 0;
    
    /**
     * @name currentPage
     * @description the current page the paginator is on. Can be set by parent component typically back to page 1 if a
     * call has been made that deilvers a new set of records to page through
     * @type {number}
     */
    _currentPage = 1;

    @api
    get currentPage(){

        if( this.totalPages <= 0 ){
            return 0;
        }

        return this._currentPage;
    };
    set currentPage( value ){
        this._currentPage = value;
    }

/**
 * EVENT HANDLERS
 */
    
    /**
     * @function handleFirstClick
     * @description sets to first page when first button is clicked and emits page turn event
     */
    handleFirstClick() {
        this.currentPage = 1;
        this.dispatchPageTurn();
    }

    /**
     * @function handlePreviousClick
     * @description decrements page when previous button is clicked and emits page turn event
     */
    handlePreviousClick() {
        this.currentPage--;
        this.dispatchPageTurn();
    }

    /**
     * @function handleNextClick
     * @description increments page when next button is clicked and emits page turn event
     */
    handleNextClick() {
        this.currentPage++;
        this.dispatchPageTurn();
    }

    /**
     * @function handleLastClick
     * @description set page to total pages or last page when last button is clicked and emits page turn event
     */
    handleLastClick() {
        this.currentPage = this.totalPages;
        this.dispatchPageTurn();
    }

/**
 * UTIL METHODS
 */ 

    /**
     * @function dispatchPageTurn
     * @description emits page turn event
     */
    dispatchPageTurn(){
        let event = new CustomEvent('pageturn', {
            detail : {
                currentPage : this.currentPage
            }
        });

        this.dispatchEvent(event);
    }
}