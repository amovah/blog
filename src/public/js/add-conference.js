const addConf = document.forms['add-conference'];

addConf.addEventListener('submit', e => {
  e.preventDefault();

  fetch(addConf.getAttribute('action'), {
    method: 'POST',
    credentials: 'include',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }),
    body: JSON.stringify({
      title: addConf.title.value,
      description: addConf.description.value
    })
  }).then(res => res.json()).then(data => {
    if (data.type === 2) {
      localStorage.setItem('requestforconferencesuccessful', 1);
      window.location.href = '/u';
    } else if (data.type === 0) {
      iziErr();
    }
  }).catch(() => {
    iziErr();
  });
});
