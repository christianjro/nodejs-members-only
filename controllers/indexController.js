
exports.index = async (req, res, next) => {
    try {
        res.render('index', { title: 'Express' });
    } catch (err) {
        next(err);
    }
};