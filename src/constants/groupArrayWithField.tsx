export const groupArrayWithField = (arr: any[], field: string) => {
    const grouped = arr.reduce((acc, item) => {
        if (!acc[item[field]]) acc[item[field]] = [];
        acc[item[field]].push(item);
        return acc;
    }, {});

    // Flatten ra thành 1 mảng, giữ thứ tự fieldId theo lúc xuất hiện đầu tiên
    const result = [];
    const seen = new Set();

    for (const item of arr) {
        if (!seen.has(item[field])) {
            result.push(...grouped[item[field]]);
            seen.add(item[field]);
        }
    }

    const fieldOrder = ['gGNJ5mQZRSxkSW4qAu6F', '3EUhuJoxzHauQpx1pPxq', 'zfnX1X3wvP46rRF3k4gB', 'j6fFXTUD1D6rym4UmKkV', 'cyg1PnZ4snHm583dFBzp', 'qw6gesBxUmEgEDow153O', 'Nji6cMUy0TcZ1Tw8B2iG', '48UQhGWIQECsi8lAd7Sc']
    result.sort((a, b) => {
        const indexA = fieldOrder.indexOf(a.fieldId);
        const indexB = fieldOrder.indexOf(b.fieldId);

        return indexA - indexB
    });

    return result
}
