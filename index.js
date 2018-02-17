const Promise = require('promise');
const fs = require('fs');
const express = require('express');

/**
 * Creates a router that defines the routes dynamically by convention in terms of the view file names.
 */
function viewRouter() {
    var router = express.Router();

    router.use('/', (req, res, next) => {
        checkView(req)
            .then(view => {
                if (view) {
                    // found view file corresponding to url
                    if (res.locals.view) {
                        console.warn('ignoring specified view', res.locals.view);
                    }
                    res.render(view, res.locals);
                }
                else {
                    // could not find any view file corresponding to url
                    if (res.locals.view) {
                        // use specified view
                        res.render(res.locals.view, res.locals);
                    }
                    else {
                        // no view found or specified -- view routing should skip this request
                        next();
                    }
                }
            }, e => {
                // view check failed for some reason
                next(e);
            })
        ;
    });

    return router;
}

/**
 * Takes request and returns promise that results to view.
 * Checks views directory for existence of file.
 * Resolves to false if no view file is found.
 * Examples:
 * If the request path is "/", it will resolve to "index" (as long as "index.hbs" file exists in views directory)
 * If the request path is "/about", it will resole to "about" (as long as "about.hbs" file exists in views directory)
 * If the request path is "/menu/group", it will resolve to "menu/group" (as long as "menu/group.hbs" file exists in views directory).
 * If the request path is "/admin" but "admin.hbs" file does not exist, it will resolve to false.
 *
 */
function checkView(req) {
    return new Promise((resolve, reject) => {
        var view = trimSlashes(req.path) || 'index';
        var viewDirectory = req.app.get('views');
        var extension = req.app.get('view engine');
        var file = `${viewDirectory}/${view}.${extension}`;
        fs.access(file, (err) => {
            if (err) {
                return resolve(false);
            }
            else {
                return resolve(view);
            }
        });
    });
}

function trimSlashes(path) {
    return String(path).split('/').filter(part => part).join('/');
}

module.exports = viewRouter;
