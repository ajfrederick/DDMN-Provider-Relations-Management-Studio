/**
 * @name PrmsListCase
 * 
 * @description list comp for Provider Relations Management Studio for case records for each Provider Relations Mass Email record. found in case record container comp.
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

import { NavigationMixin } from 'lightning/navigation';
import RecordContainerList from 'c/recordContainerList';
import {log} from 'c/utils';

/**
 * COMP VARS
 */

/**
 * @name baseUrl
 * @description for navigation in Classic
 * @type {url}
 */
const baseUrl = window.location.origin;

/**
 * @name columns
 * @description default list of column headers for table 
 * @type {Array}
 */
const columns = ['Case Number', 'Recipient', 'Status', 'Email'];

/**
 * CLASSES
 */

export default class PrmsListCase extends NavigationMixin(RecordContainerList) {

    /**
     * @name columns
     * @description list of column headers for table 
     * @type {Array}
     */
    columns = columns;

    /**
     * @name handleCaseClick
     * @description when a user clicks on a row navigates to case record page
     * @param {MouseEvent} e 
     */
    handleCaseClick(e){
        this.navigateToRecordViewPage(e.target.dataset.id);
    }

    /**
     * @name handleCaseClick
     * @description when a user clicks on a row navigates to case record page
     * @param {string} recordId
     */
    navigateToRecordViewPage(recordId) {
        let url = window.location.href;

        if( url.includes( "lightning" ) ) {
            this.openUrlInLightning( recordId, url );
        } else {
            this.openUrlInClassic( recordId );
        }
    }

    /**
     * @name openUrlInLightning
     * @description navaigates in Lightning
     * @param {string} recordId
     */
    openUrlInLightning( recordId, url ) {

        this[NavigationMixin.GenerateUrl]({
            type: "standard__recordPage",
            attributes: {
                recordId: recordId,
                objectApiName: 'Case',
                actionName: 'view'
            }
        }).then(url => {
            window.open( url, "_blank" );
        });
    }

    /**
     * @name openUrlInClassic
     * @description navaigates in Classic
     * @param {string} recordId
     */
    openUrlInClassic( recordId ) {
        let url = baseUrl + '/' + recordId;
        window.open( url, "_blank" );
    }
}