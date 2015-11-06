/*
  UnaEscape
*/

enchant();

const WIDTH = 480;
const LENGTH = 480;

var score = 0;
var couseOfDeath = "";

window.onload = function(){

    var core = new Core(WIDTH, LENGTH);  //Coreオブジェクト
    core.preload('./images/ootoro.png');
    core.preload('./images/obake.png');
    core.preload('./images/ikura.png');
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
      var hint1 = new Label("Hint1: 大トロはクリックすれば消せます");
      var hint2 = new Label("Hint2: 大トロを消すことでスコアが増えます");
      var hint3 = new Label("Hint3: イクラは消せません!ごめんね!");


      explain.x = WIDTH / 3;
      explain.y = LENGTH / 2;

      hint1.x = WIDTH / 3;
      hint2.x = WIDTH / 3;
      hint3.x = WIDTH / 3;
      hint1.y = (LENGTH / 2) + 60;
      hint2.y = (LENGTH / 2) + 90;
      hint3.y = (LENGTH / 2) + 120;

      core.rootScene.backgroundColor = "#b38f76"; // 茶色っぽい背景
      core.rootScene.addChild(titleName);
      core.rootScene.addChild(explain);
      core.rootScene.addChild(hint1);
      core.rootScene.addChild(hint2);
      core.rootScene.addChild(hint3);

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

          // hero狙い
          this.tl.moveTo(hero.x, hero.y, 200);

          // 判定処理
          this.addEventListener('enterframe', function(){

            // 中央に触れるまでセーフ
            if(this.within(hero, 40)){
              couseOfDeath = "大トロに衝突して死亡";
              core.pushScene(GameOverScene);  // ゲームオーバー処理をする
            }


            /*
            // ゲームとは思えない難易度になるため使用しない
            if(this.intersect(hero)){
              couseOfDeath = "大トロに接触して死亡";
              core.pushScene(GameOverScene);
            }
            */

          });

          second.addChild(this);
        }
      });

      /*
        イクラ
      */

      var Ikura = Class.create(Sprite, { // Spriteクラスから作る
        initialize: function(x, y){
          Sprite.call(this, 64, 62);  // spriteの時と同様
          this.x = x;
          this.y = y;
          this.image = core.assets['./images/ikura.png'];
          this.on('enterframe', function(){
            this.rotate(-15);
          });

          // ランダムな位置に落下 そして弾む
          this.tl.moveTo(rand(WIDTH), LENGTH, 400,  enchant.Easing.BOUNCE_EASEOUT);

          // 判定処理
          this.addEventListener('enterframe',function(){

            // 恐らくイージーモード 中央に触れるまでセーフ
            if(this.within(hero, 20)){
              couseOfDeath = "イクラに衝突して死亡";
              core.pushScene(GameOverScene);  // ゲームオーバー処理をする
            }

            /*
            // 触れれば死ぬ
            if(this.intersect(hero)){
              couseOfDeath = "イクラに接触して死亡";
              core.pushScene(GameOverScene);
            }
            */


          });
          second.addChild(this);
        }
      });

      var ootoros = [];
      var ikuras = [];
      var ootoroArea = 0;
      var toroCount = 0;
      var ikuraArea = 0;
      var ikuraCount = 0;

      // secondシーンに入ったら、タイマースタート
      second.addEventListener('enterframe', function(){
        timeLeft--;
        // 時間を整数値にして出力
        timeLabel.text = 'Time: ' + parseInt(timeLeft / 60);
        if((timeLeft % 40) == 0){
          // 大トロが飛んで来る場所を決める
          ootoroArea = rand(4); // 0 ~ 3
          switch(ootoroArea){
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
        // イクラは上からランダムに降らせる
        if((timeLeft % 15) == 0){
          ikuras[ikuraCount] = new Ikura(rand(WIDTH), -50);
          ikuraCount++;
        }

        if(timeLeft <= 0){
          couseOfDeath = "時間切れで死亡";
          //時間切れでゲームオーバーシーンへ移る
          core.pushScene(GameOverScene);
        }
      });

    /*
      中間エリア スコア129を達成した時のみ
    */

    /*
      発狂シーン 生きて返すつもりはない
    */

    /*
      真のゲームオーバーシーン 万が一クリアされた時のみ
    */

    /*
      GameOverシーン
    */

    var GameOverScene = new Scene();
    GameOverScene.backgroundColor = "#9fd4ff";

    // ゲームオーバーのメッセージ
    var GameOverMessage = new Label();
    GameOverMessage.text = 'GAMEOVER!';
    GameOverMessage.x = WIDTH/4;
    GameOverMessage.y = LENGTH/3;

    // 死因メッセージ

    var GameOverReason = new Label();

    // ゲームオーバー時のスコア表示
    var GameOverScore = new Label();

    GameOverScore.on('enterframe', function(){
      GameOverScore.text = 'Your score is ' + score + '.';
      GameOverReason.text = couseOfDeath;
    });

    GameOverScore.x = WIDTH / 4;
    GameOverScore.y = (LENGTH / 3) + 30;

    GameOverReason.x = WIDTH / 4;
    GameOverReason.y = (LENGTH / 3) + 60;

    GameOverScene.addChild(GameOverMessage);
    GameOverScene.addChild(GameOverScore);
    GameOverScene.addChild(GameOverReason);

    // ツイートボタン
    var tweet_label = new Label("white");
    tweet_label.x = WIDTH / 2;
    tweet_label.y = (LENGTH / 3) *2;
    tweet_label.text = "Tweetする";
    // タッチイベントを登録
    tweet_label.addEventListener('touchstart', function(){
      var EUC = encodeURIComponent;
      var twitter_url = "http://twitter.com/?status=";
      var message = "UnaScape(β)\n" + couseOfDeath + "\nスコアは " + score + " point";
      // Twitter に移動
      location.href = twitter_url+ EUC(message);
    });
    GameOverScene.addChild(tweet_label);

  }

  core.start();

};

function rand(n){
  return Math.floor(Math.random() * (n + 1)); // 0以上1未満の値*(n+1)の最大の整数値を返す
}
