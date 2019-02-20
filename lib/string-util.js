/**
 * get blocks that split by block tag
 * @param  {[string]} html [html string]
 * @return {[array]}      [blolck array]
 */
const getBlocksFromHtml = function(html) {
    const line_break_tags = ['address', 'article', 'aside', 'audio', 'blockquote', 'canvas',
        'dd', 'div', 'dl', 'fieldset', 'figcaption', 'figure', 'footer', 'form',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'noscript', 'ol', 'output', 'p', 'pre', 'section',
        'table', 'tr', 'tfoot', 'ul', 'video', 'img', 'br'
    ];
    const splter = line_break_tags.join('|');
    html = html.replace(/<!--[\s\S]*?-->/igm, '');
    html = html.replace(/<script[\s\S]*?<\/script>/igm, '');
    html = html.replace(/<style[\s\S]*?<\/style>/igm, '');
    html = html.replace(/[\n\t\r]+/igm, '');
    let split_regx = new RegExp('(<(?:' + splter + ')[^>]*?>)', 'ig');
    html = html.replace(split_regx, '\n$1');
    html = html.replace(/<\/?[^>]*?>/ig, '');
    html = html.replace(/&[a-zA-Z]+;/ig, '');
    let paragraphs = html.split('\n');
    return paragraphs.map(line => {
        return line.replace(/\s{2,}/gm, ' ').replace(/^\s+$/gm, '');
    });
}

const getTextFromHtml = function(html) {
    html = html.replace(/<!--[\s\S]*?-->/igm, '');
    html = html.replace(/<script[\s\S]*?<\/script>/igm, '');
    html = html.replace(/<style[\s\S]*?<\/style>/igm, '');
    html = html.replace(/<\/?[^>]*?>/ig, '');
    html = html.replace(/&[a-zA-Z]+;/ig, '');
    html = html.replace(/[\n\t\r]+/igm, '');
    html = html.replace(/[\s]+/igm, '');
    return html;
}

/**
 * date format YYYY-MM-dd hh:mm:ss.S
 * @param  {[type]} date [description]
 * @param  {[type]} fmt  [description]
 * @return {[type]}      [description]
 */
const dateFormat = function(date, fmt) {
    var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

const simpleFingerPrint = function(title) {
    return title.replace(/[，。；！,;!\s]+/ig, '');
}


const generateTimeId = function() {
    return dateFormat(new Date(), 'yyMMddhhmmssS') + parseInt(Math.random() * 1000);
}

module.exports = {
    'getBlocksFromHtml': getBlocksFromHtml,
    'getTextFromHtml': getTextFromHtml,
    'dateFormat': dateFormat,
    'generateTimeId': generateTimeId
}