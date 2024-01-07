import company_tickers from './company_tickers.json' assert { type: 'json' };
import {getDocNumber} from './server.js';

async function startFilingsDownload(oo){
    let toDL_list;
    const sql = global.sqlconn;
    if(oo.mode == 'update') toDL_list = (await sql.query(`select cik from companies`))?.recordset;
    if(oo.mode == 'update') toDL_list = (await sql.query(`
        select c.cik 
        from companies c
        left join filings f on (f.cik=c.cik and f.year >= datepart(year, getdate())-1 )
        where f.cik is null`))?.recordset;
    toDL_list = toDL_list.map(x=>x.cik);

    console.log(`Pulling ${toDL_list.length} tickers`);


    for(const cik of toDL_list){
        await getDocNumber({cik, type:'annual'});
    }
    
}

export {startFilingsDownload};