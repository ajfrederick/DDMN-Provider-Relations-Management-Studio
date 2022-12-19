/**
 * @name PrmsApp
 * 
 * @description the Provider Relations Managment Studio Application parent most component
 * .
 * @author Andrew Frederick 
 * @author Joel Comfort
 * 
 * @date December 2022 
 */

/**
 * IMPORTS
 */

import { LightningElement } from 'lwc';
import noHeader from '@salesforce/resourceUrl/NoHeader';
import {loadStyle} from "lightning/platformResourceLoader";

/**
 * CLASS
 */

export default class PrmsApp extends LightningElement {

/**
 * PROPS
 */

    /**
     * @name showMainPage
     * @description if true main page comp is displayed
     * @type {boolean}
     */
    get showMainPage(){
        return !this.showMessageViewer && !this.showMessageComposer;
    }

    /**
     * @name showMessageViewer
     * @description if true message viewer comp is displayed
     * @type {boolean}
     */
    showMessageViewer = false;

    /**
     * @name showMessageComposer
     * @description if true message composer comp is displayed
     * @type {boolean}
     */
    showMessageComposer = false;
    
    /**
     * @name containerStyle
     * @description style for component style. Takes on a different value if the application is view in Classic.
     * @type {string}
     */
    containerStyle = "container-lightning";

    /**
     * @name selectedEmail
     * @description email record. Clicked on by user in list and delivered by event from email list then delivered to message viewer.
     * @type {Object}
     */
    selectedEmail;

/**
 * LIFECYCLE HOOKS
 */

    /**
     * @function connectedCallback
     * @description this is to load the app with no header and to determine if the component is being viewed in lightning or not.
     */
    connectedCallback() {
        loadStyle(this, noHeader);

        let url = window.location.href;

        if( !url.includes( "lightning" ) ) {
            this.containerStyle = 'container-classic';
        }
    }

/**
 * DOM EVENT HANDLERs
 */

    /**
     * @function toggleMessageViewer
     * @dsecription displays or closes message viewer based on clicking a message in email list. Event emitted from PrmsListEmail
     * @param {CustomEvent} event 
     * 
     * @see PrmsListEmail
     * @see PrmsMesssageViewer
     */
    toggleMessageViewer(event){
        this.selectedEmail = event ? event.detail : null;
        this.showMessageViewer = !this.showMessageViewer;
    }

    /**
     * @function toggleMessageViewer
     * @dsecription displays or closes message composer based on clicking add symbol in this comp's mark up.
     * 
     * @see PrmsMessageComposer
     */
    toggleMessageComposer(){
        this.showMessageComposer = !this.showMessageComposer;
    }
}