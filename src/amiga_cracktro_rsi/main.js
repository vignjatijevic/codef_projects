/**************************************************
	Red Sector Inc. Amiga Cracktro Remake (v1)
	------------------------------------------
	Original code: Mr Zero Page
	Original artwork & design: Red Sector Inc.
	Original music: 'amegas' by Karsten Obarski

	Javascript remake: Vladimir Ignjatijevic
					   igvlada@gmail.com
	CODEF framework: Antoine 'NoNameNo' Santo
	                 http://codef.santo.fr

	Uses: codef_core.js
		  codef_starfield.js
		  codef_scrolltext.js
		  codef_music.js
***************************************************/

// basepath
var basepath = "";

// constants
var STARFIELD_DENSITY = 32;
var STARFIELD_DOT_SIZE = 1;
var STARFIELD_SPEED = -3.34;
var LOGO_SPEED = 1.71;
var LOGO_BOUND_TOP = 50;
var LOGO_BOUND_BOTTOM = 110;
var SCROLLER_SPEED = 1.67;
var SCROLLER_RASTER_SPEED = 0.8;
var SCROLLER_Y_TOP = 14;
var SCROLLER_Y_BOTTOM = 186 - 14;
var SCROLLER_TEXT = "THE GREAT GIANA SISTER WAS CRACKED BY MR ZERO PAGE@@@@@ "
				  + "FOR THE COORPORATION TLC TCS AND RSI "
				  + "I INVITE EVERYBODY TO CRACK THIS PROGRAM "
				  + "BECAUSE IT WAS VERY FUNNY TO CRACK IT "
				  + "GOOD IDEA TO PUT MORE SECTORS ON ONE TRACK "
				  + "IF YOU NEED A COPY CONTACT ME  "
				  + "THIS TIME A BIG HELLO TO THE MAN WHO IS CALLED TO WALK LIKE A LEGEND "
				  + "YEAHHH PBA WHO HAS FORCES WITH RED SECTOR           ";

// canvases
var screen;
var canvas_main;
var canvas_scroller;

// music player
var player;

// gfx
var image_logo_red;
var image_logo_sector;
var image_font;
var image_raster;

// params
var starfield_2d;
var starfield_2d_params = [
        { nb: STARFIELD_DENSITY, size: STARFIELD_DOT_SIZE, color:'#cecece', speedy: 0, speedx: STARFIELD_SPEED },
        { nb: STARFIELD_DENSITY, size: STARFIELD_DOT_SIZE, color:'#737573', speedy: 0, speedx: STARFIELD_SPEED / 2 },
        { nb: STARFIELD_DENSITY, size: STARFIELD_DOT_SIZE, color:'#525552', speedy: 0, speedx: 0.0 },
	];
var logo_direction;
var logo_ypos1;
var logo_ypos2;
var scroller_text;
var scroller_raster_y;

/**************************************************/

function init() {

	// init screen canvas
	screen = new canvas(640, 400, 'screen');
	screen.contex.imageSmoothingEnabled = false;
	screen.contex.mozImageSmoothingEnabled = false;
	screen.contex.oImageSmoothingEnabled = false;
	screen.contex.webkitImageSmoothingEnabled = false;
	screen.fill('#000000');

	// init canvases
	canvas_main = new canvas(320, 200);
	canvas_scroller = new canvas(320, 14);
  
  	// init gfx
	image_logo_red = new image(basepath + 'rsc_logo_red.png');
	image_logo_sector = new image(basepath + 'rsc_logo_sector.png');
	image_raster = new image(basepath + 'rsc_font_raster.png');
	image_font = new image(basepath + 'rsc_font_interlaced.png');
	image_font.initTile(16, 14, 64);

	// init starfield
	starfield_2d = new starfield2D_dot(canvas_main, starfield_2d_params);

	// init scroller
	scrollertext = new scrolltext_horizontal();
	scrollertext.scrtxt = SCROLLER_TEXT;
	scrollertext.init(canvas_scroller, image_font, SCROLLER_SPEED);

	// init params
	logo_direction = 1;
	logo_ypos1 = LOGO_BOUND_TOP;
	logo_ypos2 = LOGO_BOUND_BOTTOM
	scroller_raster_y = 0;

	// init music player and start playing
	player = new music("MK");
	//player.stereo(true);
    player.LoadAndRun(basepath + 'rsc_amegas.mod');

    // start rendering
	renderFrame();
}

function renderFrame() {

	// clear canvases
	canvas_main.fill('#000000'); 
	canvas_scroller.fill('#000000');

	// draw starfield
	starfield_2d.draw();

	// update scroller raster
	scroller_raster_y -= SCROLLER_RASTER_SPEED;
	if (scroller_raster_y <= -18) {
		scroller_raster_y = 0;		
	}

	// rasterize scroller
	scrollertext.draw(0);
	canvas_scroller.contex.globalCompositeOperation = 'darken';
	image_raster.draw(canvas_scroller, 0, scroller_raster_y);
	canvas_scroller.contex.globalCompositeOperation = 'source-over';

	// draw scroller
	canvas_main.contex.globalCompositeOperation = 'lighter';
	canvas_scroller.draw(canvas_main, 0, SCROLLER_Y_TOP);
	canvas_scroller.draw(canvas_main, 0, SCROLLER_Y_BOTTOM);
	canvas_main.contex.globalCompositeOperation = 'source-over';

	// update logos
	logo_ypos1 += LOGO_SPEED * logo_direction;
	logo_ypos2 -= LOGO_SPEED * logo_direction;	

    if (logo_ypos1 > LOGO_BOUND_BOTTOM) {
      	logo_direction = -1;
    } else if (logo_ypos1 < LOGO_BOUND_TOP) {
    	logo_direction = 1;
    }

    // draw logos
    if (logo_direction == 1) {
		image_logo_red.draw(canvas_main, 0, logo_ypos1, 1, 0, 1, 1);
		image_logo_sector.draw(canvas_main, 0, logo_ypos2, 1, 0, 1, 1);
	} else {
		image_logo_sector.draw(canvas_main, 0, logo_ypos2, 1, 0, 1, 1);
		image_logo_red.draw(canvas_main, 0, logo_ypos1, 1, 0, 1, 1);
	}

	// copy main canvas (double sized) to screen canvas
	canvas_main.draw(screen, 0, 0, 1, 0, 2, 2);

	// update frame
	requestAnimFrame(renderFrame);
}
