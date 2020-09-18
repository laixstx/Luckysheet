/**
 * 自定义的配置项
 * @type {{}}
 */
const customConfig = {
    needRowHidden: undefined,
    needColHidden: undefined,
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
     * 拖拽替换单元格之后的回调
     * @type {(function():void)}
     */
    onCellSelectMove: null,

    /**
     * 编辑单元格前的回调。如果返回 false，则阻止默认逻辑
     * @param {*} r 
     * @param {*} c 
     * @return {undefined || boolean}
     */
    beforeCellEdit: null,

    /**
     * 添加“行/列”之后的回调
     * @param {string} type 操作类型。'r'：行操作。'c'：列操作
     * @param {number} ind 行/列索引
     * @param {number} len 操作的数量
     * @param {string} direction 方向。'lefttop': 在上方插行/左方插列。'rightbottom'：在下方插行/右方插列
     */
    onRCAdd: null,

    /**
     * 删除“行/列”之后的回调
     * @param {string} type 操作类型。'r'：行操作。'c'：列操作
     * @param {number} ind 行/列索引
     * @param {number} len 操作的数量
     */
    onRCDelete: null,

    /**
     * 显示/隐藏“行/列”之后的回调
     * @param {string} type 操作类型。'r'：行操作。'c'：列操作
     * @param {number} ind 行/列索引
     * @param {number} len 操作的数量
     * @param {string} isShow 是否“显示”操作。true：显示操作。false：隐藏操作
     */
    onRCShowHide: null,

    /**
     * 点击“函数”之后的回调
     */
    onClickFx: null,

    /**
     * 拖拽单元格右下角之后的回调
     */
    onDropFill: null,
};

/**
 * 初始化自定义的配置项
 * @param setting
 */
export function initCustomConf(setting) {
    for (let k in customConfig) {
        if (customConfig.hasOwnProperty(k)) {
            customConfig[k] = setting[k];
        }
    }
}

export default customConfig;