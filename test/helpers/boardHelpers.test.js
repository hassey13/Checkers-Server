const assert = require('assert');
const mongoose = require('mongoose');

const Board = require('../../models/board');
const User = require('../../models/user');
const Helpers = require('../../helpers/boardControllerHelpers');

describe('Helper for Board Controller', () => {

  it('parseQueryString parses a string to a key: value pair', done => {
    let query = 'lastUpdated=5-02-2017';

    assert( Helpers.parseQueryString( query ).lastUpdated === '5-02-2017' );
    done();
  });

  it('parse a query that has more than one parameter', done => {
    let query = `lastUpdated=5-12-2017,turn=blue`;
    let parsedQuery = Helpers.parseQuery( query );

    assert( parsedQuery.lastUpdated === '5-12-2017' );
    assert( parsedQuery.turn === 'blue' );
    done();
  });

});
