/**
 * 获取选中的单个单元格的数据
 *  - 当选中多个单元格时，返回 null
 */
import {getdatabyselection} from "../global/getdata";
import isEmpty from 'lodash/isEmpty'
import customConfig from "./config";

/**
 * 切换选中的单元格之后，回调 customConfig.onCellSelect
 */
export function onCellSelect() {
    const selCellData = getSelectedCellData();
    // console.log('表格 mouseup，selCellData', selCellData);
    if(customConfig.onCellSelect) {
        customConfig.onCellSelect(selCellData);
    }
}

export function getSelectedCellData() {
    let cellData = null;
    let selCells = getdatabyselection();
    let firstCell = selCells[0] ? selCells[0][0] : null;

    if (firstCell) {
        let isSelectedMulti = selCells.length > 1 || selCells[0].length > 1; // 标识是否选中多个单元格

        // 第一个单元格不是合并单元格
        if (isEmpty(firstCell.mc)) {
            // 如果当前选中了多个单元格，则返回 null
            if (isSelectedMulti) return cellData;

            cellData = firstCell;

        } else { // 第一个单元格是合并单元格
            let {r, c} = firstCell.mc;
            let isOneSelected = true;

            // 如果选中的单元格中，存在“不是合并单元格”或者“合并单元格的行列跟第一个单元格的行列不相等”的单元格，
            // 说明当前选中了多个单元格，则返回 null
            selCells.forEach((colCells) => {
                if (colCells) {

                    colCells.forEach((cell) => {
                        if (isEmpty(cell.mc) || (
                            cell.mc && (cell.mc.r != r || cell.mc.c != c)
                        )) {
                            isOneSelected = false;
                            return false;
                        }
                    });
                }
            });

            if(!isOneSelected) return cellData;

            cellData = firstCell;
        }

    }

    return cellData;

}