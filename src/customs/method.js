/**
 * 获取选中的单个单元格的数据
 *  - 当选中多个单元格时，返回 null
 */
import { getcellvalue, getdatabyselection } from "../global/getdata";
import isEmpty from 'lodash/isEmpty'
import customConfig from "./config";
import { getconfig, getluckysheet_select_save } from "../methods/get";
import Store from "../store";
import customStore from './store';
import formula from '../global/formula';
import {
    luckysheetMoveHighlightCell,
} from '../controllers/sheetMove';

let preSelR, preSelC;
/**
 * 切换选中的单元格之后，回调 customConfig.onCellSelect
 */
export function onCellSelect() {
    let selSave = getluckysheet_select_save();

    if (selSave.length > 1) { // 有多个选区
        return;
    }

    let { column_focus, row_focus } = selSave[0];
    // 此次选中与上次不同时，响应回调
    if (preSelR != row_focus || preSelC != column_focus) {
        const selCellData = getSelectedCellData();
        // console.log('表格 mouseup，selCellData', selCellData);
        if (customConfig.onCellSelect) {
            customConfig.onCellSelect(selCellData);
        }
    }

    preSelR = row_focus;
    preSelC = column_focus;
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

    setTimeout(() => {
        // 更新公式输入框的值

    }, 10);

    let cellData;
    if (r >= 0 && c >= 0) {
        cellData = getCellData(r, c);
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
        let { column_focus, row_focus } = selSave[0];
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
 * 双击表格之后的回调
 * @param {number} r 
 * @param {number} c 
 */
export function onCellDbClick(r, c) {
    console.log('cell dbclick', r, c);
    customStore.cellDbClick = true;
    // return beforeCellEdit(r, c);
}

/**
 * 编辑单元格前的回调。如果返回 false，则阻止默认逻辑
 * @param {*} r 
 * @param {*} c 
 */
export function beforeCellEdit(r, c) {

    if (customConfig.beforeCellEdit) {
        let funcReturn = customConfig.beforeCellEdit(r, c);

        // 如果 beforeCellEdit 返回 false，则阻止默认逻辑，禁止“公式输入栏”的所有事件
        if (false === funcReturn) {
            customConfig.canCellEdit = false;
            return false;
        } else {
            customConfig.canCellEdit = true;
        }
    }
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

    let { column, row, column_focus, row_focus } = selSave[0];
    let maxC = column[1];
    let maxR = row[1];
    let mergeO = getconfig().merge || {};
    let mc = mergeO[`${row_focus}_${column_focus}`];
    if (mc) { // 聚焦单元格是合并单元格
        let { r, c, rs, cs } = mc;
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

/**
 * 根据行列索引获取单元格数据
 * @param {number} r 
 * @param {number} c 
 */
export function getCellData(r, c) {
    let cellData;
    if (r >= 0 && c >= 0) {
        let cellV = Store.flowdata && Store.flowdata[r] ? Store.flowdata[r][c] : null;
        cellData = {
            r: r,
            c: c,
            v: cellV
        };
    }
    return cellData;
}

/**
 * 取消单元格的编辑状态
 */
export function blurCellEdit() {
    if (Store.luckysheetCellUpdate[0] >= 0 && Store.luckysheetCellUpdate[1] >= 0) {
        formula.updatecell(Store.luckysheetCellUpdate[0], Store.luckysheetCellUpdate[1]);
        Store.luckysheet_select_save = [{ "row": [Store.luckysheetCellUpdate[0], Store.luckysheetCellUpdate[0]], "column": [Store.luckysheetCellUpdate[1], Store.luckysheetCellUpdate[1]], "row_focus": Store.luckysheetCellUpdate[0], "column_focus": Store.luckysheetCellUpdate[1] }];
        luckysheetMoveHighlightCell("down", 0, "rangeOfSelect");
        $("#luckysheet-functionbox-cell").blur();

        Store.luckysheetCellUpdate = [];
        $('#luckysheet-rich-text-editor').html(''); // 清空编辑输入框的值
    }
}

/**
 * 聚焦当前选中的单元格
 */
export function focusSelectCell() {
    luckysheetMoveHighlightCell("down", 0, "rangeOfSelect");
}