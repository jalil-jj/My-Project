const courseModel = require('./../../models/course')
const sessionModel = require('./../../models/session')
const mongoose = require('mongoose')
const courseUserModel = require('./../../models/course-user')
const categoryModel = require('./../../models/category')
const commentModel = require('./../../models/comment')



exports.create = async (req, res) => {
    const {
        name,
        description,
        support,
        href,
        price,
        status,
        discount,
        categoryID,
    } = req.body

    const course = await courseModel.create({
        name,
        description,
        cover: req.file.filename,
        support,
        href,
        price,
        status,
        discount,
        categoryID,
        creator: req.user._id
    })

    const mainCourse = await courseModel.findById(course._id).populate("creator", "-password").populate("categoryID")

    return res.json(mainCourse)
}

exports.getAll = async (req, res) => {
    const courses = await courseModel.find({})
        .populate("categoryID")
        .populate("creator")
        .lean()
        .sort({ _id: -1 })

    const registers = await courseUserModel.find({}).lean()
    const comments = await commentModel.find({}).lean()

    const allCourses = []

    courses.forEach(course => {
        let courseTotalScore = 5;
        const courseRegister = registers.filter(
            (register) => register.course.toString() === course._id.toString());

        const courseComments = comments.filter((comment) => {
            return comment.course.toString() === course._id.toString()
        })

        courseComments.forEach(comment => courseTotalScore += Number(comment.score))


        allCourses.push({
            ...course,
            categoryID: course.categoryID.title,
            creator: course.creator?.name,
            registers: courseRegister.length,
            courseAverageScore: Math.floor(courseTotalScore / (courseComments.length + 1))
        })
    })

    return res.json(allCourses)

}

exports.getOne = async (req, res) => {
    try {
        const { href } = req.params;

        // گرفتن اطلاعات دوره همراه با creator و categoryID
        const course = await courseModel.findOne({ href })
            .populate("creator", "-password")
            .populate("categoryID")
            .lean();

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // گرفتن سشن‌های دوره
        const sessions = await sessionModel.find({ course: course._id }).lean();

        // گرفتن همه کامنت‌ها برای این دوره که تایید شده‌اند همراه با اطلاعات creator
        const comments = await commentModel.find({ course: course._id, isAccept: 1 })
            .populate("creator", "name")
            .lean();

        // تعداد دانشجویان دوره
        const courseStudentCount = await courseUserModel.find({ course: course._id }).countDocuments();

        // بررسی ثبت نام کاربر جاری در دوره
        const isUserRegisterToThisCourse = !!(await courseUserModel.findOne({
            user: req.user?._id,
            course: course._id
        }));

        // جدا کردن کامنت‌های اصلی (بدون mainCommentID)
        const mainComments = comments.filter(comment => !comment.mainCommentID);

        // جدا کردن پاسخ‌ها (کامنت‌هایی که mainCommentID دارند)
        const answerComments = comments.filter(comment => comment.mainCommentID);

        // متصل کردن پاسخ‌ها به کامنت‌های اصلی در آرایه answers
        mainComments.forEach(mainComment => {
            mainComment.answers = answerComments.filter(
                answer => String(answer.mainCommentID) === String(mainComment._id)
            );
        });

        res.json({
            course,
            sessions,
            comments: mainComments,  // کامنت‌های اصلی همراه با پاسخ‌ها
            courseStudentCount,
            isUserRegisterToThisCourse
        });

    } catch (error) {
        console.error("getOne Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.removeCourse = async (req, res) => {
    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isIdValid) {
        return res.status(409).json({
            message: "This Id is not valid !!!"
        })
    }

    const deleteCourse = await courseModel.findOneAndDelete({ _id: req.params.id })

    if (!deleteCourse) {
        return res.status(422).json({
            message: "Course not founded !!!"
        })
    }

    return res.json({
        message: "Delete Course successfully !!!",
        deleteCourse
    })

}

exports.getRelated = async (req, res) => {
    const { href } = req.params;

    const course = await courseModel.findOne({ href })

    if (!course) {
        return res.json({
            message: "Course not founded !!!"
        })
    }

    let relatedCourses = await courseModel.find({
        categoryID: course.categoryID
    })

    relatedCourses = relatedCourses.filter(course => course.href !== href)

    return res.json(relatedCourses)
}

exports.createSession = async (req, res) => {
    const { title, time, free } = req.body;
    const { id } = req.params;

    const session = await sessionModel.create({
        title,
        time,
        free,
        course: id,
        video: req.file.filename
    })

    // const mainSession = await sessionModel.findById(session._id).populate('course')

    return res.status(201).json(session)
}

exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await sessionModel.find({}).populate("course", "name").lean();
        return res.json(sessions);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
}



// exports.getSessionInfo = async (req, res) => {

//     const course = await courseModel.findOne({ href: req.params.href })

//     const session = await sessionModel.findById(req.params.sessionID)

//     const allSessions = await sessionModel.find({ course: course._id })

//     return res.json({ session, allSessions })

// }

exports.getFreeSessions = async (req , res) => {
    const { href, sessionID } = req.params;

    const course = await courseModel.findOne({ href });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const session = await sessionModel.findById(sessionID);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.free !== 0 ) {
        return res.status(403).json({ message: "شما به این جلسات دسترسی ندارید !!!" });
    }

    const allSessions = await sessionModel.find({ course: course._id }).lean();
    return res.json({ session, allSessions });
}


exports.getSessionInfo = async (req, res) => {
    const { href, sessionID } = req.params;

    const course = await courseModel.findOne({ href });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const session = await sessionModel.findById(sessionID);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.free !== 0) {
        if (!req.user) {
            return res.status(401).json({ message: "لطفاً ابتدا وارد شوید" });
        }

        const isRegistered = await courseUserModel.findOne({
            user: req.user._id,
            course: course._id
        });

        if (!isRegistered) {
            return res.status(403).json({ message: "شما به این جلسه دسترسی ندارید" });
        }
    }

    const allSessions = await sessionModel.find({ course: course._id }).lean();

    return res.json({ session, allSessions });
};


exports.removeSession = async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: "This id is not valid !!!"
        })
    }

    const result = await sessionModel.findOneAndDelete({ _id: id })

    return res.json({
        message: "Delete session successfully :))",
        result
    })
}

exports.register = async (req, res) => {

    const isUserAlreadyRegister = await courseUserModel.findOne({
        user: req.user._id,
        course: req.params.courseID
    })

    if (isUserAlreadyRegister) {
        return res.status(409).json({
            message: "User already registered in this course"
        })
    }

    const register = await courseUserModel.create({
        user: req.user._id,
        course: req.params.courseID,
        price: req.body.price
    })

    return res.status(201).json({
        message: "Regiser user successfully :))",
        register
    })
}


exports.getCoursesByCategory = async (req, res) => {
    const { href } = req.params;
    const category = await categoryModel.findOne({ href })

    if (category) {
        const categoryCourses = await courseModel.find({ categoryID: category._id })
        res.json(categoryCourses)
    } else {
        res.json([])
    }
}

exports.getSessionsOfCourse = async (req, res) => {
    const course = await courseModel.findOne({ href: req.params.href });
    if (!course) return res.status(404).json({ message: "Course not found" });
  
    const sessions = await sessionModel.find({ course: course._id }).lean();
  
    return res.json(sessions);
  };
  

exports.editCourse = async (req, res) => {

    try {
        const { id } = req.params;
        const {
            name,
            description,
            support,
            href,
            price,
            status,
            discount,
            categoryID,
        } = req.body;

        const course = await courseModel.findById(id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // اگر فایل جدید ارسال شده، تصویر قبلی رو پاک کن
        if (req.file) {
            // اینجا می‌تونی fs.unlinkSync استفاده کنی برای حذف فایل قبلی:
            // fs.unlinkSync(`uploads/courses/${course.cover}`);
            course.cover = req.file.filename;
        }

        // بقیه اطلاعات رو به‌روزرسانی کن
        course.name = name;
        course.description = description;
        course.support = support;
        course.href = href;
        course.price = price;
        course.status = status;
        course.discount = discount;
        course.categoryID = categoryID;

        await course.save();

        const updated = await courseModel.findById(course._id)
            .populate("creator", "-password")
            .populate("categoryID");

        res.json(updated);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }

}