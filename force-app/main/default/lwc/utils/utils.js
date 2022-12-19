/**
 * @module utils
 * @description various utilities for any LWC application
 * @author Andrew Frederick
 * @date December 2022
 */

/**
 * IMPORTS
 */ 

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

/**
 * FUNCTION DEF FOR EXPORTS
 */

/**
 * @name reduceErrors
 * @description Reduces one or more LDS errors into a string[] of error messages.
 * @param {Response | FetchReponse[]} errors
 * @returns {String[]} - error messages
 */
function reduceErrors(errors) {
    if (!Array.isArray(errors)) {
        errors = [errors];
    }

    return (
        errors
            // Remove null/undefined items
            .filter((error) => !!error)
            // Extract an error message
            .map((error) => {
                // UI API read errors
                if (Array.isArray(error.body)) {
                    return error.body.map((e) => e.message);
                }
                // UI API DML, Apex and network errors
                else if (error.body && typeof error.body.message === 'string') {
                    return error.body.message;
                }
                // JS errors
                else if (typeof error.message === 'string') {
                    return error.message;
                }
                // Unknown error shape so try HTTP status text
                return error.statusText;
            })
            // Flatten
            .reduce((prev, curr) => prev.concat(curr), [])
            // Remove empty strings
            .filter((message) => !!message)
    );
}

/**
 * @name validateFields
 * @description validates fields and returns all valid fields. uses reduce() to get an accumulation of validity from lightning-input
 * @param {Array[]} fields - fields to validate
 * @returns {Array[]} - valid fields
 */
const validateFields = (fields)=>{

    const allValid = [...fields].reduce((validSoFar, input)=>{
        input.reportValidity();
        return validSoFar && input.checkValidity();
    });

    return allValid;
};

/**
 * @name getSuccessToast
 * @description if theres no error messages message gets set to everything went well then returns a new
 * ShowToastEvent custom event with assigned attributes
 * @param {string} message
 * @returns {CustomEvent}
 */
const getSuccessToast = (message)=>{
    if(!message) message = 'Everthing went well.';

    return new ShowToastEvent({
        title : 'Success!',
        message : message,
        variant : 'success'
    });
};

/**
 * @name getWarningToast
 * @description returns a new warning toast event
 * @param {{title:string, message:string}} message - message used in toast
 * @returns {ShowToastEvent} - Lightning toast event
 */
 const getWarningToast = ({title, message})=>{

    if(!title){ title = 'Sorry!'; }

    if(!message){ message = 'We encountered a little bit of trouble.'; }

    return new ShowToastEvent({
        title : title,
        message : message,
        variant : 'warning'
    });
};

/**
 * @name getSuccessToast
 * @description if theres no error messages message gets set to everything went well then returns a new
 * ShowToastEvent custom event with assigned attributes
 * @param {String} message
 * @returns {CustomEvent}
 */
const getErrorToast = (errors)=>{
    const messages = reduceErrors(errors);
    
    let message;

    if( messages.length > 1 ){
        message = messages.join(' | ');
    } else {
        message = messages[0];
    }

    return new ShowToastEvent({
        title : 'Sorry but something went wrong!',
        message : message,
        variant : 'error',
        mode : 'sticky'
    });
};

/**
 * @name log
 * @description logs the proxyObject to console
 * @param {Object} proxyObect
 */
const log = (proxyObect)=>{
    if( proxyObect === undefined ) proxyObect = 'undefined';
    if( proxyObect === null ) proxyObect = 'null';
    
    console.log(JSON.parse(JSON.stringify(proxyObect)));
}

/**
 * @name getDateDiff
 * @description compares two dates and returns the difference between the dates in seconds
 * @param {number} latterDate - latter date to compare in milliseconds
 * @param {number} formerDate - former date to compare in milliseconds
 * @returns {{ }} - 
 */
const getDateDiff = ( latterDate, formerDate )=>{
    
    // date diff in seconds
    let dateDiff = Math.abs(latterDate - formerDate) / 1000;

    // amount of seconds in each time span
    let amountOfSeconds = {
        week: 604800,
        day: 86400,  
        hour: 3600,
        minute: 60,
        second: 1,
    };

    // returned object and total counter
    let difference = { noDiff : false }, total = 0;

    // loop through the amount of seconds and start lopping off each value
    for( let key in amountOfSeconds ){
        difference[key] = Math.floor( dateDiff / amountOfSeconds[key] );
        dateDiff -= difference[key] * amountOfSeconds[key];

        total += difference[key];
    }

    if( total === 0 ){
        difference.noDiff = true;
    }

    return difference;
}

/**
 * EXPORTS
 */ 

export { 
    validateFields, 
    getErrorToast,
    getWarningToast, 
    getSuccessToast, 
    reduceErrors,
    getDateDiff,
    log 
};