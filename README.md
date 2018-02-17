#atomic-view-router
Express router that defines URL paths based primarily on the views directory structure

Example:
```
var viewRouter = require('atomic-view-router');

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use('/', viewRouter());
```

Suppose the "views" directory contains the following files:

* `about.hbs`
* `index.hbs`
* `groups/admin.hbs`

The existence of these files in the "views" directory will make the corresponding URL paths automatically
resolve to content rendered by those templates. For instance:

* The URL `/` will be rendered with `index.hbs`.
* The URL `/about` will be rendered with `about.hbs`.
* The URL `/groups/admin` will be rendered with `groups/admin.hbs`.

The data will always come from `response.locals`, where `response` is the argument of the middleware function.

## Defining data

With the view router, you can define middleware that focuses exclusively on defining data.
Put the data into the `response.locals` object and call `next` to skip the view router.

Make sure to set data in middleware ordered before the view router.

Example:
```
app.get('/calendar', function(request, response, next) {
    response.locals.events = [
        // define your event objects here
    ];
    next();
    // The view router will render "calendar.hbs" with everything provided in response.locals
})
```


## Missing views

If a URL path corresponds to a view file that does not exist, the view router will skip it, so it can be handled by
another middleware function.


## Specifying views

In your middleware before the view router where you define data to put into `response.locals`,
you can set `response.locals.view` to a string representing the explicit view that you would like to use,
in case the URL path does not correspond to any particular view file.

This is especially useful when routing for URL paths with parameters.

```
app.get('/category/:categoryId', function(request, response, next) {
    response.locals.view = 'category';
    response.locals.category = Categories.find(request.params.categoryId);
    if (!response.locals.category) {
        response.status(404);
    }
    next();
    // The view router will render "category.hbs" even though the URL path does not correspond to it exactly.
})
```
