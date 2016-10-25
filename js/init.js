var init = function () {
    var el = document.getElementById('world');
    el.width = window.
        c = el.getContext('2d')
    c.canvas.width = 1280 * .9;
    c.canvas.height = 720 * .9;
    c.imageSmoothingEnabled = false;

    document.addEventListener("fullscreenchange", function (e) {
        if (document.fullscreen) {
            c.canvas.width = 1280;
            c.canvas.height = 720;
        }
    });
    window.addEventListener("keydown", function (e) {
        var p1 = scenes[1].actors.find(findPlayer);

        keysDown[e.keyCode] = true;
        delete keysUp[e.keyCode];
        if (e.keyCode === 32) {
            p1.attacks.jab.execute(p1);
            if (game.currentScene === 0) {
                game.currentScene = 1;
            }
        }
    }, false);

    window.addEventListener("keyup", function (e) {

        keysUp[e.keyCode] = true;
        delete keysDown[e.keyCode];
    }, false);


    scenes.push(new Scene('title'))

    scenes[0].background = new Animation('rain', '../assets/rain.png', 32, 32, 5, 10);
    scenes[0].tileBackground = true;

    scenes.push(new Scene('main'))
    scenes[1].actors.push(new Player('p1', 50, 50))
    scenes[1].actors.push(new Player('enemy', 400, 250))
    //scenes[0].actors.push(new Player('enemy', 300, 550))

    var img2 = new Image();
    img2.src = '/assets/background.png';
    scenes[1].background = img2;

    stage = new Stage(c.canvas.height)
}