import Store from '../store';
import luckysheetConfigsetting from '../controllers/luckysheetConfigsetting';

export default function rhchInit(rowheight, colwidth) {
    zoomSetting();//Zoom sheet on first load
    //行高
    if(rowheight != null){
        Store.visibledatarow = [];
        Store.rh_height = 0;

        for (let i = 0; i < rowheight; i++) {
            let rowlen = Store.defaultrowlen;

            if (Store.config["rowlen"] != null && Store.config["rowlen"][i] != null) {
                rowlen = Store.config["rowlen"][i];
            }

            if (Store.config["rowhidden"] != null && Store.config["rowhidden"][i] != null) {
                rowlen = Store.config["rowhidden"][i];
                Store.visibledatarow.push(Store.rh_height);
                continue;
            }
            else {
                Store.rh_height += Math.round((rowlen + 1)*Store.zoomRatio);
            }

            Store.visibledatarow.push(Store.rh_height); //行的临时长度分布
        }

        Store.rh_height += 80;  //最底部增加空白
    }

    //列宽
    if(colwidth != null){
        Store.visibledatacolumn = [];
        Store.ch_width = 0;

        let maxColumnlen = 120;

        for (let i = 0; i < colwidth; i++) {
            let firstcolumnlen = Store.defaultcollen;

            if (Store.config["columnlen"] != null && Store.config["columnlen"][i] != null) {
                firstcolumnlen = Store.config["columnlen"][i];
            }
            else {
                if (Store.flowdata[0] != null && Store.flowdata[0][i] != null) {
                    if (firstcolumnlen > 300) {
                        firstcolumnlen = 300;
                    }
                    else if (firstcolumnlen < Store.defaultcollen) {
                        firstcolumnlen = Store.defaultcollen;
                    }

                    if (firstcolumnlen != Store.defaultcollen) {
                        if (Store.config["columnlen"] == null) {
                            Store.config["columnlen"] = {};
                        }

                        Store.config["columnlen"][i] = firstcolumnlen;
                    }
                }
            }

            Store.ch_width += Math.round((firstcolumnlen + 1)*Store.zoomRatio);

            Store.visibledatacolumn.push(Store.ch_width);//列的临时长度分布

            if(maxColumnlen < firstcolumnlen + 1){
                maxColumnlen = firstcolumnlen + 1;
            }
        }
        
        // Store.ch_width += 120;
        Store.ch_width += maxColumnlen;
    }
}


export function zoomSetting(){
    //zoom
    Store.rowHeaderWidth = luckysheetConfigsetting.rowHeaderWidth * Store.zoomRatio;
    Store.columeHeaderHeight = luckysheetConfigsetting.columeHeaderHeight *Store.zoomRatio;
    $("#luckysheet-rows-h").width((Store.rowHeaderWidth-1.5));
    $("#luckysheet-cols-h-c").height((Store.columeHeaderHeight-1.5));
    $("#luckysheet-left-top").css({width:Store.rowHeaderWidth-1.5, height:Store.columeHeaderHeight-1.5});
}