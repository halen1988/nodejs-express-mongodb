const isEmpty = function(obj){
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
}

const getKeyByValue = function(obj, value) {
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (obj[prop] === value)
                return prop;
        }
    }
}

const callFunction = async function(f, d){
    let fstr = f.toString().replace(/\/\/.*\n/ig,'').replace(/\/\*.*\*\//ig,'');

    let lpc = 0;
    let rpc = 0;
    let sp = -1;
    let ep = -1;

    for(let i = 0; i < fstr.length; i++){
        let chr = fstr[i];

        if(chr === '('){
            if( sp<0 )sp = i;
            lpc++;
        }
        if(chr === ')'){
            rpc++;
            if(lpc == rpc){
                ep = i;
                break;
            }
        }
    }

    let matched = fstr.substring(sp+1, ep);

    let outer_split = function(str, spliter=','){
        let ret = [];
        let lpc = 0;
        let rpc = 0;
        let tmp_str = '';
        for(let i = 0; i < str.length; i++){
            let chr = str[i];

            let apd = true;
            if(chr === '(' || chr === '{' )lpc++;
            else if(chr === ')' || chr === '}' )rpc++;
            else if(chr === spliter){
                if(lpc == rpc){
                    ret.push(tmp_str.trim());
                    tmp_str = '';
                    apd = false;
                }
            }
            if(apd)tmp_str += chr;
        }
        if(tmp_str.length > 0)ret.push(tmp_str.trim());
        return ret;
    }

    let argument_list = outer_split(matched, ',').map(x=>{return outer_split(x, '=');});
    
    let parray = argument_list.map(y=>{
        let arg = y[0].trim();
        let val = y.length > 1 ? eval('('+y[1].trim()+')') : null;
        if(d.hasOwnProperty(arg))val = d[arg];
        return val;
    });

    return await f.call(null, ...parray);
}

module.exports = {
	'isEmpty' : isEmpty,
	'getKeyByValue' : getKeyByValue,
    'callFunction' : callFunction
}