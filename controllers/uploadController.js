const upload = require("../middleware/upload")

exports.fileUpload = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            // res.send(err);
            res.render('index');
        } else {
            if (req.file == undefined) {
                res.send('No file selected!');
            } else {
                await prisma.file.create({
                    data: {
                        fileName: req.file.originalname,
                        filePath: req.file.path,
                        fileType: req.file.mimetype,
                        fileSize: req.file.size,
                        owner: req.user.id // Assuming you have user info in req.user
                    }
                });
                res.send('File uploaded successfully!');
            }
        }
    });
};