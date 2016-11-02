var Module = {}
var IO = null
Module.injectIO = function ( io ) {
	IO = io
}
Module.getIO = function () { return IO }
module.exports = Module