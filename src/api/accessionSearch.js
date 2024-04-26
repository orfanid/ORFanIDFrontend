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
        const result = JSON.parse(results);
        if (result.eaccessionSearchResult && result.eaccessionSearchResult.idlist && result.eaccessionSearchResult.idlist.length > 0) {
            result.eaccessionSearchResult.idlist.forEach((id, index) => {
                accessionSearchResult.idList.push({
                    index: index,
                    id: id
                });
            });
        }
        const pageIds = await getCurretPageIds(accessionSearchResult);
        const summaryResult = await getESearchSummary(pageIds);
        if (summaryResult && summaryResult.result) {
            Object.values(summaryResult.result).forEach(val => {
                accessionSearchResult.resultSummary.push(val);
                accessionSearchResult.AccesionLookup.items.push({
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
        return JSON.parse(results);
    } catch (error) {
        throw error;
    }
}

export function getCurretPageIds() {
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
    if (accessionSearchResult.AccesionLookup != null && accessionSearchResult.AccesionLookup.items != null && Array.isArray(accessionSearchResult.AccesionLookup.items)) {
        accessionSearchResult.AccesionLookup.items.splice(0, accessionSearchResult.AccesionLookup.items.length);
    }
    accessionSearchResult.idList.splice(0, accessionSearchResult.idList.length);
    accessionSearchResult.idList = [];
    accessionSearchResult.resultSummary = [];
}
