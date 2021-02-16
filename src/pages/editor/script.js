const {ipcRenderer} = require('electron');

const textarea = document.getElementById('text');
const title = document.getElementById('title');

ipcRenderer.on('set-file', function(event, data){

  console.log(data)
  textarea.value = data.content;
  title.innerHTML = data.name;
  editorColor();

})

function handleChangeText() {
  ipcRenderer.send('update-content', textarea.value)
}

function editorColor() {

  setTimeout(
    () => {
      let text = document.getElementById('text');
      let style = document.getElementById('style');
      let saida = text.value;
      /*
      saida = saida.replace(/ /g, '&nbsp');
      saida = saida.replace(/\n/g, '<br />');
      saida = saida.replace(/^banana&nbsp/g, '<span style="color:red">banana</span>&nbsp');
      saida = saida.replace(/^banana$/g, '<span style="color:red">banana</span>&nbsp');
      saida = saida.replace(/banana$/g, '<span style="color:red">banana</span>');
      saida = saida.replace(/&nbspbanana$/g, '&nbsp<span style="color:red">banana</span>');
      saida = saida.replace(/&nbspbanana&nbsp/g, '&nbsp<span style="color:red">banana</span>&nbsp');
      saida = saida.replace(/&nbspbanana&nbsp/g, '&nbsp<span style="color:red">banana</span>&nbsp');
      */

      style.innerHTML = saida;
    }, 2
  )

}
