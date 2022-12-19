/**
 * @name PrmsMainPage
 * 
 * @description list comp for each set of records. always found in a record container comp.
 * 
 * @author Andrew Frederick 
 * @author Joel Comfort
 * 
 * @date December 2022 
 */

/**
 * IMPORTS
 */

import { LightningElement } from 'lwc';

/**
 * CLASS
 */

export default class PrmsMainPage extends LightningElement {
    
    /**
     * @name handleNewMessageClick
     * @description emits message click when users clicks on '+' icon. caught in App comp.
     * @see PrmsApp
     */
    handleNewMessageClick(){
        this.dispatchEvent( new CustomEvent( 'newmessageclick' ) );
    }
}