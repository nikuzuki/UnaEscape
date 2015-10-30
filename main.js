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

    var timeLeft = 100 * core.fps;

    core.keybind(65, "a");
    core.keybind(68, "d");
    core.keybind(83, "s");
    core.keybind(87, "w");
    core.keybind(16, "shift");

    core.onload = function(){

      var titleName = new Label("UnaScape");
      titleName.x = WIDTH / 5;
      titleName.y = LENGTH / 5;

      var explain = new Label("wasd(shiftで低速)とマウスで生き残れ"); // 説明文

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

      var secondMessage = new Label("がんばれ");
      secondMessage.x = 10;
      secondMessage.y = 10;
      second.addChild(secondMessage);

      // がめんをタッチ後、secondSceneへ移行

      core.rootScene.addEventListener('touchstart', function(){
        core.pushScene(second);
      });

      /*
        スコア
      */
      var score = 0;
      var scoreLabel = new Label("score : " + score);
      scoreLabel.x = (WIDTH / 3) * 2;
      scoreLabel.y = 10;

      second.addChild(scoreLabel);

      /*
        タイム
      */

      var timeLabel = new Label('Time: ?');
      timeLabel.x = WIDTH / 2;
      timeLabel.y = 10;

      second.addChild(timeLabel);


      /*
      キャラ操作
      */

      var hero = new Sprite(64, 64);
      hero.image = core.assets['./images/obake.png'];
      hero.scale(0.5, 0.5); // 大きさを半分
      hero.x = WIDTH / 2;
      hero.y = (LENGTH / 5) * 4;

      hero.addEventListener('enterframe', function(){


        if (core.input.shift){
          if (core.input.a)
            if(hero.x >= -10) this.x -= 2.5;
          if (core.input.d)
            if(hero.x <= (WIDTH - 50)) this.x += 2.5;
          if (core.input.w)
            if(hero.y >= -10) this.y -= 2.5;
          if (core.input.s)
            if(hero.y <= (LENGTH - 50)) this.y += 2.5;
        }
        else {
          if (core.input.a)
            if(hero.x >= -10) this.x -= 5;
          if (core.input.d)
            if(hero.x <= (WIDTH - 50)) this.x += 5;
          if (core.input.w)
            if(hero.y >= -10) this.y -= 5;
          if (core.input.s)
            if(hero.y <= (LENGTH - 50)) this.y += 5;
        }
      });

      // TODO: 上から降って来るイクラの実装 何個かに一つ追尾

      second.addChild(hero);

      /*
        大トロ
      */

      var Ootoro = Class.create(Sprite, { // Spriteクラスから作る
        initialize: function(x, y){
          Sprite.call(this, 64, 45);  // spriteの時と同様
          this.x = x;
          this.y = y;
          this.image = core.assets['./images/ootoro.png'];
          this.on('enterframe', function(){
            this.rotate(5);
          });

          // タッチで消え、スコアを増やす
          this.on('touchstart', function(){
            score++;
            scoreLabel.text = 'Score: ' + score;
            second.removeChild(this);

          });

          this.tl.moveTo(hero.x, hero.y, 200);

          // TODO: 大トロの動きと判定を書く(判定はhero側でも良い)


          second.addChild(this);
        }
      });

      // TODO: 大トロがどのようにして画面端から出るのかを考え実装

      var ootoros = [];
      var area = 0;
      var toroCount = 0;

      // secondシーンに入ったら、タイマースタート
      second.addEventListener('enterframe', function(){
        timeLeft--;
        // 時間を整数値にして出力
        // timeLabel.text = 'Time: ' + parseInt(timeLeft / 60);
        timeLabel.text = 'Time: ' + timeLeft;

        if((timeLeft % 30) == 0){
          // 大トロが飛んで来る場所を決める
          console.log('うぇい');
          area = rand(4); // 0 ~ 3
          switch(area){
            case 0: // 上から
              ootoros[toroCount] = new Ootoro(rand(WIDTH), -55);
              break;
            case 1: // 右から
              ootoros[toroCount] = new Ootoro((WIDTH + 20), rand(LENGTH));
              break;
            case 2: // 下から
              ootoros[toroCount] = new Ootoro(rand(WIDTH), (LENGTH + 20));
              break;
            case 3: // 左から
              ootoros[toroCount] = new Ootoro(-60, rand(LENGTH));
              break;
          }
          toroCount++;
        }

        if(timeLeft <= 0){
          alert('Your score' + score);
          this.stop();
        }
      });

    }

    core.start();
};

function rand(n){
  return Math.floor(Math.random() * (n+1)); // 0以上1未満の値*(n+1)の最大の整数値を返す
}
