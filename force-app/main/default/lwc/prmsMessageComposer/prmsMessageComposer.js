/**
 * @name PrmsMessageComposer
 * 
 * @description comp that aids in selecting contacts for email recipients and composing and sending emails.
 * 
 * @author Andrew Frederick 
 * @author Joel Comfort
 * 
 * @date December 2022 
 */

/**
 * IMPORTS
 */

import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getEmailDefinition from '@salesforce/apex/PrmsCore.getEmailDefinition';
import sendEmails from '@salesforce/apex/PrmsUiService.sendEmails';
import { log } from 'c/utils';

/**
 * COMP VARS
 */

/**
 * @name messageComposerStyle
 * @description class style to dynamically show or hide composer
 * @type {string}
 */
const messageComposerStyle = "slds-grid slds-grid_align-space slds-grid_vertical slds-p-around_medium composer-style";

/**
 * @name email
 * @description shaped definied in PrmsCore.cls so the backend will always be delivered predictable and valid data.
 * @type {Object}
 */
let email;

/**
 * CLASS
 */

export default class PrmsMessageComposer extends LightningElement {

/**
 * PROPS
 */

    /**
     * @name email
     * @description shaped definied in PrmsCore.cls.
     * @type {Object}
     */
    @track email = {};

    /**
     * @name recipientsSelected
     * @descrption used to move UI from contact select list to actual message composer 
     * @type {boolean}
     */
    recipientsSelected = false;
    
    /**
     * @name messageComposerStyle
     * @description adds animation style to composer
     * @type {string}
     */
    messageComposerStyle = messageComposerStyle + " slide-right";

/**
 * LIFECYCLE HOOKS
 */

    connectedCallback(){
        this.email = {...email};
    }  

/**
 * DOM EVENT HANDLERS
 */

    handleSendClick() {
        let payload = JSON.stringify(this.email);
            
        sendEmails( {payload} )
            .then(result => {
                this.recipientsSelected = false;
                this.emailsSentToast( numRecipients, JSON.parse(result) );
                this.dispatchClose();
            })
            .catch(error =>{
                this.emailsSendFailureToast();
                this.dispatchClose();
            });  
    }

    handleEmailSubjectChange(e){
        this.email.subject = e.detail.value;
    }

    handleEmailMessageBodyChange(e){
        this.email.messageBody = e.detail.value;
    }

    handleCancelClick(){
        this.messageComposerStyle = messageComposerStyle + " slide-out";

        setTimeout(() => {
            this.dispatchClose();
        }, 500);
    }

    handleNextClick(){
        this.recipientsSelected = true;
        this.messageComposerStyle = messageComposerStyle + " slide-right-2";
    }

    handleBackClick(){
        this.recipientsSelected = false;
        this.messageComposerStyle = messageComposerStyle + " slide-left";
    }

/**
 * CUSTOM EVENT HANDLERS
 */

    handleContactsAdded(e){
        this.email.recipients = [...this.email.recipients, ...e.detail];
    }

    handleContactsRemoved( e ){
        let removedIds = e.detail,
            recipients = this.email.recipients.filter( recipient => !removedIds.includes(recipient.Id) );       

        this.email.recipients = [...recipients];
    }

    handleAttachmentAdded(e){
        this.email.attachments.push(e.detail);
    }

    handleAttachmentDeleted(e){
        this.email.attachments = this.email.attachments.filter( attachment => attachment.Title != e.detail.Title );
    }

/**
 * EVENT EMITTERS
 */

    dispatchClose(){
        let event = new CustomEvent( 'close', {
            bubbles: true,
            composed: true
        });

        this.dispatchEvent( event );
    } 

    emailsSentToast( emailCount ) {
        const event = new ShowToastEvent({
            title: emailCount + " emails have been sent!",
            variant: "success"
        });

        this.dispatchEvent(event);
    }

    emailsSendFailureToast() {
        const event = new ShowToastEvent({
            title: "Oops! Something went wrong...",
            message: "Emails failed to send.",
            variant: "error"
        });

        this.dispatchEvent(event);
    }
}

/**
 * COMP FUNCS
 */

(function(){
    getEmailDefinition().then((emailDefinition)=>{
        email = JSON.parse(emailDefinition);
    });
})();