/**
 * 自定义的配置项
 * @type {{}}
 */
const customConfig = {
    /**
     * 自定义操作栏的按钮
     * @type {[{id: string, zh: string, en: string, icon: string, onClick?: function()}]}
     */
    toolBar: [],
    /**
     * 自定义右键菜单，支持两级
     * @type {[{id: string, zh: string, en: string, children?: [], onClick?: function()}]}
     */
    rightMenu: [],
    /**
     * 单元格切换之后的回调
     * @param cellData {{r:number,c:number,v:{}}}
     * @type {(function(cellData: {}):void)}
     */
    onCellSelect: null,
    /**
     * 拖拽元素到单元格，结束拖拽后的回调
     * @type {(function():void)}
     */
    onCellDrop: null,

    /**
     * 自定义“更新单元格的值”的逻辑
     * @param r
     * @param c
     * @param flowdata {[[]]} 表格的值，二位数组。直接修改这个变量即可。
     * @type {(function(r: number, c: number, flowdata: [[]]):void)}
     */
    dealCellUpdate: null,

    /**
     * 更新单元格的值之后的回调
     * @param cellData {{r:number,c:number,v:{}}}
     * @type {(function(cellData:{}):void)}
     */
    onCellUpdate: null,

    /**
     * 自定义“清空单元格”的逻辑
     * @param r
     * @param c
     * @param flowdata {[[]]} 表格的值，二位数组。直接修改这个变量即可。
     * @type {(function(r: number, c: number, flowdata: [[]]):void)}
     */
    dealCellClear: null,
    /**
     * 清空单元格之后的回调
     * @type {(function():void)}
     */
    onCellClear: null,

    /**
     * "粘贴"之后的回调
     * @type {(function(cellData: {}):void)}
     */
    onCellPaste: null,

    /**
     * 编辑单元格前的回调。如果返回 false，则阻止默认逻辑
     * @param {*} r 
     * @param {*} c 
     * @return {undefined || boolean}
     */
    beforeCellEdit: null,
};

/**
 * 初始化自定义的配置项
 * @param setting
 */
export function initCustomConf(setting) {
    for (let k in setting) {
        if (setting.hasOwnProperty(k)) {
            customConfig[k] = setting[k];
        }
    }
}

export default customConfig;