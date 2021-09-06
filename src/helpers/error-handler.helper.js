const renderError = (res, error) => {
    const stack = error.env === 'development' ? error.stack : '';
    res.render('error', {message: error.message, status: error.status, error: error, stack});
}

exports.renderError = renderError;
