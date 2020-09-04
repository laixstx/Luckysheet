/**
 * 获取选中的单个单元格的数据
 *  - 当选中多个单元格时，返回 null
 */
import {getcellvalue, getdatabyselection} from "../global/getdata";
import isEmpty from 'lodash/isEmpty'
import customConfig from "./config";
import {getconfig, getluckysheet_select_save} from "../methods/get";
import Store from "../store";

/**
 * 切换选中的单元格之后，回调 customConfig.onCellSelect
 */
export function onCellSelect() {
    const selCellData = getSelectedCellData();
    // console.log('表格 mouseup，selCellData', selCellData);
    if (customConfig.onCellSelect) {
        customConfig.onCellSelect(selCellData);
    }
}

/**
 * 自定义“更新单元格的值”的逻辑
 * @param r
 * @param c
 * @param flowdata {[[]]} 表格的值，二位数组。直接修改这个变量即可。
 * @type {(function(r: number, c: number, flowdata: [[]]):void)}
 */
export function dealCellUpdate(r, c, flowdata) {
    if (customConfig.dealCellUpdate) customConfig.dealCellUpdate(r, c, flowdata);
}

/**
 * 更新单元格的值之后的回调
 * @param r
 * @param c
 */
export function onCellUpdate(r, c) {
    let cellData;
    if(r >= 0 && c >= 0) {
        let cellV = Store.flowdata && Store.flowdata[r] ? Store.flowdata[r][c] : null;
        cellData = {
            r: r,
            c: c,
            v: cellV
        };
    } else {
        cellData = getSelectedCellData();
    }
    if (customConfig.onCellUpdate) customConfig.onCellUpdate(cellData);
}

/**
 * 自定义“清空单元格”的逻辑
 * @param r
 * @param c
 * @param flowdata {[[]]} 表格的值，二位数组。直接修改这个变量即可。
 * @type {(function(r: number, c: number, flowdata: [[]]):void)}
 */
export function dealCellClear(r, c, flowdata) {
    if (customConfig.dealCellClear) customConfig.dealCellClear(r, c, flowdata);
}

/**
 * 清空单元格之后的回调
 * @type {(function():void)}
 */
export function onCellClear() {
    if (customConfig.onCellClear) customConfig.onCellClear();

    onCellUpdate();
}

/**
 * 单元格粘贴之后的回调
 */
export function onCellPaste() {
    // 更新 $('#luckysheet-rich-text-editor') 的内容，避免公式栏回显内容错误的问题
    let selSave = getluckysheet_select_save();
    if (selSave) {
        let {column_focus, row_focus} = selSave[0];
        let cellV = Store.flowdata[row_focus][column_focus];
        let vHtml = '';
        if (cellV && cellV.f) {
            vHtml = cellV.f;
        } else {
            vHtml = getcellvalue(row_focus, column_focus) || '';
        }
        $('#luckysheet-rich-text-editor').html(vHtml);
    }

    const selCellData = getSelectedCellData();

    if (customConfig.onCellPaste) {
        customConfig.onCellPaste(selCellData);
    }

    onCellUpdate();
}

/**
 * 获取当前选中单元格的数据。（多选时，值为 null)
 * @return {null | {r:number, c: number, v: {}}}
 */
export function getSelectedCellData() {
    let cellData = null;
    let selSave = getluckysheet_select_save();

    if (selSave.length > 1) { // 有多个选区
        return cellData;
    }

    let {column, row, column_focus, row_focus} = selSave[0];
    let maxC = column[1];
    let maxR = row[1];
    let mergeO = getconfig().merge || {};
    let mc = mergeO[`${row_focus}_${column_focus}`];
    if (mc) { // 聚焦单元格是合并单元格
        let {r, c, rs, cs} = mc;
        // 如果选中区域的最大单元格超出合并单元格的范围，说明选中多个单元格，则返回 null
        if (maxC > c + cs || maxR > r + rs) {
            return cellData;
        }

        // 如果聚焦单元格不是合并单元格，且选中多个单元格，则返回 null
    } else if (maxC > column_focus || maxR > row_focus) {
        return cellData;
    }

    let cellV = Store.flowdata && Store.flowdata[row_focus] ? Store.flowdata[row_focus][column_focus] : null;
    cellData = {
        r: row_focus,
        c: column_focus,
        v: cellV
    };

    return cellData;
}
