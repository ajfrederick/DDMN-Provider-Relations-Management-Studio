public class PaginatorDateRange {

    public String startDate {get;set;}
    public String endDate {get;set;}

    @AuraEnabled
    public static string getDateRangeDefinition(){
        return JSON.serialize( new PaginatorDateRange() );
    }
}