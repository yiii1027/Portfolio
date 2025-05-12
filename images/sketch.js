let colorsSpring = ["#FF1493", "#FF6347", "#FF8C00", "#32CD32", "#FFFF00"];
let colorsSummer = ["#00FFFF", "#4682B4", "#32CD32", "#FFD700", "#FF4500"];
let colorsAutumn = ["#FF6347", "#B22222", "#FF8C00", "#DAA520", "#FF4500"];
let colorsWinter = ["#00BFFF", "#ADD8E6", "#5F9EA0", "#FFFFFF", "#D3D3D3"];

let seasons = [];
let activeSeason;
let treeData = [];
let overAllTexture;
let musicTracks = [];
let currentTrackIndex = 0;
let currentMusic;

let mouseXprev, mouseYprev;

function preload() {
  // 確保文件名與文件路徑正確
  musicTracks = [
    loadSound('track1.mp3'),
    loadSound('track2.mp3'),
    loadSound('track3.mp3'),
    loadSound('track4.mp3')
  ];
}

function setup() {
  createCanvas(windowWidth, windowHeight); // 創建畫布
  pixelDensity(3); // 設置像素密度

  // 創建背景紋理
  overAllTexture = createGraphics(width, height);
  overAllTexture.loadPixels();
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      overAllTexture.set(i, j, color(100, noise(i / 3, j / 3, i * j / 50) * random([0, 20, 40])));
    }
  }
  overAllTexture.updatePixels();

  // 播放第一首音樂
  if (musicTracks[0]) {
    currentMusic = musicTracks[0];
    userStartAudio().then(() => currentMusic.play()); // 播放第一首音樂一次
  }

  // 初始化四季
  seasons.push(new Spring());
  seasons.push(new Summer());
  seasons.push(new Autumn());
  seasons.push(new Winter());

  // 預設季節為春天
  activeSeason = new Spring();

  let activeColors = getSeasonColors();

  treeData = {
    color: color(random(activeColors)),
    z: 0,
    xspan: width / 20,
    yspan: height / 10,
    next: [],
  };

  push();
  translate(width / 2, height - 50); 
  generateBranch(10, activeColors, treeData); 
  pop();
  background(0); // 預設為黑色背景

  // 初始化滑鼠變數
  mouseXprev = mouseX;
  mouseYprev = mouseY;

  createMenu(); // 創建菜單
  createMessageBox(); // 創建訊息框
}

function createMenu() {
  const hamburgerButton = select('#hamburger-menu');
  const menuOptions = select('#menu-options');

  // 漢堡按鈕點擊事件
  if (hamburgerButton) {
    hamburgerButton.mousePressed(() => {
      const isVisible = menuOptions.style('display') === 'block';
      menuOptions.style('display', isVisible ? 'none' : 'block');
    });
  }

  // 顯示訊息按鈕事件
  const showTextButton = select('#show-message');
  if (showTextButton) {
    showTextButton.mousePressed(() => {
      displayMessage('大家好！我是林芷伊！<br>目前就讀台北科技大學互動系二年級<br>高中畢業於台中高工圖文傳播科<br>目前還在探索未來中~<br>未來如有更多作品累積再分享給大家！');
    });
  }

  const personalInfoContainer = select('#personal-info');
if (personalInfoContainer) {
  const img = createImg('your-image.jpg', '個人照片');
  img.id('info-image');
  img.parent(personalInfoContainer); // 加入到個人資訊容器的頂部
}

  // 切換音樂按鈕事件
  const changeMusicButton = select('#change-music');
  if (changeMusicButton) {
    changeMusicButton.mousePressed(changeMusic);
  }
}

function createMessageBox() {
  const messageBox = createDiv('');
  messageBox.id('message-box');
  messageBox.style('display', 'none'); // 預設隱藏
}

function displayMessage(message) {
  const messageBox = select('#message-box');
  messageBox.html(message); // 設定顯示文字
  messageBox.style('display', 'block'); // 顯示訊息框
}

function changeMusic() {
  // 停止當前音樂並切換到下一首
  if (currentMusic) {
    currentMusic.stop();
  }
  currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
  currentMusic = musicTracks[currentTrackIndex];
  if (currentMusic) {
    currentMusic.play(); // 播放一次
  } else {
    console.log('音樂文件未加載或文件不存在');
  }
}

document.addEventListener('click', (e) => {
  const messageBox = select('#message-box');
  if (messageBox && e.target.id !== 'message-box' && e.target.id !== 'show-message') {
      messageBox.style('display', 'none'); // 点击空白处隐藏文字框
  }
});

function getSeasonColors() {
  if (activeSeason instanceof Spring) {
    return colorsSpring;
  } else if (activeSeason instanceof Summer) {
    return colorsSummer;
  } else if (activeSeason instanceof Autumn) {
    return colorsAutumn;
  } else if (activeSeason instanceof Winter) {
    return colorsWinter;
  }
  return [color(255)]; // default color
}

function toggleSeason() {
  console.log("切換季節觸發");  // 查看是否有觸發

  // 清除當前季節的效果
  clearSeason();

  // 根據當前季節，切換到下一季節
  if (activeSeason instanceof Summer) {
    activeSeason = new Autumn();
  } else if (activeSeason instanceof Autumn) {
    activeSeason = new Winter();
  } else if (activeSeason instanceof Winter) {
    activeSeason = new Spring();
  } else if (activeSeason instanceof Spring) {
    activeSeason = new Summer();
  }

  console.log("當前季節：", activeSeason.constructor.name); // 輸出當前季節，確保它有被更新

  // 重新生成季節粒子和樹木
  activeSeason = new activeSeason.constructor(); // 重新初始化當前季節

  let activeColors = getSeasonColors();
  treeData.color = color(random(activeColors));

  // 重置畫布和樹木
  background(0); // 清空背景
  treeData = {
    color: color(random(activeColors)),
    z: 0,
    xspan: width / 20,
    yspan: height / 10,
    next: [],
  };

  push();
  translate(width / 2, height - 50);
  generateBranch(10, activeColors, treeData); 
  pop();
}

function clearSeason() {
  if (activeSeason && activeSeason.elements) {
    activeSeason.elements = []; // 清空當前季節的粒子
  }
  clear(); // 完全清空畫布
  background(0); // 重置背景為黑色
}

function draw() {
  background(0, 40);
  activeSeason.update();
  activeSeason.draw();

  push();
  translate(width / 2, height - 20);
  rotate(PI);
  drawTreeByData(treeData);
  pop();

  push();
  blendMode(MULTIPLY);
  image(overAllTexture, 0, 0);
  pop();
}

function generateBranch(d, colorScheme, treeData = {}, z = 0) {
  let xspan = random(5, 9) * random() * (width / 1000);
  let yspan = random(40, 200) * random(0.2, 1) * (height / 1000);
  let c = color(random(colorScheme));
  let exp = random(2.5, 5);

  c.setRed(c._getRed() + random(-10, 10));
  c.setBlue(c._getBlue() + random(-10, 10));
  c.setGreen(c._getGreen() + random(-10, 10));
  noStroke();
  c.setAlpha(255);  // 增加顏色的強度，使顏色不透明
  fill(c);
  let sc = random(0.91, 0.99);
  triangle(0, 0, -xspan, yspan, xspan, yspan);

  treeData.color = c;
  treeData.z = z;
  treeData.xspan = xspan;
  treeData.yspan = yspan;
  treeData.randomId = int(random(10000));

  treeData.next = [];
  if (d > 0) {
    let ang;
    push();
    translate(-xspan, yspan);
    ang = sin(d / 10) / exp + noise(d / 50 - 0.5) / exp;
    rotate(ang);
    scale(sc);
    let obj = { sc, xspan, yspan, ang };
    treeData.next.push(obj);
    generateBranch(d - 1, colorScheme, obj, z + 1);
    pop();
    push();
    translate(xspan, yspan);
    ang = -sin(d / 10) / exp - noise(d / 2 - 0.5) / exp;
    rotate(ang);
    scale(sc);
    let obj2 = { sc, xspan, yspan, ang };
    treeData.next.push(obj2);
    generateBranch(d - 1, colorScheme, obj2, z + 1);
    pop();
  }
}

function drawTreeByData(treeData) {
  let timeFactor = easeInOutCubic(map(frameCount - treeData.z * 50, 0, 100, 0, 1, true));
  push();
  let c = treeData.color || color(255, 255, 255);
  let xspan = treeData.xspan || 0;
  let yspan = treeData.yspan || 0;
  let ang = treeData.ang || 0;
  let sc = (treeData.sc || 1) * timeFactor;

  c.setAlpha(255);
  stroke(c);
  c.setAlpha(200);
  noFill();
  triangle(0, 0, -xspan, yspan, xspan, yspan);

  if (treeData.next) {
    translate(xspan / 2, yspan);
    rotate(ang + sin(frameCount / 50 + treeData.randomId) / 20);
    scale(sc);
    treeData.next.forEach(data => drawTreeByData(data));
  }
  pop();
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function keyPressed() {
  if (keyCode === 32) { // 空白鍵切換季節
    toggleSeason();
  }
  if (key === 's') { // 按下 's' 鍵保存畫布
    save("img_" + year() + month() + day() + ".png");
  }
}

class Spring {
  constructor() {
    this.elements = [];
    for (let i = 0; i < 100; i++) {  // 增加粒子數量
      this.elements.push({
        pos: createVector(random(width), random(height)),
        size: random(20, 50),  // 增加粒子大小
        color: color(random(colorsSpring)),
      });
    }
  }

  update() {
    this.elements.forEach(el => {
      el.pos.y += random(-3, 3);  // 增加粒子的速度
      el.pos.x += random(-3, 3); 
    });
  }

  draw() {
    blendMode(ADD);
    noStroke();
    this.elements.forEach(el => {
      fill(el.color);
      ellipse(el.pos.x, el.pos.y, el.size); // 花瓣
    });
  }
}

class Summer {
  constructor() {
    this.elements = [];
    for (let i = 0; i < 100; i++) {
      this.elements.push({
        pos: createVector(random(width), random(height)),
        size: random(20, 50),
        color: color(random(colorsSummer)),
      });
    }
  }

  update() {
    this.elements.forEach(el => {
      el.size *= 0.99;
      if (el.size < 5) el.size = random(10, 40);
    });
  }

  draw() {
    noStroke();
    blendMode(ADD);
    this.elements.forEach(el => {
      fill(el.color);
      rect(el.pos.x, el.pos.y, el.size, el.size); // 太陽光矩形
    });
  }
}

class Autumn {
  constructor() {
    this.elements = [];
    for (let i = 0; i < 100; i++) {
      this.elements.push({
        pos: createVector(random(width), random(height)),
        size: random(30, 60),  // 增加粒子大小
        angle: random(TWO_PI),
        color: color(random(colorsAutumn)),
      });
    }
  }

  update() {
    this.elements.forEach(el => {
      el.pos.y += 3; // 增加落下速度
      if (el.pos.y > height) el.pos.y = 0;
    });
  }

  draw() {
    blendMode(ADD);
    noStroke();
    this.elements.forEach(el => {
      fill(el.color);
      push();
      translate(el.pos.x, el.pos.y);
      rotate(el.angle);
      triangle(-el.size / 2, el.size / 2, el.size / 2, el.size / 2, 0, -el.size); // 落葉
      pop();
    });
  }
}

class Winter {
  constructor() {
    this.elements = [];
    for (let i = 0; i < 300; i++) {  // 增加雪花數量
      this.elements.push({
        pos: createVector(random(width), random(height)),
        size: random(10, 30),  // 增加雪花大小
        color: color(random(colorsWinter)),
      });
    }
  }

  update() {
    this.elements.forEach(el => {
      el.pos.y += random(2, 3);  // 加速雪花落下速度
      if (el.pos.y > height) el.pos.y = 0;
    });
  }

  draw() {
    blendMode(SCREEN);
    noStroke();
    this.elements.forEach(el => {
      fill(el.color);
      ellipse(el.pos.x, el.pos.y, el.size); // 雪花
    });
  }
}

function mouseDragged() {
  treeData.xspan += (mouseX - mouseXprev) * 0.3;  // 增加影響程度
  treeData.yspan += (mouseY - mouseYprev) * 0.3;
  mouseXprev = mouseX;
  mouseYprev = mouseY;
}
