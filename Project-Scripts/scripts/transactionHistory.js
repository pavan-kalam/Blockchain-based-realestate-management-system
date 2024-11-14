let transactions = [];

function addTransaction(type, description) {
    const timestamp = Date.now();
    transactions.push({ type, description, timestamp });
}

function getTransactions() {
    return transactions;
}

function clearTransactions() {
    transactions = [];
}

export { addTransaction, getTransactions, clearTransactions };