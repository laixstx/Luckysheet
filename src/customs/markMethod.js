import { getluckysheetfile } from "../methods/get";
import customStore from "./store";
import isEmpty from 'lodash/isEmpty';
import forIn from 'lodash/forIn';
import forEach from "lodash/forEach";
import { chatatABC } from "../utils/util";

let rowMarkContainId = 'luckysheet-rows-h';
let colMarkContainId = 'luckysheet-cols-h-c';
let cellMakrContainId = 'luckysheet-cell-main';

let markClassName = 'MARK_NODE';
let markComStyle = {
    'position': 'absolute',
    'font-size': '12px'
};

let hiddenHtml = '<span title="Hidden" style="color:red">x</span>';
let hiddenMarkClassName = 'HIDDEN_MARK'; 

//== 行标识 ==================================================
/**
 * 更新行标记。如果不存在次标记，则添加
 * @param {number} r 行索引
 * @param {string} markContent 标记的内容。支持 html 字符串
 */
export function updateRowMark(r, markContent) {
    if (null == customStore.rowMarks) {
        customStore.rowMarks = {};
    }
    customStore.rowMarks[`_${r}`] = {
        r, markContent
    }

    let sheetFiles = getluckysheetfile();

    if (sheetFiles && sheetFiles[0]) {
        let sheetFile = sheetFiles[0];
        updateRowMarkFunc(sheetFile, r, markContent);
    }

}

function updateRowMarkFunc(sheetFile, r, markContent) {

    if (sheetFile.visibledatarow) {
        let top = sheetFile.visibledatarow[r - 1] || 0;
        let styleO = {
            ...markComStyle,
            'left': '0',
            'z-index': '11',
            'top': `${top}px`
        };
        markFunc(`row-mark-${r}`, rowMarkContainId, markContent, styleO, { r });
    }
}

/**
 * 移除行标记
 * @param {nubmber} r 行索引
 */
export function removeRowMark(r) {
    if (customStore.rowMarks) {
        delete customStore.rowMarks[`_${r}`];
    }
    let markId = `row-mark-${r}`;
    removeMarkFunc(markId);
}

/**
 * 清空行标记
 */
export function clearRowMarks() {
    customStore.rowMarks = null;

    clearMarkFunc(rowMarkContainId);
}

/**
 * 渲染行的所有标记
 */
export function renderRowMarks(file = null) {
    let sheetFile = file;

    if (isEmpty(sheetFile)) {
        sheetFile = getSheetfile();
    }

    clearMarkFunc(rowMarkContainId);

    if (sheetFile && !isEmpty(customStore.rowMarks)) {

        forIn(customStore.rowMarks, (mObj) => {
            let { r, markContent } = mObj;
            updateRowMarkFunc(sheetFile, r, markContent);
        })
    }
}

//== 列标识 ==================================================

export function updateColMark(c, markContent) {
    if (null == customStore.colMarks) {
        customStore.colMarks = {};
    }
    customStore.colMarks[`_${c}`] = {
        c, markContent
    }

    let sheetFiles = getluckysheetfile();

    if (sheetFiles && sheetFiles[0]) {
        let sheetFile = sheetFiles[0];
        updateColMarkFunc(sheetFile, c, markContent);
    }

}

function updateColMarkFunc(sheetFile, c, markContent) {

    if (sheetFile.visibledatacolumn) {
        let left = sheetFile.visibledatacolumn[c - 1] || 0;
        let styleO = {
            ...markComStyle,
            'left': `${left}px`,
            'z-index': '11',
            'top': '0'
        };
        let markId = `col-mark-${c}`;
        markFunc(markId, colMarkContainId, markContent, styleO, { c });
    }
}

export function removeColMark(c) {
    if (customStore.colMarks) {
        delete customStore.colMarks[`_${c}`];
    }

    let markId = `col-mark-${c}`;
    removeMarkFunc(markId);
}

export function clearColMarks() {
    customStore.colMarks = null;
    clearMarkFunc(colMarkContainId);
}


/**
 * 渲染列的所有标记
 */
export function renderColMarks(file = null) {
    let sheetFile = file;

    if (isEmpty(sheetFile)) {
        sheetFile = getSheetfile();
    }

    clearMarkFunc(colMarkContainId);

    if (sheetFile && !isEmpty(customStore.colMarks)) {

        forIn(customStore.colMarks, (mObj) => {
            let { c, markContent } = mObj;
            updateColMarkFunc(sheetFile, c, markContent);
        })
    }
}

//== 单元格标识 ==================================================

export function updateCellMark(r, c, markContent) {
    if (null == customStore.cellMarks) {
        customStore.cellMarks = {};
    }
    customStore.cellMarks[`_${r}_${c}`] = {
        r, c, markContent
    }

    let sheetFiles = getluckysheetfile();

    if (sheetFiles && sheetFiles[0]) {
        let sheetFile = sheetFiles[0];
        updateCellMarkFunc(sheetFile, r, c, markContent);
    }

}

function updateCellMarkFunc(sheetFile, r, c, markContent) {

    if (sheetFile.visibledatacolumn && sheetFile.visibledatarow) {
        let top = sheetFile.visibledatarow[r - 1] || 0;
        let left = sheetFile.visibledatacolumn[c - 1] || 0;
        let styleO = {
            ...markComStyle,
            'left': `${left}px`,
            'z-index': '18',
            'top': `${top}px`
        };
        let markId = `cell-mark-${r}-${c}`;
        markFunc(markId, cellMakrContainId, markContent, styleO, { r, c });
    }
}

export function removeCellMark(r, c) {
    if (customStore.cellMarks) {
        delete customStore.cellMarks[`_${r}_${c}`];
    }

    let markId = `cell-mark-${r}-${c}`;
    removeMarkFunc(markId);
}

export function clearCellMarks() {
    customStore.cellMarks = null;

    clearMarkFunc(cellMakrContainId);
}

/**
 * 渲染单元格的所有标记
 */
export function renderCellMarks(file = null) {
    let sheetFile = file;

    if (isEmpty(sheetFile)) {
        sheetFile = getSheetfile();
    }

    clearMarkFunc(cellMakrContainId);

    if (sheetFile && !isEmpty(customStore.cellMarks)) {

        forIn(customStore.cellMarks, (mObj) => {
            let { r, c, markContent } = mObj;
            updateCellMarkFunc(sheetFile, r, c, markContent);
        })
    }
}

//== “隐藏行/列”标识 ==================================================

export function renderRCHiddenMarks(file = null) {
    let sheetFile = file;

    if (isEmpty(sheetFile)) {
        sheetFile = getSheetfile();
    }

    $(`.${hiddenMarkClassName}`).remove();

    if (sheetFile) {

        // 添加“隐藏行”的标记
        if (!isEmpty(customStore.rowHidden)) {
            if (sheetFile.visibledatarow) {

                forEach(customStore.rowHidden, (ind) => {

                    let top = sheetFile.visibledatarow[ind - 1] || 0;
                    let h = (sheetFile.visibledatarow[ind]  - top) || 19;
                    let styleO = {
                        ...markComStyle,
                        'left': `0`,
                        'z-index': '11',
                        'top': `${top + 2}px`,
                        'height': `${h}px`,
                        'width': '100%',
                        'background-color': 'rgb(255, 238, 113)',
                        'opacity': '0.3'
                    };
                    let markId = `r-hidden-mark-${ind}`;
                    let $markDom = $(`#${markId}`);

                    if ($markDom.length > 0) {
                        $markDom.css(styleO);
                    } else {
                        $(`#${rowMarkContainId}`).append(
                            `<span id="${markId}" title='Hidden Row ${ind + 1}' class="${hiddenMarkClassName}" />`
                        );
                        $(`#${markId}`).css(styleO);
                    }
                });

            }
        }

        // 添加“隐藏列”的标记
        if (!isEmpty(customStore.colHidden)) {
            if (sheetFile.visibledatacolumn) {

                forEach(customStore.colHidden, (ind) => {

                    let left = sheetFile.visibledatacolumn[ind - 1] || 0;
                    let w = (sheetFile.visibledatacolumn[ind]  - left) || 19;
                    let styleO = {
                        ...markComStyle,
                        'top': `0`,
                        'z-index': '11',
                        'left': `${left}px`,
                        'width': `${w}px`,
                        'height': '100%',
                        'background-color': 'rgb(255, 238, 113)',
                        'opacity': '0.3'
                    };
                    let markId = `c-hidden-mark-${ind}`;
                    let $markDom = $(`#${markId}`);

                    if ($markDom.length > 0) {
                        $markDom.css(styleO);
                    } else {
                        $(`#${colMarkContainId}`).append(
                            `<span id="${markId}" title='Hidden Column ${chatatABC(ind)}' class="${hiddenMarkClassName}" />`
                        );
                        $(`#${markId}`).css(styleO);
                    }
                });

            }
        }
    }
}


//===============================================================

function getSheetfile() {
    let sheetFiles = getluckysheetfile();

    if (sheetFiles && sheetFiles[0]) {
        return sheetFiles[0];
    }
    return null;
}

function markFunc(markId, markContainId, markContent, styleO, { r, c }) {

    let $markDom = $(`#${markId}`);
    let markHtml = markContent;

    if ($markDom.length > 0) {
        $markDom.html(markHtml);
        $markDom.css(styleO);
    } else {
        $(`#${markContainId}`).append(
            `<span id="${markId}" class="${markClassName}">
            ${markHtml}
            </span>`
        );
        $(`#${markId}`).css(styleO);
    }
}

function removeMarkFunc(markId) {
    let $markDom = $(`#${markId}`);
    if ($markDom.length > 0) {
        $markDom.remove();
    }
}

function clearMarkFunc(markContainId) {
    $(`#${markContainId}`).find(`.${markClassName}`).remove();
}

//===================================

/**
 * 渲染表格所有的标记
 */
export function renderAllMarks() {
    $(`.${markClassName}, .${hiddenMarkClassName}`).remove();

    let sheetFile = getSheetfile();

    if (sheetFile) {

        if (!isEmpty(customStore.rowMarks)) {

            forIn(customStore.rowMarks, (mObj) => {
                let { r, markContent } = mObj;
                updateRowMarkFunc(sheetFile, r, markContent);
            })
        }

        if (!isEmpty(customStore.colMarks)) {

            forIn(customStore.colMarks, (mObj) => {
                let { c, markContent } = mObj;
                updateColMarkFunc(sheetFile, c, markContent);
            })
        }

        renderCellMarks(sheetFile);

        renderRCHiddenMarks(sheetFile);
    }

}

/**
 * 清空表格所有标记
 */
export function clearAllMarks() {
    $(`.${markClassName}, .${hiddenMarkClassName}`).remove();
}