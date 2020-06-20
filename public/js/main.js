async function getData(url) {
  return await (await fetch(url)).json();
}

var drawChart = function (data, labels) {
  var ctx = document.getElementById('myChart');

  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: '# of Word Count',
          data: data,
          backgroundColor: [
            'rgba(63,81,181,0.2)',
            'rgba(0,150,136,0.2)',
            'rgba(121,85,72,0.2)',
            'rgba(27,94,32 ,0.2)',
            'rgba(41,98,255 ,0.2)',
            'rgba(245,127,23 ,0.2)',
            'rgba(55,71,79 ,0.2)',
            'rgba(73,130,5 ,0.2)',
            'rgba(227,0,140 ,0.2)',
            'rgba(16,124,16 ,0.2)',
          ],
          borderColor: [
            'rgba(63,81,181,1)',
            'rgba(0,150,136,1)',
            'rgba(121,85,72,1)',
            'rgba(27,94,32 ,1)',
            'rgba(41,98,255 ,1)',
            'rgba(245,127,23 ,1)',
            'rgba(55,71,79 ,1)',
            'rgba(73,130,5 ,1)',
            'rgba(227,0,140 ,1)',
            'rgba(16,124,16 ,1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
};

$(document).ready(function () {
  $('#web-scraper-form').on('submit', function (event) {
    event.preventDefault();

    $('#result').append($('#loading-template').html());
    $('#image-box').html('');
    $('#wordCount').html('');
    var canvas = document.getElementById('myChart');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    var formData = Object.create(null);

    $.each($(this).serializeArray(), function (_, field) {
      formData[field.name] = field.value;
    });

    if (formData.url != '') {
      if (!formData.url.startsWith('http')) {
        formData.url = 'http://' + formData.url;
      }

      (async function () {
        response = await getData('/api/scraper/?url=' + formData.url);
        if (response.error === null) {
          var labels = [],
            data = [];
          var firstTenWords = response.wordsResult.firstTenWords;

          for (var i = 0; i < firstTenWords.length; i++) {
            var [key, value] = Object.entries(firstTenWords[i])[0];
            labels.push(key);
            data.push(value);
          }
          $('#result .loading').remove();
          //-- chart with the firstTenWords returned
          drawChart(data, labels);

          //-- using mustache display the images in website
          var template = $('#image-slider-template').html();
          var html = Mustache.to_html(template, response);
          $('#image-box').html(html);

          template = $('#word-count-template').html();
          html = Mustache.to_html(template, response.wordsResult);
          $('#wordCount').html(html);
        }
      })();
    }
  });
});
