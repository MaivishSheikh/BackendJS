import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb - CallBack
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        console.log(`${file.originalname} ${file.filename}`);
        cb(null, file.originalname); // what should be the name of the file
    },
});

export const upload = multer({
    storage,
});
