export default function (file, callback) {
  const xhr = new XMLHttpRequest();
  xhr.overrideMimeType('application/json');
  xhr.open('GET', file, true);
  xhr.onreadystatechange = function (response) {

    if (response.target.readyState !== 4 || response.target.status !== 200) {
      return false;
    }
    const json = response.target.response || null;
    callback(JSON.parse(json));
  };
  xhr.send(null);
}