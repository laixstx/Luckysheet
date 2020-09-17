import customConfig from "./config";
import Store from './../store/index';


/**
 * 自定义的右键菜单
 * @returns {{menuHtm:string, subMenuHtm:string}}
 */
export function rightMenuHtml() {
    let menuHtm = '';
    let subMenuHtm = '';
    let lang = Store.lang;
    /**
     * 自定义右键菜单，支持两级
     * @type {[{id: string, zh: string, en: string, children?: [], onClick?: function()}]}
     */
    const rightMenu = customConfig.rightMenu;

    if (rightMenu && rightMenu.length > 0) {
        rightMenu.forEach((menuItem) => {
            if (menuItem && menuItem.id) {
                let menuId = `right-menu-${menuItem.id}`;
                let menuName = menuItem[lang] || '';

                if (menuItem.children && menuItem.children.length > 0) {
                    menuHtm += `<div id="${menuId}" class="luckysheet-cols-menuitem luckysheet-cols-submenu luckysheet-mousedown-cancel">
                        <div class="luckysheet-cols-menuitem-content luckysheet-mousedown-cancel">
                            ${menuName}<span class="luckysheet-submenu-arrow" style="user-select: none;">►</span>
                        </div>
                    </div>`;

                    subMenuHtm += `<div id="${menuId}_sub" class="luckysheet-cols-menu luckysheet-rightgclick-menu luckysheet-rightgclick-menu-sub luckysheet-mousedown-cancel">`;
                    menuItem.children.forEach((subMenuItem) => {

                        if (subMenuItem && subMenuItem.id) {
                            let mName = subMenuItem[lang] || '';
                            subMenuHtm += `<div id="right-submenu-${subMenuItem.id}" data-id="${subMenuItem.id}" class="custom-submenuitem luckysheet-cols-menuitem luckysheet-copy-btn luckysheet-mousedown-cancel">
                                <div class="luckysheet-cols-menuitem-content luckysheet-mousedown-cancel">
                                ${mName}<span class="luckysheet-submenu-arrow" style="user-select: none;">${subMenuItem.iconHtml || ''}</span>
                                </div>
                            </div>`
                        }
                    });
                    subMenuHtm += '</div>'
                } else {
                    menuHtm += `<div id="${menuId}" data-id="${menuItem.id}" class="custom-menuitem luckysheet-cols-menuitem luckysheet-mousedown-cancel">
                    <div class="luckysheet-cols-menuitem-content luckysheet-mousedown-cancel">
                    ${menuName}<span class="luckysheet-submenu-arrow" style="user-select: none;">${menuItem.iconHtml || ''}</span>
                    </div>
                </div>`
                }
            }
        });

        if (menuHtm.length > 0) {
            menuHtm += `<div class="luckysheet-menuseparator luckysheet-mousedown-cancel" role="separator"></div>`
        }
    }

    return {
        menuHtm, subMenuHtm
    };
}

/**
 * 自定义操作栏按钮
 */
export function toolBarHtml() {
    /**
     * @type {[{id: string, zh: string, en: string, iconClass: string, onClick?: function()}]}
     */
    let barConf = customConfig.toolBar;
    let reHtml = '';
    let lang = Store.lang;

    if (barConf && barConf.length > 0) {
        barConf.forEach((item) => {
            if(item && item.id) {
                let tmpID = `cus-toolbar-${item.id}`;
                let tmpName = item[lang] || '';

                reHtml += `<div class="custom-toolbar-item luckysheet-toolbar-button luckysheet-inline-block" data-tips="${tmpName}"
                id="${tmpID}" data-id="${item.id}" role="button" style="user-select: none;">
                    <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
                    style="user-select: none;">
                        <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block"
                        style="user-select: none;">
                            <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                            style="user-select: none;font-size: 14px;">
                                <i class="${item.iconClass}" aria-hidden="true" style="color: #717171;">
                                </i>
                            </div>
                        </div>
                    </div>
                </div>`;
            }
        });
        reHtml += `
        <div class="luckysheet-toolbar-separator luckysheet-inline-block" style="user-select: none;">
        </div>`;
    }

    return reHtml;
}
