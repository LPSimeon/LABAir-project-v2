// Method used to convert the '-' character into the space character
export function convertDashToSpace(term: string): string {
    return term ? term.replaceAll(/-/g, ' ') : '';
}

// Reversed method of the first one
export function convertSpaceToDash(term: string): string {
    return term ? term.replaceAll(' ', '-') : '';
}

// Method used to make the first letter of a string uppercase
export function capitalizeFirstLetter(term: string): string {
    return term ? term.charAt(0).toUpperCase() + term.slice(1) : '';
}

// Method used to manage the format of the credit card number
export function cc_number_format(value: string) {
    let v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = v.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || '';
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(' ') : v;
}

// Method used to manage the expiration date of the credit card and to put the '/' character
export function cc_expires_format(string: string) {
    return string.replace(/[^0-9]/g, '').replace(
        /^([0-9]{1}[0-9]{1})([0-9]{1,2}).*/g,
        '$1/$2', // To handle 113 > 11/3
    );
    // .replace(
    //         /^0{1,}/g, '0' // To handle 00 > 0
    //     )
    // .replace(
    //         /^([2-9])$/g, '0$1' // To handle 3 > 03
    //     ).replace(
    //         /^(1{1})([3-9]{1})$/g, '0$1/$2' // 13 > 01/3
    //     )
    // .replace(
    //     /^([2-9])([0-9]{1})$/g, '0$1/$2' // 33 > 03/3, 55 > 05/5
    // )
}
