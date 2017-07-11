const width = 100;
const height = 100;
let color = '#000';
const ws = new WebSocket('ws://localhost:8080/');
let allow = true;
const COOLDOWNTIME = 1;
const PIXELANIMATIONTIME = 5000;
const colors = ['#ffffff', '#d3d3d3', '#a9a9a9', '#000000', '#ffc0cb', '#ff0000', '#ffa500', '#a52a2a', '#ffff00', '#90ee90', '#008000', '#add8e6', '#00008b', '#0000ff', '#EE82EE', '#800080'];

$(() => {
  const container = $('#container');
  const loginForm = $('#login-form');
  const navbarUsername = $('#navbar-username');
  const timerContainer = $('#timer');
  const timer = new Timer().options({
    onstart: () => {
      timerContainer.html(`Cooldown: ${COOLDOWNTIME}s`);
      allow = false;
    },
    onend: () => {
      timerContainer.html('Cooldown: 0s');
      allow = true;
    },
    ontick: (time) => {
      timerContainer.html(`Cooldown: ${Math.round(time/1000)}s`);
    },
  });

  for (let i = 0; i < width; i++) {
    const row = $('<div class="cell-row" />');
    for (let j = 0; j < height; j++) {
      row.append(`<div class="cell" data-x=${j} data-y=${i}/>`);
    }
    container.append(row);
  }

  $.ajax({
    url: 'http://localhost:3000/canvas',
    type: 'GET',
  })
    .done(function(result) {
      const lengthLog = Math.log(result.length);
      result.map((pixel, index) => {
        const addpixel = () => {
          $(`.cell[data-x="${pixel.x}"][data-y="${pixel.y}"]`).css('background-color', pixel.color);
        }
        const sleeptime = ((Math.log(index) / lengthLog) * PIXELANIMATIONTIME);
        setTimeout(addpixel.bind(pixel), sleeptime);
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
    if (!allow) return;
    const cell = $(this);
    
    const data = {
      x: cell.data('x'),
      y: cell.data('y'),
      color,
    };

    // const data = {
    //   x: Math.floor(Math.random() * 100),
    //   y: Math.floor(Math.random() * 100),
    //   color: colors[Math.floor(Math.random() * colors.length)],
    // };

    // ws.send(JSON.stringify(data));
    timer.start(COOLDOWNTIME);
    $.ajax({
      url: '/canvas',
      data,
      type: 'POST',
    })
      .done(function(pixel) {
        // cell.css('background-color', pixel.color);
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

  loginForm.submit(function(e) {
    e.preventDefault();
    const formBody = {};
    const formValues = $(this).serializeArray();
    formValues.forEach(function(input) {
      formBody[input.name] = input.value;
    });
    $.ajax({
      url: 'http://localhost:3000/user/login',
      data: formBody,
      type: 'POST',
    })
      .done(function(res) {
        loginForm.addClass('hide');
        navbarUsername.html(`Welcome, ${res.data.username}`).removeClass('hide');
      })
      .fail(function(err) {
        console.log(err);
      });
  });
});
