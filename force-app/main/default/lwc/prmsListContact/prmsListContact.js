/**
 * @name PrmsListContact
 * 
 * @description list comp for Provider Relations Management Studio for contact records to be selected as email recipients. found in contact record container comp.
 * 
 * @author Andrew Frederick 
 * @author Joel Comfort
 * 
 * @date December 2022 
 * 
 * @see RecordContainerList
 */

/**
 * IMPORTS
 */

import RecordContainerList from 'c/recordContainerList';
import {log} from 'c/utils';

/**
 * COMP VARS
 */

/**
 * @name columns
 * @description default list of column headers for table 
 * @type {Array}
 */
const columns = ['Name', 'Title', 'Account', 'Email', 'Phone'];

/**
 * CLASS
 */

export default class PrmsListContact extends RecordContainerList {
  
/**
 * PROPS
 */

    /**
     * @name columns
     * @description list of column headers for table 
     * @type {Array}
     */
    columns = columns;

    /**
     * @name allSelected
     * @description dynamic value of the select all checkbox in header row.
     * @type {boolean}
     */
    get allSelected(){
        return this.records.filter( record => record.selected ).length == this.records.length;
    }

/**
 * DOM EVENT HANDLERS
 */

    /**
     * @function handleSelect
     * @description handles when checkbox is clicked to select a contact as email recipient. Emits change to record container comp.
     * @param {MouseEvent} e 
     */
    handleSelect(e){
        let checked = e.target.checked,
            selectionChangedId = e.target.dataset.recordId;

        this.dispatchSelection( [selectionChangedId], checked );
    }

    /**
     * @function handleSelectAll
     * @description handles when select all checkbox in header row is clicked to select all contacts in list as email recipients. Emits change to record container comp.
     * @param {MouseEvent} e 
     */
    handleSelectAll(e){
        let checked = e.target.checked, 
            selectionChangedIds = [];

        // get the records that aren't already selected
        this.records.map(( record )=>{
            if( record.selected != checked ){ selectionChangedIds.push(record.Id); }
        });

        this.dispatchSelection( selectionChangedIds, checked );
    }

    /**
     * @function dispatchSelection
     * @description depending on if we are adding or removing we need to dispatch the actual record or just it's Id respectively. captured in message
     * composer comp.
     * 
     * @param {Array<string>} selectionChangedIds 
     * @param {boolean} checked 
     * 
     * @see PrmsMessageComposer
     */
    dispatchSelection( selectionChangedIds, checked ){

        if( checked ){
            let selection = this.records.filter( record => selectionChangedIds.includes(record.Id) );

            this.dispatchAdd( selection );
        } else {
            this.dispatchRemoved( selectionChangedIds );
        }
    }
    
    /**
     * @function dispatchAdd
     * @description emits list of records as added. captured in message
     * composer comp.
     * @param {Array<Object>} selection
     * @see PrmsMessageComposer
     */
    dispatchAdd( selection ){

        let event = new CustomEvent( 'added' , {
            bubbles: true,
            composed: true,
            detail: selection
        });

        this.dispatchEvent(event);
    }

    /**
     * @function dispatchRemoved
     * @description emits list of records as removed. captured in message
     * composer comp.
     * @param {Array<string>} selectionIds 
     * @see PrmsMessageComposer
     */
    dispatchRemoved( selectionIds ){

        let event = new CustomEvent( 'removed' , {
            bubbles: true,
            composed: true,
            detail: selectionIds
        });

        this.dispatchEvent(event);
    }
}