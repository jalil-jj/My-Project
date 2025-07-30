const articlesModel = require('./../../models/articles');

exports.getAll = async (req, res) => {
  try {
    const articles = await articlesModel.find().populate('categoryID').populate('creator');
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: 'خطا در دریافت مقالات', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      title,
      description,
      body,
      href,
      categoryID
    } = req.body;

    const covers = req.files?.map(file => file.filename);

    const article = await articlesModel.create({
      title,
      description,
      body ,
      href,
      covers,
      categoryID,
      creator: req.user._id,
      publish: 1,
    });

    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: 'خطا در ساخت مقاله', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const article = await articlesModel.findOne({ href: req.params.href }).populate('categoryID').populate('creator');
    if (!article) return res.status(404).json({ message: 'مقاله یافت نشد' });
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: 'خطا در دریافت مقاله', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const article = await articlesModel.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'مقاله‌ای با این ID پیدا نشد' });
    res.status(200).json({ message: 'مقاله حذف شد' });
  } catch (err) {
    res.status(500).json({ message: 'حذف مقاله با خطا مواجه شد', error: err.message });
  }
};

exports.saveDraft = async (req, res, next) => {
  try {
    const { title, description, body, shortName, categoryID } = req.body;

    const duplicatedShortname = await articlesModel.findOne({ shortName });
    if (duplicatedShortname) {
      return res.status(409).json({ message: "نام کوتاه تکراری است" });
    }

    const cover = req.file?.filename;

    // اگر متد اعتبارسنجی داری، اینجا باید صدا زده بشه
    if (articlesModel.validation) {
      await articlesModel.validation({ ...req.body, cover }).catch(err => {
        err.statusCode = 400;
        throw err;
      });
    }

    const article = await articlesModel.create({
      title,
      description,
      shortName,
      body,
      creator: req.user._id,
      categoryID,
      cover,
      publish: 0, // ذخیره به عنوان پیش‌نویس
    });

    const draftedArticle = await article.populate("creator", "-password");

    return res.status(201).json(draftedArticle);
  } catch (error) {
    next(error);
  }
};
