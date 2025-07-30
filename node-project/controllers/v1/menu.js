const menuModel = require("./../../models/menu")


exports.getAll = async (req, res) => {
    const menus = await menuModel.find({}).lean();

    // یک Map درست میکنیم برای دسترسی سریع به منوها
    const menuMap = new Map();

    // همه منوها رو اول میریزیم تو Map
    menus.forEach(menu => {
        menu.submenus = [];
        menuMap.set(String(menu._id), menu);
    });

    const mainMenus = [];

    // حالا مرتب میکنیم
    menus.forEach(menu => {
        if (menu.parent) {
            // اگر parent داره یعنی زیرمنوه
            const parentMenu = menuMap.get(String(menu.parent));
            if (parentMenu) {
                parentMenu.submenus.push(menu);
            }
        } else {
            // اگر parent نداره یعنی منوی اصلیه
            mainMenus.push(menu);
        }
    });

    return res.json(mainMenus);
}

exports.create = async (req, res) => {
    const { title, href, parent } = req.body;

    const nemu = await menuModel.create({
        title, href, parent
    })

    return res.status(201).json(nemu)
}

exports.getAllInPanel = async (req, res) => {

    const menus = await menuModel.find({})
        .populate("parent", "title")
        
    return res.status(201).json(menus)
}

exports.getAllMainMenu = async (req, res) => {
    const menus = await menuModel.find({ parent: { $exists: false }}).lean();

    return res.status(200).json(menus);
};


exports.remove = async (req, res) => {
    const { id } = req.params;

    const menus = await menuModel.findByIdAndDelete(id)

    return res.json({
        message: "Delete Offs Successfully :))",
        menus
    })
}
