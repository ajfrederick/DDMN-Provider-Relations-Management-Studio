/**
 * @name PrmsMessageViewer
 * 
 * @description diplays email and list of cases when a user clicks on email on main page.
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

/**
 * COMP VARS
 */

/**
 * @name viewerStyle
 * @description default style for entire message viewer conataining div.
 * @type {string}
 */
const viewerStyle = "slds-grid slds-grid_align-space slds-grid_vertical slds-p-around_medium view-container";

/**
 * CLASS
 */

export default class PrmsMessageViewer extends LightningElement {

/**
 * PROPS
 */

    /**
     * @name viewerStyle
     * @description dynamic style class for viewer for animation.
     * @type {string}
     */
    viewerStyle = viewerStyle + " slide-in";

     /**
     * @name emailBody
     * @type {string}
     */
    emailBody;

     /**
     * @name emailSubject
     * @type {string}
     */
    emailSubject;

     /**
     * @name attachments
     * @description string of assembled attachment names. attachment names are stored on email record but not attachments themselves.
     * @type {string}
     */
    attachments;

    /**
     * @name selectedEmail
     * @description email data that was selected in main page comp and delivered by app comp.
     * @type {Objects}
     * 
     * @see PrmsMainPage
     * @see PrmsApp
     */
    _selectedEmail;

    @api 
    get selectedEmail(){
        return this._selectedEmail;
    }
    set selectedEmail(email) {
        
        this.emailBody = email.Message_Rich_Text__c;
        this.emailSubject = email.Subject__c;
        
        if( email.Attachment_Names__c != undefined ){
            this.attachments = email.Attachment_Names__c.split(" ");
        }

        this._selectedEmail = email;
    }
    
/**
 * DOM EVENT HANDLERS
 */

    /**
     * @function handleCloseClick
     * @description changes viewer style for animation and emits a close event caught in app comp.
     * @see PrmsApp
     */
    handleCloseClick(){
        this.viewerStyle = viewerStyle + " slide-out";
       
        let event = new CustomEvent( 'close', {
            bubbles: true
         });

        setTimeout(() => {
            this.dispatchEvent( event );
        }, "500");
    }
}