enchant();

/*

Core
- rootScene ゲームのシーン
--Sprite (bear) キャラ部品のこと

*/

window.onload = function(){
    //console.log("hello world");

    var core = new Core(320, 320);  //Coreオブジェクト
    core.preload('chara1.png');     // クマの画像を読みだす
    core.fps = 60;
    core.onload = function(){

      var explain = new Label("うなすけを守れ"); // 説明文

      explain.x = 100;
      explain.y = 150;

      core.rootScene.backgroundColor = "#b38f76"; // 茶色っぽい背景
      core.rootScene.addChild(explain);

      // 2つ目のシーン
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

      /*
      var Bear = Class.create(Sprite, { // Spriteクラスから作る
        initialize: function(x, y){
          Sprite.call(this, 32, 32);  // spriteの時と同様
          this.x = x;
          this.y = y;
          this.image = core.assets['chara1.png'];
          this.frame = rand(5);
          this.opacity = rand(100) / 100; // 透明度
          this.on('enterframe', function(){
            this.rotate(rand(10));
          });

          core.rootScene.addChild(this);
        }
      });
      */

    }

    core.start();
};

function rand(n){
  return Math.floor(Math.random() * (n+1)); // 0以上1未満の値*(n+1)の最大の整数値を返す
}
