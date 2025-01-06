export function FormatDate(isoString){
    const date = new Date(isoString)
    return date.toLocaleString('en-US',{
        year: 'numeric',
        month: 'long',
        day:'2-digit',
    }).replace(',','')
}