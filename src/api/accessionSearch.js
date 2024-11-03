import PubmedApi from "pubmed-api";
import lodash from "lodash";

let Database = "protein";

export async function getAccessionESearch(accessionSearchResult, query,db) {
    Database = db
    try {
        resetaccessionSearchResult(accessionSearchResult);
        const options = {
            retStart: "1",
            retMax: "1000",
            db: db
        };
        const pubMedApi = new PubmedApi();
        const results = await pubMedApi.eSearch.search(Database, query, options);
        const result = JSON.parse(results);
        if (result.esearchresult && result.esearchresult.idlist && result.esearchresult.idlist.length > 0) {
            result.esearchresult.idlist.forEach((id, index) => {
                accessionSearchResult.idList.push({
                    index: index,
                    id: id
                });
            });
        }
        const pageIds = await getCurretPageIds(accessionSearchResult);
        const summaryResult = await getESearchSummary(pageIds);
        if (summaryResult && summaryResult.result) {
            if(Database === "protein") {
                extractProteinInfo(accessionSearchResult, summaryResult);
            } else {            
                extractGeneInfo(accessionSearchResult, summaryResult);
            }
        }
        return accessionSearchResult;
    } catch (error) {
        throw error;
    }
}

function extractProteinInfo(accessionSearchResult, summaryResult) { 
    Object.values(summaryResult.result).forEach(val => {
        if (val.title) {
            accessionSearchResult.resultSummary.push(val);
            accessionSearchResult.accessionList.push({
                text: val.accessionversion,
                title: val.title,
                icon: "mdi-flag",
                selected: "false"
            });
        }
    });
}

function extractGeneInfo(accessionSearchResult, summaryResult) {
    Object.values(summaryResult.result).forEach(val => {
        if (val.uid) {
            if (val.genomicinfo && Array.isArray(val.genomicinfo)) {
                val.genomicinfo.forEach(genomic => {
                    accessionSearchResult.accessionList.push({
                        text: genomic.chraccver,
                        title: val.description || "No description available",
                        icon: "mdi-flag",
                        selected: "false"
                    });
                });
            }
        }
    });
}

export async function getESearchSummary(queryids) {
    try {
        const pubMedApi = new PubmedApi();
        const results = await pubMedApi.eSummary.search(Database, queryids);
        return JSON.parse(results);
    } catch (error) {
        throw error;
    }
}

export function getCurretPageIds(accessionSearchResult ) {
    const minIndex = 1;
    const maxIndex = 100;
    const selectedItems = lodash.filter(accessionSearchResult.idList, e => e.index >= minIndex && e.index <= maxIndex);
    const idArray = lodash.map(selectedItems, e => e.id);
    return idArray.toString();
}

function resetaccessionSearchResult(accessionSearchResult) {
    if (accessionSearchResult != null && Array.isArray(accessionSearchResult)) {
        accessionSearchResult.splice(0, accessionSearchResult.length);
    }
    if (accessionSearchResult.accessionList != null && Array.isArray(accessionSearchResult.accessionList)) {
        accessionSearchResult.accessionList.splice(0, accessionSearchResult.accessionList.length);
    }
    if (accessionSearchResult != null && accessionSearchResult.idList != null) {
        accessionSearchResult.idList.splice(0, accessionSearchResult.idList.length);
    }
    if(accessionSearchResult != null && accessionSearchResult.resultSummary != null) {
        accessionSearchResult.resultSummary.splice(0, accessionSearchResult.resultSummary.length);
    }
    console.log("Cleared List..........");
    console.dir(accessionSearchResult);
}

    
