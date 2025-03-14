let letters = "0123456789ABCDEF";
function click(){
    changer.style.color = `#${Math.floor(Math.random()*16)}${Math.floor(Math.random()*16)}${Math.floor(Math.random()*16)}`
}

var b = document.createElement("button");
var changer = document.createElement("div");
changer.innerText = "Hello, World!";
b.innerText = "Change style";
b.onclick = click;
document.body.append(b);
document.body.append(changer);

