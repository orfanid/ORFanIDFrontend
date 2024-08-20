import lodash from "lodash";
import axios from "axios";

const proteinDatabase = "protein";

export async function getAccessionESearch(accessionSearchResult, query) {
        resetAccessionSearchResult(accessionSearchResult);
        const options = {
            retStart: "1",
            retMax: "1000"
        };
        const searchUrl = buildUrl("esearch.fcgi", {
            db: proteinDatabase,
            term: query,
            retstart: options.retStart,
            retmax: options.retMax,
            retmode: "json"
        });
        const searchResult = await fetchData(searchUrl);
        processSearchResult(searchResult, accessionSearchResult);

        const pageIds = getCurrentPageIds(accessionSearchResult);
        const summaryUrl = buildUrl("esummary.fcgi", {
            db: proteinDatabase,
            id: pageIds,
            retmode: "json"
        });
        const summaryResult = await fetchData(summaryUrl);
        processSummaryResult(summaryResult, accessionSearchResult);

        return accessionSearchResult;
}

function buildUrl(endpoint, params) {
    const baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
    const queryString = new URLSearchParams(params).toString();
    return `${baseUrl}${endpoint}?${queryString}`;
}

async function fetchData(url) {
    const response = await axios.get(url);
    return response.data;
}

function processSearchResult(result, accessionSearchResult) {
    if (result.esearchresult && result.esearchresult.idlist && result.esearchresult.idlist.length > 0) {
        result.esearchresult.idlist.forEach((id, index) => {
            accessionSearchResult.idList.push({
                index: index,
                id: id
            });
        });
    }
}

function processSummaryResult(result, accessionSearchResult) {
    if (result && result.result) {
        Object.values(result.result).forEach(val => {
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
}

function getCurrentPageIds(accessionSearchResult) {
    const minIndex = 1;
    const maxIndex = 100;
    const selectedItems = lodash.filter(accessionSearchResult.idList, e => e.index >= minIndex && e.index <= maxIndex);
    const idArray = lodash.map(selectedItems, e => e.id);
    return idArray.toString();
}

function resetAccessionSearchResult(accessionSearchResult) {
    if (accessionSearchResult != null && Array.isArray(accessionSearchResult)) {
        accessionSearchResult.splice(0, accessionSearchResult.length);
    }
    if (accessionSearchResult.accessionList != null && Array.isArray(accessionSearchResult.accessionList)) {
        accessionSearchResult.accessionList.splice(0, accessionSearchResult.accessionList.length);
    }
    if (accessionSearchResult != null && accessionSearchResult.idList != null) {
        accessionSearchResult.idList.splice(0, accessionSearchResult.idList.length);
    }
    if (accessionSearchResult != null && accessionSearchResult.resultSummary != null) {
        accessionSearchResult.resultSummary.splice(0, accessionSearchResult.resultSummary.length);
    }
    console.log("Cleared List..........");
    console.dir(accessionSearchResult);
}