trigger PrmsCaseTrigger on Case (after insert) {

    if( Trigger.isAfter && Trigger.isInsert ) {
        PrmsCaseHelper.sendProviderEmails(Trigger.new);
    }
}