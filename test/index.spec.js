const should = require('should');

var viewRouter = require('../');

describe('viewRouter', () => {

    it('should be a function', () => {
        should(viewRouter).be.a.Function();
    });

});