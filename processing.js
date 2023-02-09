// !!! Don't forget deleting cv.Mat !!!

// const cv = require("./vendor/opencv");

// import cv from './vendor/opencv';

var model;

async function loadModel() {
    
    model = await tf.loadGraphModel('TFJS/model.json');
    // const result = model.predict(myTensor);
    // result.print();
    // console.log(model)

  }

  function predictImage() {
    // console.log('preprocessing...');

    // https://docs.opencv.org/3.4/d2/df0/tutorial_js_table_of_contents_imgproc.html

    let image = cv.imread(canvas);
    // https://docs.opencv.org/3.4/db/d64/tutorial_js_colorspaces.html
    cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);
    // https://docs.opencv.org/3.4/d7/dd0/tutorial_js_thresholding.html
    cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);

    // Contours
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    // Bounding Rectangle, finding the boundary rectangle
    // https://docs.opencv.org/3.4/dc/dcf/tutorial_js_contour_features.html
    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);

    // Grab and Cut the found Rectanglar Area
    // https://docs.opencv.org/3.4/js_basic_ops_roi.html
    image = image.roi(rect);

    // Resize
    // https://docs.opencv.org/4.x/js_geometric_transformations_resize.html

    var height = image.rows;
    var width = image.cols;
    // const resizeHeight = 20;

    // var ratio = height/resizeHeight;
    // var resizeWidth = Math.round(width/ratio);

    // let dsize = new cv.Size(resizeWidth, resizeHeight);
    // cv.resize(image, image, dsize, 0, 0, cv.INTER_AREA);

    // ---- Solutions ---- //
    if (height > width) {
        height = 20;
        const scaleFactor = image.rows / height;
        width = Math.round(image.cols/scaleFactor);
    } else {
        width = 20;
        const scaleFactor = image.cols / width;
        height = Math.round(image.rows/scaleFactor);
    }

    let newSize = new cv.Size(width, height);
    cv.resize(image, image, newSize, 0, 0, cv.INTER_AREA);

    // Paddings
    const LEFT = Math.ceil(4 + (20 - width) / 2);
    const RIGHT = Math.floor(4 + (20 - width) / 2);
    const TOP = Math.ceil(4 + (20 - height) / 2);
    const BOTTOM = Math.floor(4 + (20 - height) / 2);

    // console.log(`top: ${TOP}, bottom: ${BOTTOM}, left: ${LEFT}, right: ${RIGHT}`);

    const BLACK = new cv.Scalar(0, 0, 0, 0);
    cv.copyMakeBorder(image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, BLACK);


    // Centre of Mass
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    const Moments = cv.moments(cnt, false);

    const cx = Moments.m10 / Moments.m00;
    const cy = Moments.m01 / Moments.m00;
    // console.log(`M00: ${Moments.m00}, cx: ${cx}, cy: ${cy}`);

    const X_SHIFT = Math.round(image.cols/2.0 - cx);
    const Y_SHIFT = Math.round(image.rows/2.0 - cy);

    // Centralize Image
    // https://docs.opencv.org/3.4/dd/d52/tutorial_js_geometric_transformations.html
    const M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
    newSize = new cv.Size(image.cols, image.rows);
// You can try more different parameters
    cv.warpAffine(image, image, M, newSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK);

    // Normalize pixels
    let pixelValues = image.data;
    // console.log(`pixel values: ${pixelValues}`);

    pixelValues = new Float32Array(pixelValues);

    pixelValues = pixelValues.map(function (item) {
        return item / 255.0;
    });

    // console.log(`scaled array: ${pixelValues}`);

    // Create Tensor
    const X = tf.tensor([pixelValues]);
    // console.log(`Shape of Tensor: ${X.shape}`);
    // console.log(`dtype of Tensor: ${X.dtype}`);

    // Prediction
    const result = model.predict(X);
    result.print();

    // https://js.tensorflow.org/api/latest/
    const output = result.dataSync()[0];

    // 
    // console.log(tf.memory());

    // free up memory

    // Testing Only (delete later)
    const outputCanvas = document.createElement('CANVAS');
    cv.imshow(outputCanvas, image);
    document.body.appendChild(outputCanvas);

    // Cleanup
    image.delete();
    contours.delete();
    cnt.delete();
    hierarchy.delete();
    M.delete();

    // release memory
    X.dispose();
    result.dispose();

    return output;

  }