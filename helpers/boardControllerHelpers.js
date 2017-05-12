exports.parseQueryString = ( string ) => {
  let query = string.split('=');
  return { [query[0]]: query[1] };
}

exports.parseQuery = ( query ) => {
  let queries = query.split(',');
  let obj = {};

  for (var i = 0; i < queries.length; i++) {
    obj = Object.assign({}, obj, exports.parseQueryString( queries[i]) )
  };

  return obj;
}
