var $form = document.querySelector('form');
console.log($form);
if($form) {
  $form.addEventListener('submit', function(event){
    event.preventDefault()
    addMessage('...')
    shortenLink(event.target.action, event.target.url.value)
  });
}


function shortenLink (apiUrl, longUrl) {
    var xhttp = new XMLHttpRequest();
    var data  = JSON.stringify({url: longUrl});
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
       }
     };

   xhttp.open("POST", apiUrl, true);
   xhttp.send();
}

function addMessage (text) {
  $('#message').text(text).show()
}