/**
 * @name PrmsListEmail
 * 
 * @description list comp for Provider Relations Management Studio for email records on main page. found in email record container comp.
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
 * CLASS
 */

export default class PrmsListEmail extends RecordContainerList {

/**
 * DOM EVENT HANDLERS
 */

   /**
    * @function handleEmailClick
    * @description user clicks email row in list and emits email clicked. captured in App comp.
    * @param {MouseEvent} e 
    * @see PrmsApp
    */
   handleEmailClick(e){
      const emailId = e.currentTarget.dataset.id,
            selectedEmail = this.records.find(record => record.Id == emailId);

      let event = new CustomEvent( 'emailclick', {
         bubbles: true,
         composed: true,
         detail: selectedEmail
      });            

      this.dispatchEvent( event );  
   }
}