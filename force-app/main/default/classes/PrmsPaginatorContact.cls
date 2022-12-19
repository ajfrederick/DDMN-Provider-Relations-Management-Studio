/**
 * Utilizes PrmsPaginatorFilterContact and extends Paginator to assmeble query strings so Contact records can be delivered to Provider Relations Management Studio front end.
 * 
 * @see Paginator
 * @see PrmsPaginatorFilterContact
 * 
 * @author Joel Comfort (March 2022)
 * @author Andrew Frederick (December 2022)
 */
public with sharing class PrmsPaginatorContact extends Paginator {

    private PrmsPaginatorFilterContact contactFilter {get;set;}

    public PrmsPaginatorContact( PrmsPaginatorFilterContact filter ) {
        super(filter);

        this.contactFilter = filter;
    }

    protected override String getSOQLString(){
        
        String q = 'SELECT ';
                q +='Id, ';
                q +='Name, ';
                q +='Provider_Title__c, ';
                q +='AccountId, ';
                q +='Account.Name, ';
                q +='Account.FQHC__c, ';
                q +='Account.CAD__c, ';
                q +='Email, ';
                q +='Phone ';
                    q += 'FROM Contact ';
                    q += filter.getFilterCriteria();

        return q;
    }

    protected override String getSOSLString(){

        String q = 'FIND \'' + filter.getSearch() +'\' IN ALL FIELDS ';
                q += 'RETURNING Contact(';
                    q +='Id, ';
                    q +='Name, ';
                    q +='Provider_Title__c, ';
                    q +='AccountId, ';
                    q +='Account.Name, ';
                    q +='Account.FQHC__c, ';
                    q +='Account.CAD__c, ';
                    q +='Email, ';
                    q +='Phone ';
                        q += filter.getFilterCriteria();
                q += ')';
        
        return q;
    }

    protected override String getSOQLCountString(){
        
        String q = 'SELECT ';
                q += 'count() ';
                    q += 'FROM Contact ';
                    q += filter.getWhere();

        return q;
    }

    protected override String getSOSLCountString(){

        String q = 'FIND \'' + filter.getSearch() +'\' IN ALL FIELDS ';
                q += 'RETURNING Contact(';
                    q +='Id ';
                    q += filter.getWhere();
                q += ')';
        
        return q;
    }

    protected override SObject[] queryRecords( String q ){
        
        Id provider = PrmsCore.PROVIDER; // Binded vars in dynamic SOQL must be in scope of query exe
        Set<Id> networkContactIds = contactFilter.getNetworkContactIds(); // Binded vars in dynamic SOQL must be in scope of query exe
        Set<Id> idsToExclude = filter.getIdsToExclude(); // to manage offset limit of 2000. Binded vars in dynamic SOQL must be in scope of query exe

        return filter.hasSearch() ? Search.query(q)[0] : Database.query(q);
    }
    
    protected override Integer queryTotalRecordCount( String q ){

        Id provider = PrmsCore.PROVIDER; // Binded vars in dynamic SOQL must be in scope of query exe
        Set<Id> networkContactIds = contactFilter.getNetworkContactIds(); // Binded vars in dynamic SOQL must be in scope of query exe

        return filter.hasSearch() ? Search.query(q)[0].size() : Database.countQuery(q);
    } 
}