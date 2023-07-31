
const style = {
  top:0,
  right:0,
}
const Notification =(type, msg, duration = 2000) => {
  const mainDiv = document.createElement('div');
  document.body.appendChild(mainDiv);
  
  const msgSpan = document.createElement('span');
  mainDiv.appendChild(msgSpan);
  msgSpan.style.color = 'white';
  msgSpan.style.textShadow = '1px 1px 2px black';
  msgSpan.innerHTML = msg;

  let bg = 'white';
  switch (type) {
    case 'info':
      bg = '#f7f7b5'
      break;
    case 'error':
      bg = 'red';
      break;
    case 'success':
      bg = 'green';
      break;

    default:
      console.error(`Can't Find Color Code for type:${type}`);
      break;
  }
  mainDiv.style.position = 'absolute';
  mainDiv.style.width = '250px';
  mainDiv.style.height = 'auto';
  mainDiv.style.padding = '1rem';
  mainDiv.style.top = '0';
  mainDiv.style.right = '0';
  mainDiv.style.margin = `1rem`;
  mainDiv.style.borderRadius = '10px';
  mainDiv.style.backgroundColor = bg;
  mainDiv.style.boxShadow = `1px 1px 2px black`;

  
  setTimeout(() => {
    mainDiv.remove();
  }, duration);
}

export default Notification