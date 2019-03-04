

function getMoreURLs() {

  var xhttp  = new XMLHttpRequest();
  var marker = $list.dataset.marker;
  var args   = marker ? '?marker=' + marker : '';
  var url    = $list.dataset.endpoint + args;
;
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
      var response = this.response;
      console.log(response);
      $list.setAttribute('data-marker', response.marker);

      response.results.forEach(function(e){
        var $c = document.getElementById('url-alias-template');
        $c = $c.cloneNode(true);
        $c.removeAttribute('id');
        $c.classList.remove('hidden');
        $c.querySelector('.entry__alias').innerText = e.Key;
        $c.querySelector('.entry__redirect').innerText = e.WebsiteRedirectLocation;
        $list.append($c);
      });
    }
  };
  console.log(url);
  xhttp.responseType = 'json';
  xhttp.open('GET', url, true);
  xhttp.send();
}