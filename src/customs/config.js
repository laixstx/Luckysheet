/**
 * 自定义的配置项
 * @type {{}}
 */
const customConfig = {
    /**
     * 自定义右键菜单，支持两级
     * @type {[{id: string, name: string, children?: [], onClick?: function()}]}
     */
    rightMenu: [],
    /**
     * 拖拽元素到单元格，结束拖拽后的回调
     * @type {(function():void)}
     */
    onCellDrop: null,
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

/**
 * 自定义的右键菜单
 * @returns {{menuHtm:string, subMenuHtm:string}}
 */
export function rightMenuHtml() {
    let menuHtm = '';
    let subMenuHtm = '';
    const rightMenu = customConfig.rightMenu;

    if (rightMenu && rightMenu.length > 0) {
        rightMenu.forEach((menuItem) => {
            if (menuItem && menuItem.id) {
                let menuId = `right-menu-${menuItem.id}`;

                if (menuItem.children && menuItem.children.length > 0) {
                    menuHtm += `<div id="${menuId}" class="luckysheet-cols-menuitem luckysheet-cols-submenu luckysheet-mousedown-cancel">
                        <div class="luckysheet-cols-menuitem-content luckysheet-mousedown-cancel">
                            ${menuItem.name}<span class="luckysheet-submenu-arrow" style="user-select: none;">►</span>
                        </div>
                    </div>`;

                    subMenuHtm += `<div id="${menuId}_sub" class="luckysheet-cols-menu luckysheet-rightgclick-menu luckysheet-rightgclick-menu-sub luckysheet-mousedown-cancel">`;
                    menuItem.children.forEach((subMenuItem) => {

                        if (subMenuItem && subMenuItem.id) {
                            subMenuHtm += `<div id="right-submenu-${subMenuItem.id}" data-id="${subMenuItem.id}" class="custom-submenuitem luckysheet-cols-menuitem luckysheet-copy-btn luckysheet-mousedown-cancel">
                                <div class="luckysheet-cols-menuitem-content luckysheet-mousedown-cancel">${subMenuItem.name}</div>
                            </div>`
                        }
                    });
                    subMenuHtm += '</div>'
                } else {
                    menuHtm += `<div id="${menuId}" data-id="${menuItem.id}" class="custom-menuitem luckysheet-cols-menuitem luckysheet-mousedown-cancel">
                    <div class="luckysheet-cols-menuitem-content luckysheet-mousedown-cancel">${menuItem.name}</div>
                </div>`
                }
            }
        });

        if(menuHtm.length > 0) {
            menuHtm += `<div class="luckysheet-menuseparator luckysheet-mousedown-cancel" role="separator"></div>`
        }
    }

    return {
        menuHtm, subMenuHtm
    };
}

export default customConfig;