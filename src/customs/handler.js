import {colLocation, mouseposition, rowLocation} from "../global/location";
import {getconfig, getluckysheet_select_save} from "../methods/get";
import {hasPartMC} from "../global/validate";
import {setluckysheet_select_save} from "../methods/set";
import {selectHightlightShow} from "../controllers/select";
import customConfig from "./config";
import customStore from "./store";
import {recursiveFind} from "./util";
import {onCellSelect} from "./method";
import Store from "../store";
import {luckysheetContainerFocus} from "../utils/util";
import menuButton from "../controllers/menuButton";
import formula from "../global/formula";

export default function customHandler() {


    /**
     * 点击自定义的右键菜单
     */
    $('.custom-submenuitem').on('click', function () {
        // console.log('subclick')
        /**
         * 自定义右键菜单，支持两级
         * @type {[{id: string, name: string, children?: [], onClick?: function()}]}
         */
        const rightMenu = customConfig.rightMenu || [];
        const pId = $.trim($(this).attr('data-parent'));
        const dataId = $.trim($(this).attr('data-id'));
        recursiveFind(rightMenu, (mItem, mInd, pObj) => {
            if (mItem) {
                let isOk = false;

                if (pId) {
                    if (pObj && pId == pObj.id && mItem.id == dataId) {
                        isOk = true;
                    }

                } else if (mItem.id == dataId) {
                    isOk = true;
                }

                if (isOk) {
                    if (mItem.onClick) mItem.onClick();
                    return true;
                }
            }
            return false;
        });
    });

    /**
     * 表格 mouseup
     *
     */
    $("#luckysheet-cell-main, #luckysheetTableContent").on('mouseup', function () {
        // 如果是正在拖动替换单元格，则延时之后再回调 onCellSelect
        if (customStore.cellSelectedMove) {
            customStore.cellSelectedMove = false;
            setTimeout(() => {
                onCellSelect();
            }, 1);
            
        // 如果是双击单元格，则此次不需要响应 onCellSelect
        } else if(customStore.cellDbClick) {
            customStore.cellDbClick = false;
        } else {
            onCellSelect();
        }
    });

    /**
     * 表格区域-拖拽移动
     */
    $('#luckysheet-cell-main').on('dragover', function (event) {
        event.preventDefault();
        if (!customStore.draggingEle) return;

        let mouse = mouseposition(event.pageX, event.pageY);

        let scrollLeft = $("#luckysheet-cell-main").scrollLeft();
        let scrollTop = $("#luckysheet-cell-main").scrollTop();

        let x = mouse[0] + scrollLeft;
        let y = mouse[1] + scrollTop;

        let rowLoc = rowLocation(y),
            rowInd = rowLoc[2];
        let colLoc = colLocation(x),
            colInd = colLoc[2];

        let conf = getconfig();
        let cellMg = conf.merge ? conf.merge[`${rowInd}_${colInd}`] : null;

        // 如果选区([rowInd, rowInd] [colInd, colInd])被包含在某个“合并单元格”内，
        // 则选中这个“合并单元格”
        if (hasPartMC(conf, rowInd, rowInd, colInd, colInd)) {
            cellMg = customStore.cellPartMerge;
            rowInd = cellMg.r;
            colInd = cellMg.c;

            customStore.cellPartMerge = null; // 清空临时变量
        }

        let rowEInd = rowInd;
        let colEInd = colInd;

        if (cellMg) {
            rowEInd = rowInd + cellMg.rs - 1;
            colEInd = colInd + cellMg.cs - 1;
        }
        // 设置并更新选区
        setluckysheet_select_save([{
            row: [rowInd, rowEInd],
            column: [colInd, colEInd]
        }]);
        selectHightlightShow();

    }).on('drop', function (event) { // 松开拖拽动作之后
        customStore.draggingEle = false;

        if (customConfig.onCellDrop) {
            customConfig.onCellDrop();
        }

        var selectSave = getluckysheet_select_save();

        if (selectSave && selectSave[0] && selectSave[0].column) {
            var colInd = selectSave[0].column[0];
            var rowInd = selectSave[0].row[0];

            //单元格格式icon对应
            menuButton.menuButtonFocus(Store.flowdata, rowInd, colInd);
            //函数公式显示栏
            formula.fucntionboxshow(rowInd, colInd);
        }
        setTimeout(() => {
            luckysheetContainerFocus();
        }, 10);

        onCellSelect();
    })

}