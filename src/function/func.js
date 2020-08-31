import func_methods from '../global/func_methods';
import formula from '../global/formula';
import tooltip from '../global/tooltip';
import { isRealNum, valueIsError } from '../global/validate';
import { getdatabyselectionD } from '../global/getdata';
import { genarate } from '../global/format';
import { inverse } from '../function/matrix_methods';
import { getSheetIndex, getluckysheetfile, getRangetxt } from '../methods/get';
import { getObjType, ABCatNum } from '../utils/util';
import Store from '../store';

const error = {
    v: "#VALUE!",    //错误的参数或运算符
    n: "#NAME?",     //公式名称错误
    na: "#N/A",      //函数或公式中没有可用数值
    r: "#REF!",      //删除了由其他公式引用的单元格
    d: "#DIV/0!",    //除数是0或空单元格
    nm: "#NUM!",     //当公式或函数中某个数字有问题时
    nl: "#NULL!",    //交叉运算符（空格）使用不正确
    sp: "#SPILL!"    //数组范围有其它值
}

//函数功能：比较或运算
function luckysheet_compareWith() {
    //第一个参数和第三个参数，返回比较结果的布尔值或者运算值
    //formula.operatorjson; 存储运算符和比较符
    let sp = arguments[1]; //操作符

    //参数一
    let data_fp = arguments[0];
    let fp;
    if(getObjType(data_fp) == "object" && data_fp.startCell != null){ //参数是选区
        if(sp == "&"){
            fp = func_methods.getCellDataDyadicArr(data_fp, "text");
        }
        else{
            fp = func_methods.getCellDataDyadicArr(data_fp, "number");
        }

        if(fp.length == 1 && fp[0].length == 1){
            fp = fp[0][0];
        }
    }
    else{
        fp = data_fp;
    }

    //参数二
    let data_tp = arguments[2];
    let tp;
    if(getObjType(data_tp) == "object" && data_tp.startCell != null){ //参数是选区
        if(sp == "&"){
            tp = func_methods.getCellDataDyadicArr(data_tp, "text");
        }
        else{
            tp = func_methods.getCellDataDyadicArr(data_tp, "number");
        }

        if(tp.length == 1 && tp[0].length == 1){
            tp = tp[0][0];
        }
    }
    else{
        tp = data_tp;
    }

    if(valueIsError(fp)){
        return fp;
    }

    if(valueIsError(tp)){
        return tp;
    }

    //参数是不规则二维数组 时 return #VALUE! 错误
    if(getObjType(fp) == "array" && getObjType(fp[0]) == "array" && !func_methods.isDyadicArr(fp)){
        return error.v;   
    }

    if(getObjType(tp) == "array" && getObjType(tp[0]) == "array" && !func_methods.isDyadicArr(tp)){
        return error.v;   
    }

    if(sp == "<>"){
        sp = "!=";
    }

    if(sp == "="){
        sp = "==";
    }

    if(sp == "-" && fp == null){
        fp = 0;
    }

    //计算result
    function booleanOperation(a, operator, b){
        if(isRealNum(a)){
            a = parseFloat(a);
        }

        if(isRealNum(b)){
            b = parseFloat(b);
        }

        if(operator == "=="){
            if(a == b){
                return true;
            }
            else{
                return false;
            }
        }
        else if(operator == "!="){
            if(a != b){
                return true;
            }
            else{
                return false;
            }
        }
        else if(operator == ">="){
            if(a >= b){
                return true;
            }
            else{
                return false;
            }
        }
        else if(operator == "<="){
            if(a <= b){
                return true;
            }
            else{
                return false;
            }
        }
        else if(operator == ">"){
            if(a > b){
                return true;
            }
            else{
                return false;
            }
        }
        else if(operator == "<"){
            if(a < b){
                return true;
            }
            else{
                return false;
            }
        }
    }

    //布尔值对应数字（true = 1, false = 1）
    function booleanToNum(v){
        if(v == null){
            return v;
        }

        if(v.toString().toLowerCase() == "true"){
            return 1;
        }

        if(v.toString().toLowerCase() == "false"){
            return 0;
        }

        return v;
    }
      
    if(sp == "*"){ //乘
        if(getObjType(fp) == "array" && getObjType(tp) == "array"){
            let result = [];

            if(getObjType(fp[0]) == "array" && getObjType(tp[0]) == "array"){
                //二维数组相乘（m*n 与 m*n 等于 m*n；m*p 与 p*n 等于 m*n；其它错误） 
                if(fp.length == tp.length && fp[0].length == tp[0].length){
                    for(let m = 0; m < fp.length; m++){
                        let rowArr = [];

                        for(let n = 0; n < fp[m].length; n++){
                            fp[m][n] = booleanToNum(fp[m][n]);
                            tp[m][n] = booleanToNum(tp[m][n]);

                            let value;
                            if(isRealNum(fp[m][n]) && isRealNum(tp[m][n])){
                                value = parseFloat(fp[m][n]) * parseFloat(tp[m][n]);
                            }
                            else{
                                value = error.v;
                            }

                            rowArr.push(value);
                        }

                        result.push(rowArr);
                    }
                }
                else if(fp[0].length == tp.length){
                    let rowlen = fp.length;
                    let collen = tp[0].length;

                    for(let m = 0; m < rowlen; m++){
                        let rowArr = [];

                        for(let n = 0; n < collen; n++){
                            let value = 0;

                            for(let p = 0; p < fp[0].length; p++){
                                fp[m][p] = booleanToNum(fp[m][p]);
                                tp[p][n] = booleanToNum(tp[p][n]);

                                if(isRealNum(fp[m][p]) && isRealNum(tp[p][n])){
                                    value += parseFloat(fp[m][p]) * parseFloat(tp[p][n]);
                                }
                                else{
                                    value += error.v;
                                }
                            }

                            if(value.toString() == "NaN"){
                                value = error.v;
                            }

                            rowArr.push(value);
                        }

                        result.push(rowArr);
                    }
                }
                else if(fp.length == tp[0].length){
                    let rowlen = tp.length;
                    let collen = fp[0].length;

                    for(let m = 0; m < rowlen; m++){
                        let rowArr = [];

                        for(let n = 0; n < collen; n++){
                            let value = 0;

                            for(let p = 0; p < tp[0].length; p++){
                                fp[p][n] = booleanToNum(fp[p][n]);
                                tp[m][p] = booleanToNum(tp[m][p]);

                                if(isRealNum(tp[m][p]) && isRealNum(fp[p][n])){
                                    value += parseFloat(tp[m][p]) * parseFloat(fp[p][n]);
                                }
                                else{
                                    value += error.v;
                                }
                            }

                            if(value.toString() == "NaN"){
                                value = error.v;
                            }

                            rowArr.push(value);
                        }

                        result.push(rowArr);
                    }
                }
                else{
                    return error.na;
                }
            }
            else if(getObjType(fp[0]) == "array"){
                //二维数组与一维数组相乘（m*n 与 n 等于 m*n；m*1 与 n 等于 m*n；其它错误）
                if(fp[0].length == tp.length){
                    for(let m = 0; m < fp.length; m++){
                        let rowArr = [];

                        for(let n = 0; n < fp[m].length; n++){
                            fp[m][n] = booleanToNum(fp[m][n]);
                            tp[n] = booleanToNum(tp[n]);

                            let value;
                            if(isRealNum(fp[m][n]) && isRealNum(tp[n])){
                                value = parseFloat(fp[m][n]) * parseFloat(tp[n]);
                            }
                            else{
                                value = error.v;
                            }

                            rowArr.push(value);
                        }

                        result.push(rowArr);
                    }
                }
                else if(fp[0].length == 1){
                    let rowlen = fp.length;
                    let collen = tp.length;

                    for(let m = 0; m < rowlen; m++){
                        let rowArr = [];

                        for(let n = 0; n < collen; n++){
                            fp[m][0] = booleanToNum(fp[m][0]);
                            tp[n] = booleanToNum(tp[n]);

                            let value;
                            if(isRealNum(fp[m][0]) && isRealNum(tp[n])){
                                value = parseFloat(fp[m][0]) * parseFloat(tp[n]);
                            }
                            else{
                                value = error.v;
                            }

                            rowArr.push(value);
                        }

                        result.push(rowArr);
                    }
                }
                else{
                    return error.na;
                }
            }
            else if(getObjType(tp[0]) == "array"){
                //二维数组与一维数组相乘（m*n 与 n 等于 m*n；m*1 与 n 等于 m*n；其它错误）
                if(tp[0].length == fp.length){
                    for(let m = 0; m < tp.length; m++){
                        let rowArr = [];

                        for(let n = 0; n < tp[m].length; n++){
                            fp[n] = booleanToNum(fp[n]);
                            tp[m][n] = booleanToNum(tp[m][n]);

                            let value;
                            if(isRealNum(fp[n]) && isRealNum(tp[m][n])){
                                value = parseFloat(fp[n]) * parseFloat(tp[m][n]);
                            }
                            else{
                                value = error.v;
                            }

                            rowArr.push(value);
                        }

                        result.push(rowArr);
                    }
                }
                else if(tp[0].length == 1){
                    let rowlen = tp.length;
                    let collen = fp.length;

                    for(let m = 0; m < rowlen; m++){
                        let rowArr = [];

                        for(let n = 0; n < collen; n++){
                            fp[n] = booleanToNum(fp[n]);
                            tp[m][0] = booleanToNum(tp[m][0]);

                            let value;
                            if(isRealNum(fp[n]) && isRealNum(tp[m][0])){
                                value = parseFloat(fp[n]) * parseFloat(tp[m][0]);
                            }
                            else{
                                value = error.v;
                            }

                            rowArr.push(value);
                        }

                        result.push(rowArr);
                    }
                }
                else{
                    return error.na;
                }
            }
            else{
                //一维数组与一维数组相乘时，数组大小不一样是错误
                if(fp.length != tp.length){
                    return error.na;   
                }

                for(let n = 0; n < fp.length; n++){
                    fp[n] = booleanToNum(fp[n]);
                    tp[n] = booleanToNum(tp[n]);

                    let value;
                    if(isRealNum(fp[n]) && isRealNum(tp[n])){
                        value = parseFloat(fp[n]) * parseFloat(tp[n]);
                    }
                    else{
                        value = error.v;
                    }

                    result.push(value);
                }
            }

            return result;
        }
        else if(getObjType(fp) == "array"){
            tp = booleanToNum(tp);

            let result = [];

            if(getObjType(fp[0]) == "array"){
                for(let m = 0; m < fp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < fp[m].length; n++){
                        fp[m][n] = booleanToNum(fp[m][n]);

                        let value;
                        if(isRealNum(fp[m][n]) && isRealNum(tp)){
                            value = parseFloat(fp[m][n]) * parseFloat(tp);
                        }
                        else{
                            value = error.v;
                        }

                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else{
                for(let n = 0; n < fp.length; n++){
                    fp[n] = booleanToNum(fp[n]);

                    let value;
                    if(isRealNum(fp[n]) && isRealNum(tp)){
                        value = parseFloat(fp[n]) * parseFloat(tp);
                    }
                    else{
                        value = error.v;
                    }

                    result.push(value);
                }
            }

            return result;
        }
        else if(getObjType(tp) == "array"){
            fp = booleanToNum(fp);

            let result = [];

            if(getObjType(tp[0]) == "array"){
                for(let m = 0; m < tp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < tp[m].length; n++){
                        tp[m][n] = booleanToNum(tp[m][n]);

                        let value;
                        if(isRealNum(fp) && isRealNum(tp[m][n])){
                            value = parseFloat(fp) * parseFloat(tp[m][n]);
                        }
                        else{
                            value = error.v;
                        }

                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else{
                for(let n = 0; n < tp.length; n++){
                    tp[n] = booleanToNum(tp[n]);

                    let value;
                    if(isRealNum(fp) && isRealNum(tp[n])){
                        value = parseFloat(fp) * parseFloat(tp[n]);
                    }
                    else{
                        value = error.v;
                    }

                    result.push(value);
                }
            }

            return result;
        }
        else{
            fp = booleanToNum(fp);
            tp = booleanToNum(tp);

            let result;
            if(isRealNum(fp) && isRealNum(tp)){
                result = parseFloat(fp) * parseFloat(tp);
            }
            else{
                result = error.v;
            }

            return result;
        }
    }
    else if(sp == "/"){ //除
        if(getObjType(fp) == "array" && getObjType(tp) == "array"){
            let result = [];

            if(getObjType(fp[0]) == "array" && getObjType(tp[0]) == "array"){
                //二维数组相除（m*n 与 m*n 等于 m*n；m*p 与 p*n 等于 m*n；其它错误） 
                if(fp.length == tp.length && fp[0].length == tp[0].length){
                    for(let m = 0; m < fp.length; m++){
                        let rowArr = [];

                        for(let n = 0; n < fp[m].length; n++){
                            fp[m][n] = booleanToNum(fp[m][n]);
                            tp[m][n] = booleanToNum(tp[m][n]);

                            let value;
                            if(isRealNum(fp[m][n]) && isRealNum(tp[m][n])){
                                if(parseFloat(tp[m][n]) == 0){
                                    value = error.d;
                                }
                                else{
                                    value = parseFloat(fp[m][n]) / parseFloat(tp[m][n]);    
                                }
                            }
                            else{
                                value = error.v;
                            }

                            rowArr.push(value);
                        }

                        result.push(rowArr);
                    }
                }
                else if(fp[0].length == tp.length){
                    let tp_inverse = inverse(tp);

                    let rowlen = fp.length;
                    let collen = tp_inverse[0].length;

                    for(let m = 0; m < rowlen; m++){
                        let rowArr = [];

                        for(let n = 0; n < collen; n++){
                            let value = 0;

                            for(let p = 0; p < fp[0].length; p++){
                                fp[m][p] = booleanToNum(fp[m][p]);
                                tp_inverse[p][n] = booleanToNum(tp_inverse[p][n]);

                                if(isRealNum(fp[m][p]) && isRealNum(tp_inverse[p][n])){
                                    value += parseFloat(fp[m][p]) * parseFloat(tp_inverse[p][n]);
                                }
                                else{
                                    value += error.v;
                                }
                            }

                            if(value.toString() == "NaN"){
                                value = error.v;
                            }

                            rowArr.push(value);
                        }

                        result.push(rowArr);
                    }
                }
                else{
                    return error.na;
                }
            }
            else if(getObjType(fp[0]) == "array"){
                //二维数组与一维数组相除（m*n 与 n 等于 m*n；m*1 与 n 等于 m*n；其它错误）
                if(fp[0].length == tp.length){
                    for(let m = 0; m < fp.length; m++){
                        let rowArr = [];

                        for(let n = 0; n < fp[m].length; n++){
                            fp[m][n] = booleanToNum(fp[m][n]);
                            tp[n] = booleanToNum(tp[n]);

                            let value;
                            if(isRealNum(fp[m][n]) && isRealNum(tp[n])){
                                if(parseFloat(tp[n]) == 0){
                                    value = error.d;
                                }
                                else{
                                    value = parseFloat(fp[m][n]) / parseFloat(tp[n]);
                                }
                            }
                            else{
                                value = error.v;
                            }

                            rowArr.push(value);
                        }

                        result.push(rowArr);
                    }
                }
                else if(fp[0].length == 1){
                    let rowlen = fp.length;
                    let collen = tp.length;

                    for(let m = 0; m < rowlen; m++){
                        let rowArr = [];

                        for(let n = 0; n < collen; n++){
                            fp[m][0] = booleanToNum(fp[m][0]);
                            tp[n] = booleanToNum(tp[n]);

                            let value;
                            if(isRealNum(fp[m][0]) && isRealNum(tp[n])){
                                if(parseFloat(tp[n]) == 0){
                                    value = error.d;
                                }
                                else{
                                    value = parseFloat(fp[m][0]) / parseFloat(tp[n]);
                                }
                            }
                            else{
                                value = error.v;
                            }

                            rowArr.push(value);
                        }

                        result.push(rowArr);
                    }
                }
                else{
                    return error.na;
                }
            }
            else if(getObjType(tp[0]) == "array"){
                //二维数组与一维数组相除（m*n 与 n 等于 m*n；m*1 与 n 等于 m*n；其它错误）
                if(tp[0].length == fp.length){
                    for(let m = 0; m < tp.length; m++){
                        let rowArr = [];

                        for(let n = 0; n < tp[m].length; n++){
                            fp[n] = booleanToNum(fp[n]);
                            tp[m][n] = booleanToNum(tp[m][n]);

                            let value;
                            if(isRealNum(fp[n]) && isRealNum(tp[m][n])){
                                if(parseFloat(tp[m][n]) == 0){
                                    value = error.d;
                                }
                                else{
                                    value = parseFloat(fp[n]) / parseFloat(tp[m][n]);
                                }
                            }
                            else{
                                value = error.v;
                            }

                            rowArr.push(value);
                        }

                        result.push(rowArr);
                    }
                }
                else if(tp[0].length == 1){
                    let rowlen = tp.length;
                    let collen = fp.length;

                    for(let m = 0; m < rowlen; m++){
                        let rowArr = [];

                        for(let n = 0; n < collen; n++){
                            fp[n] = booleanToNum(fp[n]);
                            tp[m][0] = booleanToNum(tp[m][0]);

                            let value;
                            if(isRealNum(fp[n]) && isRealNum(tp[m][0])){
                                if(parseFloat(tp[m][0]) == 0){
                                    value = error.d;
                                }
                                else{
                                    value = parseFloat(fp[n]) / parseFloat(tp[m][0]);
                                }
                            }
                            else{
                                value = error.v;
                            }

                            rowArr.push(value);
                        }

                        result.push(rowArr);
                    }
                }
                else{
                    return error.na;
                }
            }
            else{
                //一维数组与一维数组相除时，数组大小不一样是错误
                if(fp.length != tp.length){
                    return error.na;   
                }

                for(let n = 0; n < fp.length; n++){
                    fp[n] = booleanToNum(fp[n]);
                    tp[n] = booleanToNum(tp[n]);

                    let value;
                    if(isRealNum(fp[n]) && isRealNum(tp[n])){
                        if(parseFloat(tp[n]) == 0){
                            value = error.d;
                        }
                        else{
                            value = parseFloat(fp[n]) / parseFloat(tp[n]);
                        }
                    }
                    else{
                        value = error.v;
                    }

                    result.push(value);
                }
            }

            return result;
        }
        else if(getObjType(fp) == "array"){
            tp = booleanToNum(tp);

            let result = [];

            if(getObjType(fp[0]) == "array"){
                for(let m = 0; m < fp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < fp[m].length; n++){
                        fp[m][n] = booleanToNum(fp[m][n]);

                        let value;
                        if(isRealNum(fp[m][n]) && isRealNum(tp)){
                            if(parseFloat(tp) == 0){
                                value = error.d;
                            }
                            else{
                                value = parseFloat(fp[m][n]) / parseFloat(tp);
                            }
                        }
                        else{
                            value = error.v;
                        }

                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else{
                for(let n = 0; n < fp.length; n++){
                    fp[n] = booleanToNum(fp[n]);

                    let value;
                    if(isRealNum(fp[n]) && isRealNum(tp)){
                        if(parseFloat(tp) == 0){
                            value = error.d;
                        }
                        else{
                            value = parseFloat(fp[n]) / parseFloat(tp);
                        }
                    }
                    else{
                        value = error.v;
                    }

                    result.push(value);
                }
            }

            return result;
        }
        else if(getObjType(tp) == "array"){
            fp = booleanToNum(fp);

            let result = [];

            if(getObjType(tp[0]) == "array"){
                for(let m = 0; m < tp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < tp[m].length; n++){
                        tp[m][n] = booleanToNum(tp[m][n]);

                        let value;
                        if(isRealNum(fp) && isRealNum(tp[m][n])){
                            if(parseFloat(tp[m][n]) == 0){
                                value = error.d;
                            }
                            else{
                                value = parseFloat(fp) / parseFloat(tp[m][n]);
                            }
                        }
                        else{
                            value = error.v;
                        }

                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else{
                for(let n = 0; n < tp.length; n++){
                    tp[n] = booleanToNum(tp[n]);

                    let value;
                    if(isRealNum(fp) && isRealNum(tp[n])){
                        if(parseFloat(tp[n]) == 0){
                            value = error.d;
                        }
                        else{
                            value = parseFloat(fp) / parseFloat(tp[n]);
                        }
                    }
                    else{
                        value = error.v;
                    }

                    result.push(value);
                }
            }

            return result;
        }
        else{
            fp = booleanToNum(fp);
            tp = booleanToNum(tp);

            let result;
            if(isRealNum(fp) && isRealNum(tp)){
                if(parseFloat(tp) == 0){
                    result = error.d;
                }
                else{
                    result = parseFloat(fp) / parseFloat(tp);
                }
            }
            else{
                result = error.v;
            }

            return result;
        }
    }
    else if(sp == "+" || sp == "-" || sp == "%"){ //加 减 取余
        if(getObjType(fp) == "array" && getObjType(tp) == "array"){
            let result = [];

            if(getObjType(fp[0]) == "array" && getObjType(tp[0]) == "array"){
                if(fp.length != tp.length && fp[0].length != tp[0].length){
                    return error.na;   
                }

                for(let m = 0; m < fp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < fp[m].length; n++){
                        fp[m][n] = booleanToNum(fp[m][n]);
                        tp[m][n] = booleanToNum(tp[m][n]);

                        let value;
                        if(isRealNum(fp[m][n]) && isRealNum(tp[m][n])){
                            if(sp == "%" && parseFloat(tp[m][n]) == 0){
                                value = error.d;
                            }
                            else{
                                value = eval(parseFloat(fp[m][n]) + sp + parseFloat(tp[m][n]));    
                            }
                        }
                        else{
                            value = error.v;
                        }

                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else if(getObjType(fp[0]) == "array"){
                if(fp[0].length != tp.length){
                    return error.na;
                }

                for(let m = 0; m < fp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < fp[m].length; n++){
                        fp[m][n] = booleanToNum(fp[m][n]);
                        tp[n] = booleanToNum(tp[n]);

                        let value;
                        if(isRealNum(fp[m][n]) && isRealNum(tp[n])){
                            if(sp == "%" && parseFloat(tp[n]) == 0){
                                value = error.d;
                            }
                            else{
                                value = eval(parseFloat(fp[m][n]) + sp + parseFloat(tp[n]));    
                            }
                        }
                        else{
                            value = error.v;
                        }

                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else if(getObjType(tp[0]) == "array"){
                if(tp[0].length != fp.length){
                    return error.na;
                }

                for(let m = 0; m < tp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < tp[m].length; n++){
                        fp[n] = booleanToNum(fp[n]);
                        tp[m][n] = booleanToNum(tp[m][n]);

                        let value;
                        if(isRealNum(fp[n]) && isRealNum(tp[m][n])){
                            if(sp == "%" && parseFloat(tp[m][n]) == 0){
                                value = error.d;
                            }
                            else{
                                value = eval(parseFloat(fp[n]) + sp + parseFloat(tp[m][n]));    
                            }
                        }
                        else{
                            value = error.v;
                        }

                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else{
                if(fp.length != tp.length){
                    return error.na;   
                }

                for(let n = 0; n < fp.length; n++){
                    fp[n] = booleanToNum(fp[n]);
                    tp[n] = booleanToNum(tp[n]);

                    let value;
                    if(isRealNum(fp[n]) && isRealNum(tp[n])){
                        if(sp == "%" && parseFloat(tp[n]) == 0){
                            value = error.d;
                        }
                        else{
                            value = eval(parseFloat(fp[n]) + sp + parseFloat(tp[n]));    
                        }
                    }
                    else{
                        value = error.v;
                    }

                    result.push(value);
                }
            }

            return result;
        }
        else if(getObjType(fp) == "array"){
            tp = booleanToNum(tp);

            let result = [];

            if(getObjType(fp[0]) == "array"){
                for(let m = 0; m < fp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < fp[m].length; n++){
                        fp[m][n] = booleanToNum(fp[m][n]);

                        let value;
                        if(isRealNum(fp[m][n]) && isRealNum(tp)){
                            if(sp == "%" && parseFloat(tp) == 0){
                                value = error.d;
                            }
                            else{
                                value = eval(parseFloat(fp[m][n]) + sp + parseFloat(tp));    
                            }
                        }
                        else{
                            value = error.v;
                        }

                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else{
                for(let n = 0; n < fp.length; n++){
                    fp[n] = booleanToNum(fp[n]);

                    let value;
                    if(isRealNum(fp[n]) && isRealNum(tp)){
                        if(sp == "%" && parseFloat(tp) == 0){
                            value = error.d;
                        }
                        else{
                            value = eval(parseFloat(fp[n]) + sp + parseFloat(tp));    
                        }
                    }
                    else{
                        value = error.v;
                    }

                    result.push(value);
                }
            }

            return result;
        }
        else if(getObjType(tp) == "array"){
            fp = booleanToNum(fp);

            let result = [];

            if(getObjType(tp[0]) == "array"){
                for(let m = 0; m < tp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < tp[m].length; n++){
                        tp[m][n] = booleanToNum(tp[m][n]);

                        let value;
                        if(isRealNum(fp) && isRealNum(tp[m][n])){
                            if(sp == "%" && parseFloat(tp[m][n]) == 0){
                                value = error.d;
                            }
                            else{
                                value = eval(parseFloat(fp) + sp + parseFloat(tp[m][n]));    
                            }
                        }
                        else{
                            value = error.v;
                        }

                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else{
                for(let n = 0; n < tp.length; n++){
                    tp[n] = booleanToNum(tp[n]);

                    let value;
                    if(isRealNum(fp) && isRealNum(tp[n])){
                        if(sp == "%" && parseFloat(tp[n]) == 0){
                            value = error.d;
                        }
                        else{
                            value = eval(parseFloat(fp) + sp + parseFloat(tp[n]));    
                        }
                    }
                    else{
                        value = error.v;
                    }

                    result.push(value);
                }
            }

            return result;
        }
        else{
            fp = booleanToNum(fp);
            tp = booleanToNum(tp);

            let result;
            if(isRealNum(fp) && isRealNum(tp)){
                if(sp == "%" && parseFloat(tp) == 0){
                    result = error.d;
                }
                else{
                    result = eval(parseFloat(fp) + sp + parseFloat(tp));    
                }
            }
            else{
                result = error.v;
            }

            return result;
        }
    }
    else if(sp == "==" || sp == "!=" || sp == ">=" || sp == "<=" || sp == ">" || sp == "<"){ //比较运算符
        if(getObjType(fp) == "array" && getObjType(tp) == "array"){
            let result = [];

            if(getObjType(fp[0]) == "array" && getObjType(tp[0]) == "array"){
                if(fp.length != tp.length && fp[0].length != tp[0].length){
                    return error.na;   
                }

                for(let m = 0; m < fp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < fp[m].length; n++){
                        let value = booleanOperation(fp[m][n], sp, tp[m][n]);
                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else if(getObjType(fp[0]) == "array"){
                if(fp[0].length != tp.length){
                    return error.na;
                }

                for(let m = 0; m < fp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < fp[m].length; n++){
                        let value = booleanOperation(fp[m][n], sp, tp[n]);
                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else if(getObjType(tp[0]) == "array"){
                if(tp[0].length != fp.length){
                    return error.na;
                }

                for(let m = 0; m < tp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < tp[m].length; n++){
                        let value = booleanOperation(fp[n], sp, tp[m][n]);
                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else{
                if(fp.length != tp.length){
                    return error.na;   
                }

                for(let n = 0; n < fp.length; n++){
                    let value = booleanOperation(fp[n], sp, tp[n]);
                    result.push(value);
                }
            }

            return result;
        }
        else if(getObjType(fp) == "array"){
            let result = [];

            if(getObjType(fp[0]) == "array"){
                for(let m = 0; m < fp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < fp[m].length; n++){
                        let value = booleanOperation(fp[m][n], sp, tp);
                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else{
                for(let n = 0; n < fp.length; n++){
                    let value = booleanOperation(fp[n], sp, tp);
                    result.push(value);
                }
            }

            return result;
        }
        else if(getObjType(tp) == "array"){
            let result = [];

            if(getObjType(tp[0]) == "array"){
                for(let m = 0; m < tp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < tp[m].length; n++){
                        let value = booleanOperation(fp, sp, tp[m][n]);
                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else{
                for(let n = 0; n < tp.length; n++){
                    let value = booleanOperation(fp, sp, tp[n]);
                    result.push(value);
                }
            }

            return result;
        }
        else{
            return booleanOperation(fp, sp, tp);
        }
    }
    else if(sp == "&"){ //连接符
        if(getObjType(fp) == "array" && getObjType(tp) == "array"){
            let result = [];

            if(getObjType(fp[0]) == "array" && getObjType(tp[0]) == "array"){
                if(fp.length != tp.length && fp[0].length != tp[0].length){
                    return error.na;   
                }

                for(let m = 0; m < fp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < fp[m].length; n++){
                        rowArr.push(fp[m][n] + "" + tp[m][n]);
                    }

                    result.push(rowArr);
                }
            }
            else if(getObjType(fp[0]) == "array"){
                if(fp[0].length != tp.length){
                    return error.na;
                }

                for(let m = 0; m < fp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < fp[m].length; n++){
                        rowArr.push(fp[m][n] + "" + tp[n]);
                    }

                    result.push(rowArr);
                }
            }
            else if(getObjType(tp[0]) == "array"){
                if(tp[0].length != fp.length){
                    return error.na;
                }

                for(let m = 0; m < tp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < tp[m].length; n++){
                        rowArr.push(fp[n] + "" + tp[m][n]);
                    }

                    result.push(rowArr);
                }
            }
            else{
                if(fp.length != tp.length){
                    return error.na;   
                }

                for(let n = 0; n < fp.length; n++){
                    result.push(fp[n] + "" + tp[n]);
                }
            }

            return result;
        }
        else if(getObjType(fp) == "array"){
            let result = [];

            if(getObjType(fp[0]) == "array"){
                for(let m = 0; m < fp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < fp[m].length; n++){
                        rowArr.push(fp[m][n] + "" + tp);
                    }

                    result.push(rowArr);
                }
            }
            else{
                for(let n = 0; n < fp.length; n++){
                    result.push(fp[n] + "" + tp);
                }
            }

            return result;
        }
        else if(getObjType(tp) == "array"){
            let result = [];

            if(getObjType(tp[0]) == "array"){
                for(let m = 0; m < tp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < tp[m].length; n++){
                        rowArr.push(fp + "" + tp[m][n]);
                    }

                    result.push(rowArr);
                }
            }
            else{
                for(let n = 0; n < tp.length; n++){
                    result.push(fp + "" + tp[n]);
                }
            }

            return result;
        }
        else{
            return fp + "" + tp;
        }
    }
    else if(sp == "^"){ //幂
        if(getObjType(fp) == "array" && getObjType(tp) == "array"){
            let result = [];

            if(getObjType(fp[0]) == "array" && getObjType(tp[0]) == "array"){
                if(fp.length != tp.length && fp[0].length != tp[0].length){
                    return error.na;   
                }

                for(let m = 0; m < fp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < fp[m].length; n++){
                        fp[m][n] = booleanToNum(fp[m][n]);
                        tp[m][n] = booleanToNum(tp[m][n]);

                        let value;
                        if(isRealNum(fp[m][n]) && isRealNum(tp[m][n])){
                            value = Math.pow(parseFloat(fp[m][n]), parseFloat(tp[m][n]));
                        }
                        else{
                            value = error.v;
                        }

                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else if(getObjType(fp[0]) == "array"){
                if(fp[0].length != tp.length){
                    return error.na;
                }

                for(let m = 0; m < fp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < fp[m].length; n++){
                        fp[m][n] = booleanToNum(fp[m][n]);
                        tp[n] = booleanToNum(tp[n]);

                        let value;
                        if(isRealNum(fp[m][n]) && isRealNum(tp[n])){
                            value = Math.pow(parseFloat(fp[m][n]), parseFloat(tp[n]));
                        }
                        else{
                            value = error.v;
                        }

                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else if(getObjType(tp[0]) == "array"){
                if(tp[0].length != fp.length){
                    return error.na;
                }

                for(let m = 0; m < tp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < tp[m].length; n++){
                        fp[n] = booleanToNum(fp[n]);
                        tp[m][n] = booleanToNum(tp[m][n]);

                        let value;
                        if(isRealNum(fp[n]) && isRealNum(tp[m][n])){
                            value = Math.pow(parseFloat(fp[n]), parseFloat(tp[m][n]));
                        }
                        else{
                            value = error.v;
                        }

                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else{
                if(fp.length != tp.length){
                    return error.na;   
                }

                for(let n = 0; n < fp.length; n++){
                    fp[n] = booleanToNum(fp[n]);
                    tp[n] = booleanToNum(tp[n]);

                    let value;
                    if(isRealNum(fp[n]) && isRealNum(tp[n])){
                        value = Math.pow(parseFloat(fp[n]), parseFloat(tp[n]));
                    }
                    else{
                        value = error.v;
                    }

                    result.push(value);
                }
            }

            return result;
        }
        else if(getObjType(fp) == "array"){
            tp = booleanToNum(tp);

            let result = [];

            if(getObjType(fp[0]) == "array"){
                for(let m = 0; m < fp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < fp[m].length; n++){
                        fp[m][n] = booleanToNum(fp[m][n]);

                        let value;
                        if(isRealNum(fp[m][n]) && isRealNum(tp)){
                            value = Math.pow(parseFloat(fp[m][n]), parseFloat(tp));
                        }
                        else{
                            value = error.v;
                        }

                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else{
                for(let n = 0; n < fp.length; n++){
                    fp[n] = booleanToNum(fp[n]);

                    let value;
                    if(isRealNum(fp[n]) && isRealNum(tp)){
                        value = Math.pow(parseFloat(fp[n]), parseFloat(tp));
                    }
                    else{
                        value = error.v;
                    }

                    result.push(value);
                }
            }

            return result;
        }
        else if(getObjType(tp) == "array"){
            fp = booleanToNum(fp);

            let result = [];

            if(getObjType(tp[0]) == "array"){
                for(let m = 0; m < tp.length; m++){
                    let rowArr = [];

                    for(let n = 0; n < tp[m].length; n++){
                        tp[m][n] = booleanToNum(tp[m][n]);

                        let value;
                        if(isRealNum(fp) && isRealNum(tp[m][n])){
                            value = Math.pow(parseFloat(fp), parseFloat(tp[m][n]));
                        }
                        else{
                            value = error.v;
                        }

                        rowArr.push(value);
                    }

                    result.push(rowArr);
                }
            }
            else{
                for(let n = 0; n < tp.length; n++){
                    tp[n] = booleanToNum(tp[n]);

                    let value;
                    if(isRealNum(fp) && isRealNum(tp[n])){
                        value = Math.pow(parseFloat(fp), parseFloat(tp[n]));
                    }
                    else{
                        value = error.v;
                    }

                    result.push(value);
                }
            }

            return result;
        }
        else{
            fp = booleanToNum(fp);
            tp = booleanToNum(tp);

            let result;
            if(isRealNum(fp) && isRealNum(tp)){
                result = Math.pow(parseFloat(fp), parseFloat(tp));
            }
            else{
                result = error.v;
            }

            return result;
        }
    }
}

//解析 公式中{1,2,3;2,3,4} 为数组[[1,2,3],[2,3,4]]
function luckysheet_getarraydata() {
    let fp = arguments[0];

    fp = fp.replace("{", "").replace("}", "").replace(/\"/g, '');

    let arr = [];

    if(fp.indexOf(";") > -1){
        arr = fp.split(";");

        for(let i = 0; i < arr.length; i++){
            arr[i] = arr[i].split(",");
        }
    }
    else{
        arr = fp.split(",");    
    }

    return arr;
}

function luckysheet_getcelldata(txt) {
    if (window.luckysheet_getcelldata_cache == null) {
        window.luckysheet_getcelldata_cache = {};
    }

    if (txt in window.luckysheet_getcelldata_cache) {
        return window.luckysheet_getcelldata_cache[txt];
    }

    let luckysheetfile = getluckysheetfile();
    let val = txt.split("!");
    let sheettxt = "",
        rangetxt = "",
        sheetIndex = -1,
        sheetdata = null;
    
    if (val.length > 1) {
        sheettxt = val[0];
        rangetxt = val[1];
        
        for (let i in luckysheetfile) {
            if (sheettxt == luckysheetfile[i].name) {
                sheetIndex = luckysheetfile[i].index;
                sheetdata = luckysheetfile[i].data;
                break;
            }
        }

        if (sheetIndex == -1) {
            sheetIndex = 0;
        }
    } 
    else {
        let index = getSheetIndex(Store.currentSheetIndex);
        sheettxt = luckysheetfile[index].name;
        sheetIndex = luckysheetfile[index].index;
        sheetdata = Store.flowdata;
        rangetxt = val[0];

        if (formula.execFunctionGroupData != null) {
            sheetdata = formula.execFunctionGroupData;
        }
    }

    if (rangetxt.indexOf(":") == -1) {
        let row = parseInt(rangetxt.replace(/[^0-9]/g, "")) - 1;
        let col = ABCatNum(rangetxt.replace(/[^A-Za-z]/g, ""));

        if (!isNaN(row) && !isNaN(col)) {
            let dataBySelD = getdatabyselectionD(sheetdata, {
                "row": [row, row],
                "column": [col, col]
            });
            if(dataBySelD && dataBySelD[0]) {
                let ret = dataBySelD[0][0];

                //范围的长宽
                let rowl = 1;
                let coll = 1;
                let retAll= {
                    "sheetName": sheettxt,
                    "startCell": rangetxt,
                    "rowl": rowl,
                    "coll": coll,
                    "data": ret
                };

                window.luckysheet_getcelldata_cache[txt] = retAll;

                return retAll;
            } else {
                return [];
            }
        } 
        else {
            return [];
        }
    } 
    else {
        rangetxt = rangetxt.split(":");
        let row = [], col = [];
        row[0] = parseInt(rangetxt[0].replace(/[^0-9]/g, "")) - 1;
        row[1] = parseInt(rangetxt[1].replace(/[^0-9]/g, "")) - 1;
        
        if (isNaN(row[0])) {
            row[0] = 0;
        }

        if (isNaN(row[1])) {
            row[1] = sheetdata.length - 1;
        }

        if (row[0] > row[1]) {
            tooltip.info("选择失败", "输入范围错误！");
            return [];
        }

        col[0] = ABCatNum(rangetxt[0].replace(/[^A-Za-z]/g, ""));
        col[1] = ABCatNum(rangetxt[1].replace(/[^A-Za-z]/g, ""));
        
        if (isNaN(col[0])) {
            col[0] = 0;
        }

        if (isNaN(col[1])) {
            col[1] = sheetdata[0].length - 1;
        }

        if (col[0] > col[1]) {
            tooltip.info("选择失败", "输入范围错误！");
            return [];
        }
        
        let ret = getdatabyselectionD(sheetdata, {
            "row": row,
            "column": col
        });
        
        //范围的长宽
        let rowl = row[1] - row[0] + 1;
        let coll = col[1] - col[0] + 1;
        let retAll= {
            "sheetName": sheettxt,
            "startCell": rangetxt[0],
            "rowl": rowl,
            "coll": coll,
            "data": ret
        };
        
        window.luckysheet_getcelldata_cache[txt] = retAll;

        return retAll;
    }
}

//解析单个取得的值，有字符串，数字，引用单元格或者函数
function luckysheet_parseData(value) {
    if(typeof value === "object" ){
        if(value == null){
            return "";
        }
        else if(Array.isArray(value)){ //函数返回的带期望格式的数组，可提取格式
            let v = genarate(value[0]);
            return v[2];
        }
        else{ //getcelldat引用单元格对象，带有格式
            if(Array.isArray(value.data)){ //单元格区域
                return error.v;             
            }
            else{ //单个单元格
                if(value.data.v === undefined){
                    return "";
                }
                else{
                    return value.data.v;
                }
            }
        }
    }
    else if(!formula.isCompareOperator(value).flag){
        let v = genarate(value);
        return v[2];
    }
    else if(typeof value === "string" || typeof value === "number"){
        return value;
    }

    return error.v;
}

function luckysheet_getValue() {
    //解析获取函数参数，无格式，且可包含带操作符的">5"
    //数据类型：1.手动输入或函数返回的字符串，普通字符串或数字直接取值，特殊格式需转化 如："2019-1-1"（特殊格式转化为数字）、">5"或数字
    //2.引用单元格对象，取得二维数组或单个的v 如：A1
    //3.函数返回的带期望格式的数组，取得第一个参数，转化为数字 如：["2019-1-1",true]
    let args = arguments[0];

    for(let i = 0; i < args.length; i++){
        let value = args[i];

        if(typeof value === "object" ){
            if(value == null){
                value = "";
            }
            else if(Array.isArray(value)){ //函数返回的带期望格式的数组，可提取格式
                let v = genarate(value[0]);
                value = v[2];
            }
            else{ //getcelldat引用单元格对象，带有格式
                if(Array.isArray(value.data)){ //单元格区域
                    value = value.data;                
                }
                else{ //单个单元格
                    if(value.data.v === undefined){ //空白单元格
                        value = "";
                    }
                    else{
                        value = value.data.v;
                    }
                }
            }
        }
        else if(!formula.isCompareOperator(value).flag){
            let v = genarate(value);
            value = v[2];
        }
        
        args[i] = value;
    }
}


function luckysheet_indirect_check() {
    let cellTxt = arguments[0];
    if (cellTxt == null || cellTxt.length == 0) {
        return null;
    }
    return cellTxt;
}

function luckysheet_indirect_check_return(txt) {
    return txt;
}

function luckysheet_offset_check() {
    if (!(getObjType(arguments[0]) == "object" && arguments[0].startCell != null)) {
        return formula.error.v;
    }

    var reference = arguments[0].startCell;

    //要偏移的行数
    var rows = func_methods.getFirstValue(arguments[1]);
    if (valueIsError(rows)) {
        return rows;
    }

    if (!isRealNum(rows)) {
        return formula.error.v;
    }

    rows = parseInt(rows);

    //要偏移的列数
    var cols = func_methods.getFirstValue(arguments[2]);
    if (valueIsError(cols)) {
        return cols;
    }

    if (!isRealNum(cols)) {
        return formula.error.v;
    }

    cols = parseInt(cols);

    //要从偏移目标开始返回的范围的高度
    var height = arguments[0].rowl;
    if (arguments.length >= 4) {
        height = func_methods.getFirstValue(arguments[3]);
        if (valueIsError(height)) {
            return height;
        }

        if (!isRealNum(height)) {
            return formula.error.v;
        }

        height = parseInt(height);
    }

    //要从偏移目标开始返回的范围的宽度
    var width = arguments[0].coll;
    if (arguments.length == 5) {
        width = func_methods.getFirstValue(arguments[4]);
        if (valueIsError(width)) {
            return width;
        }

        if (!isRealNum(width)) {
            return formula.error.v;
        }

        width = parseInt(width);
    }

    if (height < 1 || width < 1) {
        return formula.error.r;
    }

    //计算
    var cellrange = formula.getcellrange(reference);
    var cellRow0 = cellrange["row"][0];
    var cellCol0 = cellrange["column"][0];

    cellRow0 += rows;
    cellCol0 += cols;

    var cellRow1 = cellRow0 + height - 1;
    var cellCol1 = cellCol0 + width - 1;

    if (cellRow0 < 0 || cellRow1 >= Store.flowdata.length || cellCol0 < 0 || cellCol1 >= Store.flowdata[0].length) {
        return formula.error.r;
    }

    return getRangetxt(Store.currentSheetIndex, {
        row: [cellRow0, cellRow1],
        column: [cellCol0, cellCol1]
    });
}

export {
    luckysheet_compareWith,
    luckysheet_getarraydata,
    luckysheet_getcelldata,
    luckysheet_parseData,
    luckysheet_getValue,
    luckysheet_indirect_check,
    luckysheet_indirect_check_return,
    luckysheet_offset_check
}