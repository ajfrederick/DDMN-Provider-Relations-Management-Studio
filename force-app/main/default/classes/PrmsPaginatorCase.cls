/**
 * Utilizes PrmsPaginatorFilterCase and extends Paginator to assmeble query strings so Case records can be delivered to Provider Relations Management Studio front end.
 * 
 * @see Paginator
 * @see PrmsPaginatorFilterCase
 * 
 * @author Joel Comfort (March 2022)
 * @author Andrew Frederick (December 2022)
 */
public with sharing class PrmsPaginatorCase extends Paginator {

    public PrmsPaginatorCase( PrmsPaginatorFilterCase filter ) {
        super( filter );
    }

    public override String getSOQLString() {

        String q = 'SELECT ';
                    q += 'Id, ';
                    q += 'CaseNumber, ';
                    q += 'Status, ';
                    q += 'Contact.Name, ';
                    q += 'Contact.Email ';
                    q += 'FROM Case ';
                        q += filter.getFilterCriteria();

        return q;                
    }

    public override String getSOSLString() {

        String q = 'FIND \'' + filter.getSearch() +'*\' IN ALL FIELDS ';
                q += 'RETURNING Case(';
                    q += 'Id, ';
                    q += 'CaseNumber, ';
                    q += 'Status, ';
                    q += 'Contact.Name, ';
                    q += 'Contact.Email ';
                        q += filter.getFilterCriteria();
                q += ')';

        return q;
    }

    public override String getSOQLCountString() {

        String q = 'SELECT ';
                    q += 'count() ';
                    q += 'FROM Case ';
                        q += filter.getWhere();

        return q;                
    }

    public override String getSOSLCountString() {

        String q = 'FIND \'' + filter.getSearch() +'*\' IN ALL FIELDS ';
                q += 'RETURNING Case(';
                    q += 'Id ';
                        q += filter.getWhere();
                q += ')';

        return q;
    }
}