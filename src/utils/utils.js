export const formatMontant = (montant) => {
    const formatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR', // Change currency to EUR for Euros
        minimumFractionDigits: 2,
        currencyDisplay: 'symbol',
    });

    return formatter.format(montant / 100)
}
export const addSpacesToNumber = (number) => {
    // Convert number to string
    let numStr = number.toString();

    // Initialize an empty string to store the result
    let result = '';

    // Iterate over the characters of the number string from right to left
    for (let i = numStr.length - 1, count = 0; i >= 0; i--) {
        // Add the current character to the result string
        result = numStr[i] + result;
        // Increment the count of characters added
        count++;
        // If count is divisible by 3 and not at the beginning of the number string
        if (count % 3 === 0 && i !== 0) {
            // Add a space to the result string
            result = ' ' + result;
        }
    }

    // Return the result string
    return result;
}