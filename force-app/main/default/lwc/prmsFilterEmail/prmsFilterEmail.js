/**
 * @name PrmsFilterEmail
 * 
 * @description filter comp for Provider Relations Management Studio for email record conatiner component. Extends PrmsFilter
 * 
 * @author Andrew Frederick 
 * @author Joel Comfort
 * 
 * @date December 2022 
 * 
 * @see RecordContainerFilter
 */

/**
 * IMPORTS
 */

import RecordContainerFilter from 'c/recordContainerFilter';
import { log } from 'c/utils';

/**
 * CLASS
 */

export default class PrmsFilterEmail extends RecordContainerFilter {

/**
 * DOM EVENT HANDLERS
 */

    /**
     * @name handleDateChange
     * 
     * @description handles the date change event from the date range picker then emits a filter change. Event
     * caught in record container component.
     * 
     * @param {CustomEvent} event 
     * @returns {void}
     * 
     * @see DateRangePicker
     * @see RecordContainer
     */
    handleDateChange(event){
        let emailFilter = {
            dateRange : event.detail
        };

        this.dispatchUniqueFilterChange( 'emailFilter', emailFilter ); 
    }
}