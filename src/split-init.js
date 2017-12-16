const Split = require('split.js');

window.splitEvents = {onDrag: [], onDragStart: [], onDragEnd: []};
window.splits = [];
const genListner = function(ename){
  return function(){
    for(var i in window.splitEvents[ename]) window.splitEvents[ename][i]();
  }
};

$(document).ready(function(){
  window.splits.push(Split(['#left-view', '#right-view'], {
    direction: 'horizontal',
    sizes: [33, 67],
    onDrag: genListner('onDrag'),
    onDragStart: genListner('onDragStart'),
    onDragEnd: genListner('onDragEnd')
  }));
  window.splits.push(Split(['#left-view-top', '#left-view-bottom'], {
    direction: 'vertical',
    sizes: [33, 67],
    onDrag: genListner('onDrag'),
    onDragStart: genListner('onDragStart'),
    onDragEnd: genListner('onDragEnd')
  }));

});