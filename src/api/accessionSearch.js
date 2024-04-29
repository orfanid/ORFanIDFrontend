import PubmedApi from "pubmed-api";
import lodash from "lodash";

const proteinDatabase = "protein";

export async function getAccessionESearch(accessionSearchResult, query) {
    try {
        resetaccessionSearchResult(accessionSearchResult);
        const options = {
            retStart: "1",
            retMax: "1000"
        };
        const pubMedApi = new PubmedApi();
        const results = await pubMedApi.eSearch.search(proteinDatabase, query, options);
        debugger
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
        debugger
        const summaryResult = await getESearchSummary(pageIds);
        debugger
        if (summaryResult && summaryResult.result) {
            Object.values(summaryResult.result).forEach(val => {
                accessionSearchResult.resultSummary.push(val);
                accessionSearchResult.accessionList.push({
                    text: val.accessionversion,
                    title: val.title,
                    icon: "mdi-flag",
                    selected: "false"
                });
            });
        }
        return accessionSearchResult;
    } catch (error) {
        throw error;
    }
}

export async function getESearchSummary(queryids) {
    try {
        const pubMedApi = new PubmedApi();
        const results = await pubMedApi.eSummary.search(proteinDatabase, queryids);
        debugger
        return JSON.parse(results);
    } catch (error) {
        throw error;
    }
}

export function getCurretPageIds(accessionSearchResult ) {
    debugger
    const minIndex = 1;
    const maxIndex = 100;
    const selectedItems = lodash.filter(accessionSearchResult.idList, e => e.index >= minIndex && e.index <= maxIndex);
    const idArray = lodash.map(selectedItems, e => e.id);
    return idArray.toString();
}

function resetaccessionSearchResult(accessionSearchResult) {
    debugger
    if (accessionSearchResult != null && Array.isArray(accessionSearchResult)) {
        accessionSearchResult.splice(0, accessionSearchResult.length);
    }
    if (accessionSearchResult.accessionList != null && accessionSearchResult.accessionList.items != null && Array.isArray(accessionSearchResult.accessionList)) {
        accessionSearchResult.accessionList.splice(0, accessionSearchResult.accessionList.length);
    }
    accessionSearchResult.idList.splice(0, accessionSearchResult.idList.length);
    accessionSearchResult.idList = [];
    accessionSearchResult.resultSummary = [];
}
