exports.convertDate = ( string ) => {
  function pad(s) { return (s < 10) ? '0' + s : s; }

  let d = new Date(string);
  return [d.getMonth()+1, pad(d.getDate()), d.getFullYear()].join('-');
}
