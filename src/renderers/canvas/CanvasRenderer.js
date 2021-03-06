var SystemRenderer = require('../SystemRenderer'),
    CanvasMaskManager = require('./utils/CanvasMaskManager'),
    utils = require('../../utils'),
    math = require('../../math'),
    CONST = require('../../const');

/**
 * The CanvasRenderer draws the scene and all its content onto a 2d canvas. This renderer should be used for browsers that do not support webGL.
 * Don't forget to add the CanvasRenderer.view to your DOM or you will not see anything :)
 *
 * @class
 * @namespace PIXI
 * @param [width=800] {number} the width of the canvas view
 * @param [height=600] {number} the height of the canvas view
 * @param [options] {object} The optional renderer parameters
 * @param [options.view] {HTMLCanvasElement} the canvas to use as a view, optional
 * @param [options.clearBeforeRender=true] {boolean} This sets if the CanvasRenderer will clear the canvas or
 *      not before the new render pass.
 */
function CanvasRenderer(width, height, options)
{
    SystemRenderer.call(this, 'Canvas', width, height, options);

    this.type = CONST.RENDERER_TYPE.CANVAS;

    /**
     * The canvas 2d context that everything is drawn with.
     *
     * @member {CanvasRenderingContext2D}
     */
    this.context = this.view.getContext('2d', { alpha: true });

    /**
     * Boolean flag controlling canvas refresh.
     *
     * @member {boolean}
     */
    this.refresh = true;

    /**
     * Instance of a CanvasMaskManager, handles masking when using the canvas renderer.
     *
     * @member {CanvasMaskManager}
     */
    this.maskManager = new CanvasMaskManager();

    /**
     * Tracks the active scale mode for this renderer.
     *
     * @member {CONST.SCALE_MODE}
     */
    this.currentScaleMode = CONST.scaleModes.DEFAULT;

    /**
     * Tracks the active blend mode for this renderer.
     *
     * @member {CONST.SCALE_MODE}
     */
    this.currentBlendMode = CONST.blendModes.NORMAL;

    this._mapBlendModes();

    /**
     * This temporary display object used as the parent of the currently being rendered item
     *
     * @member DisplayObject
     * @private
     */
    this._tempDisplayObjectParent = {
        worldTransform: new math.Matrix(),
        worldAlpha: 1
    };

    this.resize(width, height);
}

// constructor
CanvasRenderer.prototype = Object.create(SystemRenderer.prototype);
CanvasRenderer.prototype.constructor = CanvasRenderer;
module.exports = CanvasRenderer;

/**
 * Renders the object to this canvas view
 *
 * @param object {DisplayObject} the object to be rendered
 */
CanvasRenderer.prototype.render = function (object)
{
    var cacheParent = object.parent;
    object.parent = this._tempDisplayObjectParent;

    // update the scene graph
    object.updateTransform();

    object.parent = cacheParent;

    this.context.setTransform(1, 0, 0, 1, 0, 0);

    this.context.globalAlpha = 1;

    this.currentBlendMode = CONST.blendModes.NORMAL;
    this.context.globalCompositeOperation = this.blendModes[CONST.blendModes.NORMAL];

    if (this.clearBeforeRender)
    {
		this.context.clearRect(0, 0, this.width, this.height);
    }

    this.renderDisplayObject(object, this.context);
};

/**
 * Removes everything from the renderer and optionally removes the Canvas DOM element.
 *
 * @param [removeView=false] {boolean} Removes the Canvas element from the DOM.
 */
CanvasRenderer.prototype.destroy = function (removeView)
{
    // call the base destroy
    SystemRenderer.prototype.destroy.call(this, removeView);

    this.context = null;

    this.refresh = true;

    this.maskManager.destroy();
    this.maskManager = null;

    this.currentScaleMode = 0;
    this.currentBlendMode = 0;
};

/**
 * Renders a display object
 *
 * @param displayObject {DisplayObject} The displayObject to render
 * @private
 */
CanvasRenderer.prototype.renderDisplayObject = function (displayObject, context)
{
    var tempContext = this.context;

    this.context = context;
    displayObject.renderCanvas(this);
    this.context = tempContext;
};

/**
 * Maps Pixi blend modes to canvas blend modes.
 *
 * @private
 */
CanvasRenderer.prototype._mapBlendModes = function ()
{
    if (!this.blendModes)
    {
        this.blendModes = {};

        if (utils.canUseNewCanvasBlendModes())
        {
            this.blendModes[CONST.blendModes.NORMAL]        = 'source-over';
            this.blendModes[CONST.blendModes.ADD]           = 'lighter'; //IS THIS OK???
            this.blendModes[CONST.blendModes.MULTIPLY]      = 'multiply';
            this.blendModes[CONST.blendModes.SCREEN]        = 'screen';
            this.blendModes[CONST.blendModes.OVERLAY]       = 'overlay';
            this.blendModes[CONST.blendModes.DARKEN]        = 'darken';
            this.blendModes[CONST.blendModes.LIGHTEN]       = 'lighten';
            this.blendModes[CONST.blendModes.COLOR_DODGE]   = 'color-dodge';
            this.blendModes[CONST.blendModes.COLOR_BURN]    = 'color-burn';
            this.blendModes[CONST.blendModes.HARD_LIGHT]    = 'hard-light';
            this.blendModes[CONST.blendModes.SOFT_LIGHT]    = 'soft-light';
            this.blendModes[CONST.blendModes.DIFFERENCE]    = 'difference';
            this.blendModes[CONST.blendModes.EXCLUSION]     = 'exclusion';
            this.blendModes[CONST.blendModes.HUE]           = 'hue';
            this.blendModes[CONST.blendModes.SATURATION]    = 'saturation';
            this.blendModes[CONST.blendModes.COLOR]         = 'color';
            this.blendModes[CONST.blendModes.LUMINOSITY]    = 'luminosity';
        }
        else
        {
            // this means that the browser does not support the cool new blend modes in canvas 'cough' ie 'cough'
            this.blendModes[CONST.blendModes.NORMAL]        = 'source-over';
            this.blendModes[CONST.blendModes.ADD]           = 'lighter'; //IS THIS OK???
            this.blendModes[CONST.blendModes.MULTIPLY]      = 'source-over';
            this.blendModes[CONST.blendModes.SCREEN]        = 'source-over';
            this.blendModes[CONST.blendModes.OVERLAY]       = 'source-over';
            this.blendModes[CONST.blendModes.DARKEN]        = 'source-over';
            this.blendModes[CONST.blendModes.LIGHTEN]       = 'source-over';
            this.blendModes[CONST.blendModes.COLOR_DODGE]   = 'source-over';
            this.blendModes[CONST.blendModes.COLOR_BURN]    = 'source-over';
            this.blendModes[CONST.blendModes.HARD_LIGHT]    = 'source-over';
            this.blendModes[CONST.blendModes.SOFT_LIGHT]    = 'source-over';
            this.blendModes[CONST.blendModes.DIFFERENCE]    = 'source-over';
            this.blendModes[CONST.blendModes.EXCLUSION]     = 'source-over';
            this.blendModes[CONST.blendModes.HUE]           = 'source-over';
            this.blendModes[CONST.blendModes.SATURATION]    = 'source-over';
            this.blendModes[CONST.blendModes.COLOR]         = 'source-over';
            this.blendModes[CONST.blendModes.LUMINOSITY]    = 'source-over';
        }
    }
};
