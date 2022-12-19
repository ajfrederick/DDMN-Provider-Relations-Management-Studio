/**
 * @name RecordContainerList
 * @virtual
 * 
 * @description list comp for each set of records. always found in a record container comp.
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
 * CLASS
 */

export default class RecordContainerList extends LightningElement {

/**
 * PROPS
 */

    /**
     * @name records
     * @description list of records delivered by record conainer comp after query.
     * @type {Array}
     */
    @api records = [];

    /**
     * @function handleSortClick
     * @description handles a click event on header row of list. each cloumn is indexed. the index is matched to an 'Order By' in a record container comp. Emits
     * a sort change event with the index. The record container comp catches the index and then uses it's order by list to change the order by in its query filter.
     * @param {MouseEvent} e 
     */
    handleSortClick(e){
        let orderByIndex = e.currentTarget.dataset.orderBy;
        
        let event = new CustomEvent( 'sortchange', {detail : orderByIndex} );

        this.dispatchEvent( event );
    }
}