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
import uniq from "lodash/uniq";
import without from "lodash/without";

let preSelR, preSelC;
/**
 * 切换选中的单元格之后，回调 customConfig.onCellSelect
 */
export function onCellSelect() {
    console.log('onCellSelect');
    let selSave = getluckysheet_select_save();

    // if (selSave.length > 1) { // 有多个选区
    //     return;
    // }

    let { column_focus, row_focus } = selSave[selSave.length - 1];

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

    // setTimeout(() => {
    //     // 更新公式输入框的值

    // }, 10);

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
        let { column_focus, row_focus } = selSave[selSave.length - 1];
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
 * 添加“行/列”之后的回调
 * @param {string} type 操作类型。'r'：行操作。'c'：列操作
 * @param {number} ind 行/列索引
 * @param {number} len 操作的数量
 * @param {string} direction 方向。'lefttop': 在上方插行/左方插列。'rightbottom'：在下方插行/右方插列
 */
export function onRCAdd(type, ind, len, direction) {

    // 触发单元格更新回调
    onCellUpdate();

    if (customConfig.onRCAdd) customConfig.onRCAdd(type, ind, len, direction);
}

/**
 * 删除“行/列”之后的回调
 * @param {string} type 操作类型。'r'：行操作。'c'：列操作
 * @param {number} ind 行/列索引
 * @param {number} len 操作的数量
 */
export function onRCDelete(type, ind, len) {

    // 触发单元格更新回调
    onCellUpdate();

    if (customConfig.onRCDelete) customConfig.onRCDelete(type, ind, len);
}

/**
 * 显示/隐藏“行/列”之后的回调
 * @param {string} type 操作类型。'r'：行操作。'c'：列操作
 * @param {number} inds 行/列索引数组
 * @param {string} isShow 是否“显示”操作。true：显示操作。false：隐藏操作
 */
export function onRCShowHide(type, inds, isShow) {
    let fInds = inds;

    if ('r' === type) {

        if (!isShow) { // 隐藏
            if (null == customStore.rowHidden) {
                customStore.rowHidden = inds;
            } else {
                customStore.rowHidden = uniq(customStore.rowHidden.concat(inds));
            }
        } else { // 显示
            customStore.rowHidden = without(customStore.rowHidden, ...inds);
        }

        fInds = customStore.rowHidden;

    } else if ('c' === type) {

        if (!isShow) {
            if (null == customStore.colHidden) {
                customStore.colHidden = inds;
            } else {
                customStore.colHidden = uniq(customStore.colHidden.concat(inds));
            }
        } else { // 显示
            customStore.colHidden = without(customStore.colHidden, ...inds);
        }
        fInds = customStore.colHidden;
    }

    if (customConfig.onRCShowHide) {
        // 在 controllers/rowColumnOperation 中执行 onRCShowHide 之后，后续会默认刷新表格。
        // 为了在 customConfig.onRCShowHide 回调中，取得的表格是最新的值，这里需要做一个延迟。
        setTimeout(() => {
            customConfig.onRCShowHide(type, fInds, isShow);
        }, 1);
    }
}

/**
 * 拖拽单元格右下角之后的回调
 */
export function onDropFill(applyRange) {
    // console.log('onDropFill', applyRange);
    if (customConfig.dealCellUpdate && applyRange) {
        let { r, c } = getFocusCell();
        let isIncludeFocus = false;
        let rs = applyRange.row[0],
            re = applyRange.row[1],
            cs = applyRange.column[0],
            ce = applyRange.column[1];

        for (let rI = rs; rI <= re; rI++) {
            for (let cI = cs; cI <= ce; cI++) {
                customConfig.dealCellUpdate(rI, cI, Store.flowdata);

                if (!isIncludeFocus && r === rI && c === cI) {
                    isIncludeFocus = true;
                }
            }
        }

        // 如果当前聚焦的单元格在“应用范围”内，则触发单元格更新回调
        if (isIncludeFocus) {
            onCellUpdate(r, c);
        }
    }
    if (customConfig.onDropFill) customConfig.onDropFill(applyRange);
}

export function getFocusCell() {
    let selSave = getluckysheet_select_save();
    let { column_focus, row_focus } = selSave[selSave.length - 1];
    return { r: row_focus, c: column_focus };
}

/**
 * 获取当前选中单元格的数据
 * @return {null | {r:number, c: number, v: {}}}
 */
export function getSelectedCellData() {
    let cellData = null;
    let selSave = getluckysheet_select_save();

    // if (selSave.length !== 1) { // 有多个选区
    //     return cellData;
    // }

    let { column, row, column_focus, row_focus } = selSave[selSave.length - 1];
    // let maxC = column[1];
    // let maxR = row[1];
    // let mergeO = getconfig().merge || {};
    // let mc = mergeO[`${row_focus}_${column_focus}`];
    // if (mc) { // 聚焦单元格是合并单元格
    //     let { r, c, rs, cs } = mc;
    //     // 如果选中区域的最大单元格超出合并单元格的范围，说明选中多个单元格，则返回 null
    //     if (maxC > c + cs || maxR > r + rs) {
    //         return cellData;
    //     }

    //     // 如果聚焦单元格不是合并单元格，且选中多个单元格，则返回 null
    // } else if (maxC > column_focus || maxR > row_focus) {
    //     return cellData;
    // }

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
    if (parseInt($("#luckysheet-input-box").css("top")) > 0 &&
        Store.luckysheetCellUpdate[0] >= 0 && Store.luckysheetCellUpdate[1] >= 0) {
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
