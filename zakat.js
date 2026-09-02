/**
 * Zakat Calculator
 * Standard calculation: 2.5% of (zakatable assets − short-term debts),
 * only due if total meets or exceeds the Nisab threshold.
 */

const SILVER_NISAB_GRAMS = 612.36;
const GOLD_NISAB_GRAMS = 87.48;
const ZAKAT_RATE = 0.025;

function getNumberValue(id) {
    const val = parseFloat(document.getElementById(id).value);
    return isNaN(val) ? 0 : val;
}

function calculateZakat() {
    const nisabType = document.querySelector('input[name="nisab-type"]:checked').value;
    const pricePerGram = getNumberValue("metal-price");

    if (pricePerGram <= 0) {
        alert("Please enter the current price per gram to calculate your Nisab threshold.");
        return;
    }

    const nisabGrams = nisabType === "gold" ? GOLD_NISAB_GRAMS : SILVER_NISAB_GRAMS;
    const nisabThreshold = nisabGrams * pricePerGram;

    const totalAssets =
        getNumberValue("cash") +
        getNumberValue("gold-value") +
        getNumberValue("silver-value") +
        getNumberValue("investments") +
        getNumberValue("business") +
        getNumberValue("other-assets");

    const debts = getNumberValue("debts");
    const netWealth = Math.max(0, totalAssets - debts);

    const isZakatDue = netWealth >= nisabThreshold;
    const zakatAmount = isZakatDue ? netWealth * ZAKAT_RATE : 0;

    renderResult({ nisabType, nisabThreshold, totalAssets, debts, netWealth, isZakatDue, zakatAmount });
}

function formatCurrency(amount) {
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderResult({ nisabType, nisabThreshold, totalAssets, debts, netWealth, isZakatDue, zakatAmount }) {
    const resultSection = document.getElementById("zakat-result");
    resultSection.hidden = false;

    if (isZakatDue) {
        resultSection.innerHTML = `
            <p class="zakat-result-label">Zakat Due</p>
            <h2 class="zakat-result-amount">${formatCurrency(zakatAmount)}</h2>
            <div class="zakat-breakdown">
                <div class="zakat-breakdown-row"><span>Total zakatable assets</span><span>${formatCurrency(totalAssets)}</span></div>
                <div class="zakat-breakdown-row"><span>Less: debts due</span><span>−${formatCurrency(debts)}</span></div>
                <div class="zakat-breakdown-row zakat-breakdown-total"><span>Net zakatable wealth</span><span>${formatCurrency(netWealth)}</span></div>
                <div class="zakat-breakdown-row"><span>Nisab threshold (${nisabType})</span><span>${formatCurrency(nisabThreshold)}</span></div>
                <div class="zakat-breakdown-row"><span>Zakat rate</span><span>2.5%</span></div>
            </div>
        `;
    } else {
        resultSection.innerHTML = `
            <p class="zakat-result-label">No Zakat Due</p>
            <h2 class="zakat-result-amount zakat-not-due">${formatCurrency(netWealth)}</h2>
            <p class="zakat-not-due-note">Your net wealth of ${formatCurrency(netWealth)} is below the Nisab threshold of ${formatCurrency(nisabThreshold)} (${nisabType} standard), so Zakat is not currently obligatory on these assets.</p>
        `;
    }

    resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("calculate-btn").addEventListener("click", calculateZakat);
});
