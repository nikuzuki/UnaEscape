/*
  UnaEscape
*/

enchant();

const WIDTH = 480;
const LENGTH = 480;

window.onload = function(){
    //console.log("hello world");

    var core = new Core(WIDTH, LENGTH);  //Coreオブジェクト
    core.preload('chara1.png');     // クマの画像を読みだす
    core.preload('./images/ootoro.png');
    core.preload('./images/obake.png');
    core.fps = 60;

    core.keybind(65, "a");
    core.keybind(68, "d");
    core.keybind(83, "s");
    core.keybind(87, "w");

    core.onload = function(){

      var titleName = new Label("UnaScape");
      titleName.x = WIDTH / 5;
      titleName.y = LENGTH / 5;

      var explain = new Label("wasdとマウスで生き残れ"); // 説明文

      explain.x = WIDTH / 3;
      explain.y = (LENGTH / 4) * 3;

      core.rootScene.backgroundColor = "#b38f76"; // 茶色っぽい背景
      core.rootScene.addChild(titleName);
      core.rootScene.addChild(explain);

      /*
        ゲームシーン(スコア稼ぎ)
      */
      var second = new Scene();
      second.backgroundColor = "#FF9999";

      var secondMessage = new Label("Hello, secondScene");
      secondMessage.x = 10;
      secondMessage.y = 10;
      second.addChild(secondMessage);

      // がめんをタッチ後、secondSceneへ移行

      core.rootScene.addEventListener('touchstart', function(){
        core.pushScene(second);
      });

      var ootoro = new Sprite(64, 45);
      ootoro.image = core.assets['./images/ootoro.png'];
      ootoro.x = 10;
      ootoro.y = 10;

      second.addChild(ootoro);

      var hero = new Sprite(64, 64);
      hero.image = core.assets['./images/obake.png'];
      hero.scale(0.5, 0.5); // 大きさを半分
      hero.x = WIDTH / 2;
      hero.y = (LENGTH / 5) * 4;

      hero.addEventListener('enterframe', function(){

        // キー操作 画面からは出ないようにする
        if (core.input.a)
          if(hero.x >= -10) this.x -= 5;
        if (core.input.d)
          if(hero.x <= (WIDTH - 50)) this.x += 5;
        if (core.input.w)
          if(hero.y >= -10) this.y -= 5;
        if (core.input.s)
          if(hero.y <= (LENGTH - 50)) this.y += 5;
      });

      second.addChild(hero);

    }

    core.start();
};

function rand(n){
  return Math.floor(Math.random() * (n+1)); // 0以上1未満の値*(n+1)の最大の整数値を返す
}
