/**
 * @name MessageAttachments
 * @description parent component for messageAttachment.js
 * @author Andrew Frederick 
 * @date July 2021
 * @see MessageAttachment
 */

/**
 * IMPORTS
 */ 

import { LightningElement, api } from 'lwc';

/**
 * CLASS
 */ 

export default class MessageAttachments extends LightningElement {

/**
 * PROPS
 */

    /**
     * @name attachmemts
     * @description list of attachemnt delivered by parent component
     * @type {Array}
     */
    @api attachments = [];

    /**
     * @name isNew
     * @description flags whether or not the message comp is a new message or displaying an old message to display certain mark up.
     * @type {boolean}
     */
    @api isNew = false;

    /**
     * @name hasAttachments
     * @description determines whether or not display all markup in comp
     * @type {boolean}
     */
    get hasAttachments(){
        return this.isNew ? true : this.attachments.length > 0;
    }

    /**
     * @name hasErrors
     * @description determines whether or not display error message
     * @type {boolean}
     */
    get hasErrors(){
        return this.errorMessage ? true : false;
    };

    /**
     * @name errorMessage
     * @description message that is displayed if the file size is too large
     * @type {string}
     */
    errorMessage;

/**
 * DOM EVENTS
 */

    /**
     * @name handleAttachment
     * @description when there is a change on `<lightning-input/>` this method zeros out error messages, 
     * checks to see if the file is larger than 5 MB, and reads the attachment file (getting the file extention etc. 
     * and passing that properties into the event detail). Creates/dispatches custom event attached where 
     * handled in newMessageBox.js and gets any errors
     * @param {CustomEvent} event - event fired from messageAttachment.js
    **/
    handleAttachment(event){
        this.setErrorMessage('');

        const file = event.detail.files[0];

        if( largerThan5MB(file.size) ){
            this.setErrorMessage('Attachment cannot exceed 5 MB');
            return;
        }

        let reader = new FileReader();
        
        reader.onload = ()=>{
            let blobData = reader.result.split('base64,')[1],
                fileExtension = file.name.split('.')[1];

            const detail = {
                Title : file.name,
                blobData : blobData,
                FileExtension : fileExtension,
                ContentDocumentId : null
            };

            this.dispatchEvent( new CustomEvent( 'attachmentadd', {detail : detail} ) );
        }
        
        reader.readAsDataURL(file);
    }

    setErrorMessage(message){
        this.errorMessage = message;
    }
}

/**
 * COMP FUNCS
 */

/**
 * @name handleAttachment
 * @description checks to see if a file's size is larger tha 5MB returns true if it is
 * else returns false
 * @param {number} fileSize
 * @returns {boolean}
 **/
function largerThan5MB(fileSize){
    return fileSize > 5000000;
};