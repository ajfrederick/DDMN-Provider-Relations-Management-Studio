/**
 * @name MessageAttachment
 * @description Represents a new attachment in a message composer
 * @author Andrew Frederick 
 * @date July 2021
 */

/**
 * IMPORTS
 */ 

import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

/**
 * CLASS
 */ 

export default class MessageAttachment extends NavigationMixin(LightningElement) {

/**
 * PROPS
 */

    /**
     * @name attachment
     * @description object injected via attribute from message attachments comp.
     * @type {Object}
     */
    @api attachment;

    /**
     * @name isNew
     * @description flags whether or not the message comp is a new message or displaying an old message to display certain mark up.
     * @type {boolean}
     */
    @api isNew = false;

    /**
     * @name deleteClass
     * @description class the determines whether to display a delete button
     * @type {string}
     */
    deleteClass = 'delete-attachment';

    /**
     * @name iconName
     * @description uses array file extensions below to determine what kind of icon to use depending on the doc type
     * @type {string}
     */
    get iconName(){
        let ret = 'doctype:attachment';

        for( let i = 0; i < fileExtensions.length; i++ ){
            let extensions = fileExtensions[i].extensions,
                _iconName = fileExtensions[i].iconName,
                shouldBreak = false;
            
            for( let ii = 0; ii < extensions.length; ii++ ){
                let extension = extensions[ii];

                if( this.attachment.FileExtension === extension ){
                    ret = _iconName;
                    shouldBreak = true;
                    break;
                }
            }

            if( shouldBreak ) break;
        }

        return ret;
    }

/**
 * DOM EVENTS
 */

    /**
     * @name preview
     * @description when `<lightning-icon/>` within .message-attachment is clicked
     * this method calls the Navigate api which navigates to the filePreview page giving a preview
     * of the attachment.
     */
    preview(){
        if( this.isNew ) return;
        
        this[NavigationMixin.Navigate]({
            type : 'standard__namedPage',
            attributes : {
                pageName : 'filePreview'
            },
            state : {
                selectedRecordId : this.attachment.ContentDocumentId
            }
        });
    }

    /**
     * @name showDelete
     * @description when the mouse goes over .message-attachment this method displays the 'x' icon
     * on the attachment icon which is used to delete the attatchment on the current message that is being drafted.
     */
    showDelete(){
        this.deleteClass += ' displayed';
    }

    /**
     * @name hideDelete
     * @description when the mouse goes out of .message-attachment this method removes the 'x' icon from the
     * attachment icon.
     */
    hideDelete(){
        this.deleteClass = 'delete-attachment';
    }

    /**
     * @name deleteAttachment
     * @description when clicking .delete-attachment-icon this method gets the attachment's title and creates/dispatches the
     * custom event attachmentdeleted.
     */
    deleteAttachment(){
        let detail = {
            Title : this.attachment.Title    
        };

        this.dispatchEvent( new CustomEvent( 'attachmentdeleted', {
            detail : detail,
            bubbles : true,
            composed: true
        }));
    }
}

/**
 * COMP VARS
 */

/**
 * @name fileExtensions
 * @desciption an array of objects that hold a lightning icon name value and it's associated file extension
 */
const fileExtensions = [
    {
        extensions : ['pdf'],
        iconName : 'doctype:pdf'
    },
    {
        extensions : ['html'],
        iconName : 'doctype:html'
    },
    {
        extensions : ['xml'],
        iconName : 'doctype:xml'
    },
    {
        extensions : ['txt'],
        iconName : 'doctype:txt'
    },
    {
        extensions : ['doc', 'docx'],
        iconName : 'doctype:word'
    },
    {
        extensions : ['xls','xlsx'],
        iconName : 'doctype:excel'
    },
    {
        extensions : ['csv'],
        iconName : 'doctype:csv'
    },
    {
        extensions : ['png','jpg','tiff','gif'],
        iconName : 'doctype:image'
    },
    {
        extensions : ['mp3','wav','aiff','aac', 'm4a','flac'],
        iconName : 'doctype:audio'
    },
    {
        extensions : ['zip'],
        iconName : 'doctype:zip'
    },
];