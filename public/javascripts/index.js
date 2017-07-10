const width = 100;
const height = 100;
let color = '#000';
const ws = new WebSocket('ws://localhost:8080/');

$(() => {
  const container = $('#container');
  for (let i = 0; i < width; i++) {
    const row = $('<div class="cell-row" />');
    for (let j = 0; j < height; j++) {
      row.append(`<div class="cell" data-x=${i} data-y=${j}/>`);
    }
    container.append(row);
  }

  $.ajax({
    url: 'http://localhost:3000/canvas',
    type: 'GET',
  })
    .done(function(result) {
      result.map((pixel) => {
        $(`.cell[data-x="${pixel.x}"][data-y="${pixel.y}"]`).css('background-color', pixel.color);
      });
    })
    .fail(function(err) {
      console.log(err);
    });

  ws.addEventListener('message', ({ data }) => {
    const pixel = JSON.parse(data);
    $(`.cell[data-x="${pixel.x}"][data-y="${pixel.y}"]`).css('background-color', pixel.color);
  });

  container.on('click', '.cell', function() {
    const cell = $(this);
    
    const data = {
      x: cell.data('x'),
      y: cell.data('y'),
      color,
    };

    ws.send(JSON.stringify(data));
    $.ajax({
      url: 'http://localhost:3000/canvas',
      data,
      type: 'POST',
    })
      .done(function(pixel) {
        cell.css('background-color', pixel.color);
      })
      .fail(function(result) {
        console.log(result);
      });
  });

  $("#colorpicker").spectrum({
    showPaletteOnly: true,
    showPalette: true,
    color: 'black',
    change: (c) => {color = c.toHexString();},
    palette: [
        ['white', 'lightgrey', 'darkgrey',
        'black', 'pink', 'red', 'orange', 'brown'],
        ['yellow', 'lightgreen', 'green', 'lightblue', 'darkblue', 'blue', '#EE82EE', 'purple']
    ]
  });
});