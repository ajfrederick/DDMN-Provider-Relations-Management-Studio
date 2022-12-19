/**
 * Utilizes PrmsPaginatorFilterEmail and extends Paginator to assmeble query strings so Provider Relation Mass Email records can be delivered to Provider Relations Management Studio front end.
 * 
 * @see Paginator
 * @see PrmsPaginatorFilterEmail
 * 
 * @author Joel Comfort (March 2022)
 * @author Andrew Frederick (December 2022)
 */
public with sharing class PrmsPaginatorEmail extends Paginator {

    public PrmsPaginatorEmail( PrmsPaginatorFilterEmail filter ) {
        super(filter);
    }

    protected override String getSOQLString(){
        
        String q = 'SELECT ';
                q += 'Id, ';
                q += 'Message_Rich_Text__c, ';
                q += 'Message_Plain_Text__c, ';
                q += 'Attachment_Names__c, ';
                q += 'Subject__c, ';
                q += 'CreatedDate, ';
                q += 'CreatedBy.Name ';
                    q += 'FROM Provider_Relations_Mass_Email__c ';
                    q += filter.getFilterCriteria();

        return q;
    }

    protected override String getSOSLString(){

        String q = 'FIND \'' + filter.getSearch() +'\' IN ALL FIELDS ';
                q += 'RETURNING Provider_Relations_Mass_Email__c(';
                    q += 'Id, ';
                    q += 'Message_Rich_Text__c, ';
                    q += 'Message_Plain_Text__c, ';
                    q += 'Attachment_Names__c, ';
                    q += 'Subject__c, ';
                    q += 'CreatedDate, ';
                    q += 'CreatedBy.Name ';
                    q += filter.getFilterCriteria();
                q += ')';
        
        return q;
    }

    protected override String getSOQLCountString(){
        
        String q = 'SELECT ';
                q += 'count() ';
                    q += 'FROM Provider_Relations_Mass_Email__c ';
                    q += filter.getWhere();

        return q;
    }

    protected override String getSOSLCountString(){

        String q = 'FIND \'' + filter.getSearch() +'\' IN ALL FIELDS ';
                q += 'RETURNING Provider_Relations_Mass_Email__c(';
                    q += 'Id ';
                    q += filter.getWhere();
                q += ')';
        
        return q;
    }
}