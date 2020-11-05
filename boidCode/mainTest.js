function mainTest() {

    //double x = 1.32, y = 5.78;

    let boidAmount = 50;
    let winH = 300;
    let winW = 300;

    let myFlock = new Flock(boidAmount, winH, winW);


    let run = 0;

    while (run < 20) {

        myFlock.updateFlock();

    }
}

mainTest();