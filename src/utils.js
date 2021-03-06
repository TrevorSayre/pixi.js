var CONST = require('./const');

/**
 * @namespace PIXI
 */
var saidHello = false;

/**
 * Converts a hex color number to an [R, G, B] array
 *
 * @param hex {number}
 * @return {number[]} An array representing the [R, G, B] of the color.
 */
exports.hex2rgb= function (hex, out)
{
	out = out || new Float32Array(3);
	out[0] = (hex >> 16 & 0xFF) / 255;
	out[1] = (hex >> 8 & 0xFF) / 255;
	out[2] = (hex & 0xFF) / 255;
	return out;
}

/**
 * Converts a hex color number to a string.
 *
 * @param hex {number}
 * @return {string} The string color.
 */
exports.hex2string= function (hex)
{
	return '#'+(hex|0x1000000).toString(16).slice(1);
}

/**
 * Converts a color as an [R, G, B] array to a hex number
 *
 * @param rgb {number[]}
 * @return {number} The color number
 */
exports.rgb2hex= function (rgb)
{
	return (rgb[0]*255 << 16) | (rgb[1]*255 << 8) | rgb[2]*255;
}

/**
 * Checks whether the Canvas BlendModes are supported by the current browser
 *
 * @return {boolean} whether they are supported
 */
exports.canUseNewCanvasBlendModes= function ()
{
	if (typeof document === 'undefined')
	{
		return false;
	}

	var canvas = document.createElement('canvas'),
		context = canvas.getContext('2d');

	canvas.width = 1;
	canvas.height = 1;

	context.fillStyle = '#000';
	context.fillRect(0, 0, 1, 1);

	context.globalCompositeOperation = 'multiply';

	context.fillStyle = '#fff';
	context.fillRect(0, 0, 1, 1);

	return context.getImageData(0,0,1,1).data[0] === 0;
}

/**
 * Given a number, this function returns the closest number that is a power of two
 * this function is taken from Starling Framework as its pretty neat ;)
 *
 * @param number {number}
 * @return {number} the closest number that is a power of two
 */
exports.getNextPowerOfTwo= function (number)
{
	number|=0;
	// see: http://en.wikipedia.org/wiki/Power_of_two#Fast_algorithm_to_check_if_a_positive_number_is_a_power_of_two
	if (number & (number - 1))
	{
		number--;
		number|=number>>1;
		number|=number>>2;
		number|=number>>4;
		number|=number>>8;
		number|=number>>16;
		number++;
	}
	return number;
}

/**
 * checks if the given width and height make a power of two rectangle
 *
 * @param width {number}
 * @param height {number}
 * @return {boolean}
 */
exports.isPowerOfTwo= function (width, height)
{
	width|=0;
	height|=0;
	return (width > 0 && (width & (width - 1)) === 0 && height > 0 && (height & (height - 1)) === 0);
}

/**
 * Logs out the version and renderer information for this running instance of PIXI.
 * If you don't want to see this message you can set `saidHello = true;`
 * so the library thinks it already said it. Keep in mind that doing that will forever
 * makes you a jerk face.
 *
 * @param {string} type - The string renderer type to log.
 * @constant
 * @static
 */
exports.sayHello= function (type)
{
	if (!saidHello)
	{
		console.log('Pixi.js ' + CONST.VERSION + ' - ' + type + ' - http://pixijs.com');
		saidHello = true;
	}
}
